import { z } from "zod";
import catalogData from "@/lib/catalog/migrated-products.json";
import pagesData from "@/lib/migration/public-pages.json";
import routeSnapshotsData from "@/lib/migration/public-route-snapshots.json";
import taxonomiesData from "@/lib/migration/source-taxonomies.json";

const sourceCategorySchema = z
  .object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    sourceUrl: z.string().url(),
    parentId: z.number(),
  })
  .passthrough();

const sourceTagSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    sourceUrl: z.string().url(),
  })
  .passthrough();

const sourceReviewSchema = z
  .object({
    id: z.number(),
    authorName: z.string().nullable(),
    date: z.string().nullable(),
    location: z.string().nullable(),
    rating: z.number().nullable(),
    contentHtml: z.string(),
    sourceUrl: z.string().url().nullable(),
  })
  .passthrough();

const sourceImageSchema = z
  .object({
    id: z.number(),
    sourceUrl: z.string().url(),
    localPath: z.string().nullable(),
    name: z.string().nullable(),
    alt: z.string().nullable(),
    role: z.enum(["product-main", "product-gallery"]),
    migrationStatus: z.string(),
  })
  .passthrough();

const sourceVideoSchema = z
  .object({
    sourceUrl: z.string().url(),
    localPath: z.string().nullable(),
    associationStatus: z.string(),
    migrationStatus: z.string(),
  })
  .passthrough();

const migratedProductSchema = z
  .object({
    id: z.number(),
    slug: z.string(),
    productUrl: z.string().url(),
    name: z.string(),
    classification: z.string(),
    brandIdentity: z.string(),
    parentBrand: z.string(),
    sourceBrandLabel: z.string().nullable(),
    sourceBrandTaxonomy: z.array(z.record(z.string(), z.unknown())),
    sku: z.string().nullable(),
    categories: z.array(sourceCategorySchema),
    categoryIds: z.array(z.number()),
    tags: z.array(sourceTagSchema),
    shortDescriptionHtml: z.string(),
    fullDescriptionHtml: z.string(),
    sourceWordPress: z
      .object({
        titleHtml: z.string(),
        status: z.string(),
        publishedAt: z.string(),
        modifiedAt: z.string(),
        excerptHtml: z.string(),
        contentHtml: z.string(),
        metadataSku: z.string().nullable(),
      })
      .passthrough(),
    sourceStorefront: z
      .object({
        id: z.number(),
        sku: z.string(),
        prices: z
          .object({
            regular_price: z.string(),
            sale_price: z.string(),
            price: z.string(),
            currency_code: z.string(),
            currency_symbol: z.string(),
          })
          .passthrough(),
        attributes: z.array(z.record(z.string(), z.unknown())),
        variations: z.array(z.number()),
        grouped_products: z.array(z.number()),
        average_rating: z.string(),
        review_count: z.number(),
      })
      .passthrough()
      .nullable(),
    price: z
      .object({
        regularPriceMinorUnits: z.string().nullable(),
        salePriceMinorUnits: z.string().nullable(),
        activePriceMinorUnits: z.string().nullable(),
        currencyCode: z.string().nullable(),
        currencySymbol: z.string().nullable(),
        sourcePriceHtml: z.string().nullable(),
        sourceBadgeDiscount: z.null(),
        note: z.string(),
      })
      .passthrough(),
    attributes: z.array(z.record(z.string(), z.unknown())),
    variations: z.array(z.number()),
    groupedProductIds: z.array(z.number()),
    relatedProductIds: z.null(),
    relatedProductsStatus: z.string(),
    images: z.array(sourceImageSchema),
    ingredientImages: z.array(z.record(z.string(), z.unknown())),
    videos: z.array(sourceVideoSchema),
    reviews: z.array(sourceReviewSchema),
    rating: z
      .object({
        averageRating: z.string().nullable(),
        reviewCount: z.number(),
        perReviewRatingsAvailable: z.boolean(),
      })
      .passthrough(),
    missingFields: z.array(z.string()),
    migrationTimestamp: z.string(),
    migrationNotes: z.array(z.string()),
  })
  .passthrough();

const productCatalogSchema = z
  .object({
    schemaVersion: z.number(),
    sourceSite: z.string().url(),
    wordpressEndpoint: z.string().url(),
    storefrontEndpoint: z.string().url(),
    migrationTimestamp: z.string(),
    sourceProductCount: z.number(),
    namedProductCount: z.number(),
    demoCount: z.number(),
    products: z.array(migratedProductSchema),
  })
  .passthrough();

const publicPageSchema = z
  .object({
    id: z.number(),
    slug: z.string(),
    sourceUrl: z.string().url(),
    sourceStatus: z.string(),
    titleHtml: z.string(),
    excerptHtml: z.string(),
    contentHtml: z.string(),
    publishedAt: z.string(),
    modifiedAt: z.string(),
    featuredMedia: z.array(z.record(z.string(), z.unknown())),
    mediaReferences: z.array(z.string().url()),
    migrationTimestamp: z.string(),
  })
  .passthrough();

const publicPagesSchema = z
  .object({
    schemaVersion: z.number(),
    sourceSite: z.string().url(),
    sourceApi: z.string().url(),
    migrationTimestamp: z.string(),
    count: z.number(),
    pages: z.array(publicPageSchema),
  })
  .passthrough();

const sourceTaxonomiesSchema = z
  .object({
    schemaVersion: z.number(),
    migrationTimestamp: z.string(),
    categories: z.array(
      z
        .object({
          id: z.number(),
          name: z.string(),
          slug: z.string(),
          descriptionHtml: z.string(),
          parentId: z.number(),
          count: z.number(),
          sourceUrl: z.string().url(),
        })
        .passthrough(),
    ),
    tags: z.array(sourceTagSchema),
    brands: z.array(
      z
        .object({
          id: z.number(),
          name: z.string(),
          slug: z.string(),
          descriptionHtml: z.string(),
          count: z.number(),
          sourceUrl: z.string().url(),
        })
        .passthrough(),
    ),
    routes: z.array(
      z
        .object({
          type: z.string(),
          sourceUrl: z.string().url(),
          status: z.string().optional(),
        })
        .passthrough(),
    ),
    routeCount: z.number(),
  })
  .passthrough();

const publicRouteSnapshotSchema = z
  .object({
    type: z.string(),
    sourceUrl: z.string().url(),
    title: z.string().nullable(),
    httpStatus: z.number().nullable(),
    contentType: z.string().nullable(),
    mainContentHtml: z.string(),
    mediaReferences: z.array(z.string()),
    capturedAt: z.string(),
    error: z.string().nullable(),
  })
  .passthrough();

const publicRouteSnapshotsSchema = z
  .object({
    sourceSite: z.string().url(),
    snapshotTimestamp: z.string(),
    routeCount: z.number(),
    accessibleRouteCount: z.number(),
    failedRouteCount: z.number(),
    routes: z.array(publicRouteSnapshotSchema),
    siteShell: z
      .object({
        sourceUrl: z.string().url(),
        capturedAt: z.string(),
        headerHtml: z.string(),
        footerHtml: z.string(),
        headerLinks: z.array(
          z.object({ url: z.string(), text: z.string() }).passthrough(),
        ),
        footerLinks: z.array(
          z.object({ url: z.string(), text: z.string() }).passthrough(),
        ),
      })
      .passthrough(),
  })
  .passthrough();

export type MigratedProductRecord = z.infer<typeof migratedProductSchema>;
export type MigratedPublicPage = z.infer<typeof publicPageSchema>;
export type MigratedPublicRouteSnapshot = z.infer<
  typeof publicRouteSnapshotSchema
>;

export const migratedProductCatalog = productCatalogSchema.parse(catalogData);
export const migratedProducts = migratedProductCatalog.products;
export const migratedGenuineProducts = migratedProducts.filter(
  (product) => product.classification === "source-published-product",
);
export const migratedDemoProducts = migratedProducts.filter((product) =>
  product.classification.startsWith("demo-"),
);
export const migratedPublicPages = publicPagesSchema.parse(pagesData);
export const migratedSourceTaxonomies =
  sourceTaxonomiesSchema.parse(taxonomiesData);
export const migratedPublicRouteSnapshots =
  publicRouteSnapshotsSchema.parse(routeSnapshotsData);
