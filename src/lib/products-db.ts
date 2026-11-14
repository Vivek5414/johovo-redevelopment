import { sql } from "@/lib/db";
import { retryTransientRequest } from "@/lib/upload-service";
import { getDirectImageUrl } from "@/lib/drive-image-utils";
import {
  catalogProducts,
  type CatalogProduct,
  type CatalogImage,
  type CatalogVideo,
} from "@/lib/catalog/migrated-catalog";

export type CustomProductRecord = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  sku: string | null;
  category: string;
  selling_price: number;
  mrp: number;
  net_quantity: string;
  short_description: string | null;
  full_description: string | null;
  ingredients: string | null;
  benefits: string | null;
  usage_instructions: string | null;
  image_url: string | null;
  drive_file_id: string | null;
  gallery_images: any[];
  videos: any[];
  amazon_url?: string | null;
  flipkart_url?: string | null;
  is_active: boolean;
  created_at: string;
};

/**
 * Transforms a database record from `custom_products` into a standard `CatalogProduct`
 */
export function mapCustomProductToCatalog(rec: any): CatalogProduct {
  const sellingPrice = Number(rec.selling_price || 0);
  const mrp = Number(rec.mrp || sellingPrice);
  const discountStr =
    mrp > sellingPrice
      ? `${Math.round(((mrp - sellingPrice) / mrp) * 100)}% off`
      : null;

  // Format Google Drive preview URLs if drive_file_id exists or URL is present
  const mainImageSrc = getDirectImageUrl(rec.image_url, rec.drive_file_id);

  const categorySlug = (rec.category || "herbal-care")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  // Process gallery images (multiple images)
  const rawGallery = Array.isArray(rec.gallery_images) ? rec.gallery_images : [];
  const galleryCatalogImages: CatalogImage[] = rawGallery.map((img: any, idx: number) => {
    const rawSrc = typeof img === "string" ? img : img.url || img.src;
    const driveId = typeof img === "object" ? img.drive_file_id || img.fileId : null;
    const src = getDirectImageUrl(rawSrc, driveId);
    return {
      src: src || mainImageSrc,
      alt: `${rec.name} photo ${idx + 1}`,
      name: null,
      originalSourceUrl: `/products/${rec.slug}`,
      role: "gallery" as const,
    };
  });

  const allProductImages: CatalogImage[] = [
    {
      src: mainImageSrc,
      alt: rec.name,
      name: rec.name,
      originalSourceUrl: `/products/${rec.slug}`,
      role: "main" as const,
    },
    ...galleryCatalogImages,
  ];

  // Process videos
  const rawVideos = Array.isArray(rec.videos) ? rec.videos : [];
  const catalogVideos: CatalogVideo[] = rawVideos.map((v: any) => ({
    src: typeof v === "string" ? v : v.url || v.src || "",
    originalSourceUrl: `/products/${rec.slug}`,
  })).filter((v: CatalogVideo) => Boolean(v.src));

  return {
    id: 100000 + Number(rec.id),
    slug: rec.slug,
    name: rec.name,
    brand: (rec.brand?.toLowerCase() === "iyalmooligai" ? "iyalmooligai" : "johovo") as any,
    sku: rec.sku || `JH-${rec.id}`,
    categories: [
      {
        id: 999,
        name: rec.category || "Herbal Care",
        slug: categorySlug,
      },
    ],
    categorySlugs: [categorySlug],
    shortDescription: rec.short_description || rec.name,
    fullDescription: [
      rec.full_description,
      rec.ingredients ? `Ingredients: ${rec.ingredients}` : "",
      rec.benefits ? `Benefits: ${rec.benefits}` : "",
      rec.usage_instructions ? `Directions: ${rec.usage_instructions}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    originalPrice: mrp,
    sellingPrice,
    sourceDiscount: discountStr,
    currency: "INR",
    sizes: [rec.net_quantity || "Standard"],
    productImages: allProductImages,
    ingredientImages: [],
    videos: catalogVideos,
    reviews: [],
    averageRating: 4.9,
    reviewCount: 1,
    originalSourceUrl: `/products/${rec.slug}`,
    migrationNotes: ["Admin managed custom product via Neon DB & Google Drive"],
    showcaseTitle: rec.name,
    showcaseDescription: rec.short_description || undefined,
    showcaseImage: mainImageSrc,
    showcaseImageAlt: rec.name,
    verifiedSize: rec.net_quantity || "Standard",
    amazonUrl: rec.amazon_url || null,
    flipkartUrl: rec.flipkart_url || null,
  };
}

/**
 * Fetches all custom products created in Neon DB
 */
export async function getCustomProducts(): Promise<CatalogProduct[]> {
  try {
    const rows = await retryTransientRequest(async () => sql`
      SELECT
        id,
        name,
        slug,
        brand,
        sku,
        category,
        selling_price,
        mrp,
        net_quantity,
        short_description,
        full_description,
        ingredients,
        benefits,
        usage_instructions,
        image_url,
        drive_file_id,
        gallery_images,
        videos,
        amazon_url,
        flipkart_url,
        is_active,
        created_at
      FROM custom_products
      WHERE is_active = TRUE
      ORDER BY created_at DESC;
    `);

    return (rows || []).map(mapCustomProductToCatalog);
  } catch (error) {
    return [];
  }
}

/**
 * Returns merged catalog products (custom products from DB, with fallback to static catalog if DB is empty)
 */
export async function getAllProducts(): Promise<CatalogProduct[]> {
  const custom = await getCustomProducts();
  if (custom.length > 0) {
    return custom;
  }
  return catalogProducts;
}

/**
 * Fetches single product by slug from custom DB or static catalog
 */
export async function getProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  try {
    const rows = await retryTransientRequest(async () => sql`
      SELECT
        id,
        name,
        slug,
        brand,
        sku,
        category,
        selling_price,
        mrp,
        net_quantity,
        short_description,
        full_description,
        ingredients,
        benefits,
        usage_instructions,
        image_url,
        drive_file_id,
        gallery_images,
        videos,
        amazon_url,
        flipkart_url,
        is_active,
        created_at
      FROM custom_products
      WHERE slug = ${slug} AND is_active = TRUE
      LIMIT 1;
    `);

    if (rows && rows.length > 0) {
      return mapCustomProductToCatalog(rows[0]);
    }
  } catch (err) {
    // fall through to static catalog
  }

  return catalogProducts.find((p) => p.slug === slug);
}
