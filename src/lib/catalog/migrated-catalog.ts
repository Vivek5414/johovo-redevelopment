import type { ProductBrandIdentity } from "@/lib/brand/identity";
import rawProductsData from "@/data/products.json";
import backupProductsData from "@/data/products.backup.json";

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
  amazonUrl?: string | null;
  flipkartUrl?: string | null;
};

export type CatalogCategory = {
  id: number;
  name: string;
  slug: string;
  parentId: number;
  productCount: number;
};

export const PRODUCT_CATEGORY_OPTIONS = [
  { slug: "herbal-products", name: "Herbal Products" },
  { slug: "healthy-snacks", name: "Healthy Snacks" },
  { slug: "oils", name: "Oils" },
] as const;

export function normalizeProductCategorySlug(value: string | null | undefined): string {
  const raw = (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const directMap: Record<string, string> = {
    "herbal-products": "herbal-products",
    "herbal-care": "herbal-products",
    "hair-care": "herbal-products",
    "face-care": "herbal-products",
    "lip-care": "herbal-products",
    "body-care": "herbal-products",
    "healthy-snacks": "healthy-snacks",
    "wellness-snacks": "healthy-snacks",
    "wellness-healthy-snacks": "healthy-snacks",
    "snacks": "healthy-snacks",
    "oils": "oils",
    "cold-pressed-oils": "oils",
    "cold-pressed-oil": "oils",
    "marachekku-oils": "oils",
    "oil": "oils",
  };

  if (directMap[raw]) {
    return directMap[raw];
  }

  if (raw.includes("snack")) {
    return "healthy-snacks";
  }

  if (raw.includes("oil") || raw.includes("marachekku")) {
    return "oils";
  }

  return "herbal-products";
}

export function resolveCatalogCategorySlug(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return normalizeProductCategorySlug(value);
}

export function getCanonicalCategoryLabel(value: string | null | undefined): string {
  const slug = normalizeProductCategorySlug(value);
  const match = PRODUCT_CATEGORY_OPTIONS.find((item) => item.slug === slug);
  return match?.name ?? "Herbal Products";
}

function normalizeProductCategories(product: CatalogProduct): CatalogProduct {
  const normalizedCategories = Array.from(
    new Map(
      (product.categories ?? []).map((category) => {
        const slug = normalizeProductCategorySlug(category.slug || category.name);
        const label = getCanonicalCategoryLabel(slug);
        return [slug, { id: Number(category.id) || 0, name: label, slug }];
      }),
    ).values(),
  );

  const categorySlugs = normalizedCategories.map((category) => category.slug);

  return {
    ...product,
    categories: normalizedCategories.length ? normalizedCategories : [{ id: 0, name: "Herbal Products", slug: "herbal-products" }],
    categorySlugs: Array.from(new Set(categorySlugs.length ? categorySlugs : ["herbal-products"])),
  };
}

const primaryCatalogData = Array.isArray(rawProductsData) && rawProductsData.length > 0
  ? (rawProductsData as CatalogProduct[])
  : (backupProductsData as CatalogProduct[]);

export const catalogProducts: CatalogProduct[] = primaryCatalogData.map(normalizeProductCategories);

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
  const normalizedProducts = products.map(normalizeProductCategories);
  const categoryMap = new Map<string, { id: number; name: string; slug: string; parentId: number; productCount: number }>();

  for (const product of normalizedProducts) {
    for (const category of product.categories) {
      const slug = normalizeProductCategorySlug(category.slug || category.name);
      if (!categoryMap.has(slug)) {
        categoryMap.set(slug, {
          id: category.id || 0,
          name: getCanonicalCategoryLabel(slug),
          slug,
          parentId: 0,
          productCount: 0,
        });
      }
      const existing = categoryMap.get(slug)!;
      existing.productCount += 1;
    }
  }

  return PRODUCT_CATEGORY_OPTIONS.map(({ slug, name }) => {
    const existing = categoryMap.get(slug);
    return {
      id: existing?.id ?? 0,
      name,
      slug,
      parentId: 0,
      productCount: existing?.productCount ?? 0,
    };
  });
}

export function getCatalogProduct(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug);
}
