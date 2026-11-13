import { sql } from "@/lib/db";
import { retryTransientRequest } from "@/lib/upload-service";
import {
  catalogProducts,
  type CatalogProduct,
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

  // Format Google Drive preview URLs if drive_file_id exists
  let mainImageSrc = rec.image_url || "/images/products/iyalmooligai-herbal-hair-oil.png";
  if (rec.drive_file_id) {
    mainImageSrc = `https://drive.google.com/thumbnail?id=${rec.drive_file_id}&sz=w1000`;
  }

  const categorySlug = (rec.category || "herbal-care")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

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
    productImages: [
      {
        src: mainImageSrc,
        alt: rec.name,
        name: rec.name,
        originalSourceUrl: `/products/${rec.slug}`,
        role: "main",
      },
    ],
    ingredientImages: [],
    videos: [],
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
        is_active,
        created_at
      FROM custom_products
      WHERE is_active = TRUE
      ORDER BY created_at DESC;
    `);

    return (rows || []).map(mapCustomProductToCatalog);
  } catch (error) {
    // If table not yet queried or connection hiccup, return empty array
    return [];
  }
}

/**
 * Returns merged catalog products (static catalog + Neon custom products)
 */
export async function getAllProducts(): Promise<CatalogProduct[]> {
  const custom = await getCustomProducts();
  return [...custom, ...catalogProducts];
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
