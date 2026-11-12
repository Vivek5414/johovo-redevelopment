import type { ProductBrandIdentity } from "@/lib/brand/identity";
import rawProductsData from "@/data/products.json";

export type CatalogImage = {
  src: string;
  alt: string;
  name: string | null;
  originalSourceUrl: string;
  role: "main" | "gallery" | "ingredient";
};

export type CatalogReview = {
  author: string | null;
  date: string | null;
  text: string;
  rating: number | null;
  originalSourceUrl: string | null;
};

export type CatalogVideo = {
  src: string;
  originalSourceUrl: string;
};

export type CatalogProduct = {
  id: number;
  slug: string;
  name: string;
  brand: ProductBrandIdentity;
  sku: string | null;
  categories: { id: number; name: string; slug: string }[];
  categorySlugs: string[];
  shortDescription: string | null;
  fullDescription: string | null;
  originalPrice: number | null;
  sellingPrice: number | null;
  sourceDiscount: string | null;
  currency: string | null;
  sizes: string[];
  productImages: CatalogImage[];
  ingredientImages: CatalogImage[];
  videos: CatalogVideo[];
  reviews: CatalogReview[];
  averageRating: number | null;
  reviewCount: number;
  originalSourceUrl: string;
  migrationNotes: string[];
  title?: string;
  showcaseTitle?: string;
  showcaseDescription?: string;
  showcaseImage?: string;
  showcaseImageAlt?: string;
  verifiedSize?: string;
};

export type CatalogCategory = {
  id: number;
  name: string;
  slug: string;
  parentId: number;
  productCount: number;
};

export const catalogProducts: CatalogProduct[] = rawProductsData as unknown as CatalogProduct[];

export function sourceHtmlToText(html: string | null | undefined): string | null {
  if (!html) return null;

  const text = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "\n• ")
    .replace(/<\/(?:p|div|section|article|ul|ol|li|h[1-6]|blockquote)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(
      /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp|rsquo|lsquo|rdquo|ldquo|ndash|mdash|trade|hellip|copy|reg);/gi,
      (entity, value: string) => {
        if (value.startsWith("#x")) {
          const codePoint = Number.parseInt(value.slice(2), 16);
          return Number.isFinite(codePoint) && codePoint <= 0x10ffff
            ? String.fromCodePoint(codePoint)
            : entity;
        }

        if (value.startsWith("#")) {
          const codePoint = Number.parseInt(value.slice(1), 10);
          return Number.isFinite(codePoint) && codePoint <= 0x10ffff
            ? String.fromCodePoint(codePoint)
            : entity;
        }

        const entities: Record<string, string> = {
          amp: "&",
          lt: "<",
          gt: ">",
          quot: '"',
          apos: "'",
          nbsp: "\u00a0",
          rsquo: "\u2019",
          lsquo: "\u2018",
          rdquo: "\u201d",
          ldquo: "\u201c",
          ndash: "\u2013",
          mdash: "\u2014",
          trade: "\u2122",
          hellip: "\u2026",
          copy: "\u00a9",
          reg: "\u00ae",
        };
        return entities[value.toLowerCase()] ?? entity;
      },
    )
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text || null;
}

export function getCatalogCategories(
  products: CatalogProduct[] = catalogProducts,
): CatalogCategory[] {
  const categoryMap = new Map<string, { id: number; name: string; slug: string; parentId: number; productCount: number }>();

  for (const product of products) {
    for (const cat of product.categories) {
      if (!categoryMap.has(cat.slug)) {
        categoryMap.set(cat.slug, {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          parentId: 0,
          productCount: 0,
        });
      }
      const existing = categoryMap.get(cat.slug)!;
      existing.productCount += 1;
    }
  }

  // Ensure top-level face-care category exists
  if (!categoryMap.has("face-care")) {
    const faceCount = products.filter((p) => p.categorySlugs.includes("face-care")).length;
    categoryMap.set("face-care", {
      id: 64,
      name: "Face Care",
      slug: "face-care",
      parentId: 0,
      productCount: faceCount,
    });
  }

  return Array.from(categoryMap.values());
}

export function getCatalogProduct(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug);
}
