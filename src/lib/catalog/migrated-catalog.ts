import type { ProductBrandIdentity } from "@/lib/brand/identity";
import { getShowcaseProduct } from "@/lib/catalog/showcase-products";
import {
  migratedGenuineProducts,
  migratedPublicRouteSnapshots,
  migratedSourceTaxonomies,
} from "@/lib/migration/migrated-content";

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
};

export type CatalogCategory = {
  id: number;
  name: string;
  slug: string;
  parentId: number;
  productCount: number;
};

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

function localPublicPath(path: string | null): string | null {
  if (!path?.startsWith("public/")) return null;
  return `/${path.slice("public/".length)}`;
}

function parseMinorPrice(
  amount: string | null,
  minorUnit: number | null,
): number | null {
  if (amount === null) return null;
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount)) return null;
  return parsedAmount / 10 ** (minorUnit ?? 2);
}

function categoriesForProduct(productId: number): {
  direct: CatalogProduct["categories"];
  allSlugs: string[];
} {
  const product = migratedGenuineProducts.find(({ id }) => id === productId);
  if (!product) return { direct: [], allSlugs: [] };

  const categories = migratedSourceTaxonomies.categories;
  const direct = product.categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
  }));
  const ids = new Set(direct.map(({ id }) => id));

  for (const category of direct) {
    let parentId =
      categories.find(({ id }) => id === category.id)?.parentId ?? 0;

    while (parentId !== 0 && !ids.has(parentId)) {
      ids.add(parentId);
      parentId = categories.find(({ id }) => id === parentId)?.parentId ?? 0;
    }
  }

  const allSlugs = categories
    .filter(({ id }) => ids.has(id))
    .map(({ slug }) => slug);

  return { direct, allSlugs };
}

function attributeSizes(attributes: unknown[]): string[] {
  const allowedNames = new Set(["size", "weight", "volume", "quantity", "pack"]);
  const sizes: string[] = [];

  for (const attribute of attributes) {
    if (!attribute || typeof attribute !== "object") continue;
    const record = attribute as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name.toLowerCase() : "";
    if (!allowedNames.has(name) || !Array.isArray(record.terms)) continue;

    for (const term of record.terms) {
      if (
        term &&
        typeof term === "object" &&
        "name" in term &&
        typeof term.name === "string" &&
        !sizes.includes(term.name)
      ) {
        sizes.push(term.name);
      }
    }
  }

  return sizes;
}

function sourcePageSizes(sourceUrl: string): string[] {
  const route = migratedPublicRouteSnapshots.routes.find(
    (snapshot) =>
      snapshot.type === "product" && snapshot.sourceUrl === sourceUrl,
  );
  const pageText = sourceHtmlToText(route?.mainContentHtml);
  if (!pageText) return [];

  return [
    ...new Set(
      pageText.match(/\b\d+(?:\.\d+)?\s?(?:mg|ml|g|kg|l)\b/gi) ?? [],
    ),
  ];
}

function mapProductImages(
  images: (typeof migratedGenuineProducts)[number]["images"],
  productSlug: string,
  name: string,
  roles: Set<CatalogImage["role"]>,
): CatalogImage[] {
  return images.flatMap((image) => {
    const role =
      image.role === "product-main"
        ? "main"
        : image.role === "product-gallery"
          ? "gallery"
          : null;
    if (!role || !roles.has(role)) return [];

    const presentation =
      role === "main" ? getShowcaseProduct(productSlug) : undefined;
    const src = presentation?.imageSrc ?? localPublicPath(image.localPath);
    if (
      !src ||
      (!presentation &&
        (!image.localPath || !image.migrationStatus.startsWith("downloaded")))
    ) {
      return [];
    }

    return [
      {
        src,
        alt:
          (role === "main" ? presentation?.imageAlt : null) ??
          image.alt?.trim() ??
          name,
        name: image.name,
        originalSourceUrl: image.sourceUrl,
        role,
      },
    ];
  });
}

function mapProduct(product: (typeof migratedGenuineProducts)[number]): CatalogProduct {
  const sourcePrices = product.sourceStorefront?.prices;
  const currencyMinorUnit =
    sourcePrices && typeof sourcePrices.currency_minor_unit === "number"
      ? sourcePrices.currency_minor_unit
      : 2;
  const brand: ProductBrandIdentity =
    product.brandIdentity.toLowerCase() === "iyalmooligai"
      ? "iyalmooligai"
      : "johovo";
  const name = sourceHtmlToText(product.name) ?? product.name;
  const { direct, allSlugs } = categoriesForProduct(product.id);
  const productImages = mapProductImages(
    product.images,
    product.slug,
    name,
    new Set(["main", "gallery"]),
  );
  const ingredientImages = product.ingredientImages.flatMap((image) => {
    const migrationStatus =
      typeof image.migrationStatus === "string"
        ? image.migrationStatus
        : typeof image.status === "string"
          ? image.status
          : "";
    if (
      typeof image.localPath !== "string" ||
      typeof image.sourceUrl !== "string" ||
      !migrationStatus.startsWith("downloaded")
    ) {
      return [];
    }

    const src = localPublicPath(image.localPath);
    if (!src) return [];
    const imageName =
      typeof image.name === "string"
        ? image.name
        : image.sourceUrl
            .split("/")
            .pop()
            ?.replace(/\.[^.]+$/, "")
            .replace(/[-_]+/g, " ") ?? null;

    return [
      {
        src,
        alt:
          typeof image.alt === "string" && image.alt.trim()
            ? image.alt.trim()
            : imageName
              ? `Source ingredient illustration: ${imageName}`
              : name,
        name: imageName,
        originalSourceUrl: image.sourceUrl,
        role: "ingredient" as const,
      },
    ];
  });
  const reviews = product.reviews.flatMap((review) => {
    const text = sourceHtmlToText(review.contentHtml);
    return text
      ? [
          {
            author: review.authorName,
            date: review.date,
            text,
            rating: review.rating,
            originalSourceUrl: review.sourceUrl,
          },
        ]
      : [];
  });
  const averageRating = Number(product.rating.averageRating);
  const sizes = attributeSizes(product.attributes);
  for (const size of sourcePageSizes(product.productUrl)) {
    if (!sizes.some((existing) => existing.toLowerCase() === size.toLowerCase())) {
      sizes.push(size);
    }
  }

  return {
    id: product.id,
    slug: product.slug,
    name,
    brand,
    sku: product.sku,
    categories: direct,
    categorySlugs: allSlugs,
    shortDescription: sourceHtmlToText(product.shortDescriptionHtml),
    fullDescription: sourceHtmlToText(product.fullDescriptionHtml),
    originalPrice: parseMinorPrice(
      product.price.regularPriceMinorUnits,
      currencyMinorUnit,
    ),
    sellingPrice: parseMinorPrice(
      product.price.activePriceMinorUnits,
      currencyMinorUnit,
    ),
    sourceDiscount:
      typeof product.price.sourceBadgeDiscount === "string"
        ? product.price.sourceBadgeDiscount
        : null,
    currency: sourcePrices?.currency_code ?? null,
    sizes,
    productImages,
    ingredientImages,
    videos: product.videos.flatMap((video) => {
      if (
        video.associationStatus !== "observed-on-product-page" ||
        !video.localPath
      ) {
        return [];
      }

      const src = localPublicPath(video.localPath);
      return src ? [{ src, originalSourceUrl: video.sourceUrl }] : [];
    }),
    reviews,
    averageRating:
      Number.isFinite(averageRating) && averageRating > 0
        ? averageRating
        : null,
    reviewCount: product.rating.reviewCount,
    originalSourceUrl: product.productUrl,
    migrationNotes: product.migrationNotes,
  };
}

export const catalogProducts = migratedGenuineProducts.map(mapProduct);

export function getCatalogCategories(
  products: CatalogProduct[] = catalogProducts,
): CatalogCategory[] {
  return migratedSourceTaxonomies.categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    parentId: category.parentId,
    productCount: products.filter((product) =>
      product.categorySlugs.includes(category.slug),
    ).length,
  }));
}

export function getCatalogProduct(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.slug === slug);
}
