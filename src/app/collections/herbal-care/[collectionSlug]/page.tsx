import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageNavigation } from "@/components/common/page-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageContainer } from "@/components/layout/page-container";
import { ProductCard } from "@/components/product/product-card";
import { SiteHeader } from "@/components/site-header";
import { catalogProducts } from "@/lib/catalog/migrated-catalog";
import {
  getIyalMooligaiCollection,
  iyalmooligaiCollections,
} from "@/lib/catalog/iyalmooligai-collections";
import {
  iyalmooligaiHerbalRanges,
  iyalmooligaiPreviewProducts,
  iyalmooligaiSourceImageClaims,
  iyalmooligaiSourceSeo,
} from "@/lib/catalog/iyalmooligai-source-content";
import styles from "./page.module.css";

type IyalMooligaiCollectionPageProps = {
  params: Promise<{ collectionSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return iyalmooligaiCollections.map(({ slug }) => ({
    collectionSlug: slug,
  }));
}

export async function generateMetadata({
  params,
}: IyalMooligaiCollectionPageProps): Promise<Metadata> {
  const { collectionSlug } = await params;
  const collection = getIyalMooligaiCollection(collectionSlug);

  if (!collection) return { title: "Collection not found" };

  const sourceSeo = iyalmooligaiSourceSeo[collection.slug];
  const title = sourceSeo.requiresReview ? collection.title : sourceSeo.title;
  const description = sourceSeo.requiresReview
    ? collection.description
    : sourceSeo.description;

  return {
    title,
    description,
    keywords: sourceSeo.requiresReview ? undefined : [...sourceSeo.keywords],
    openGraph: {
      title,
      description,
    },
  };
}

export default async function IyalMooligaiCollectionPage({
  params,
}: IyalMooligaiCollectionPageProps) {
  const { collectionSlug } = await params;
  const collection = getIyalMooligaiCollection(collectionSlug);
  if (!collection) notFound();

  const products = collection.productSlugs.flatMap((slug) => {
    const product = catalogProducts.find((catalogProduct) => catalogProduct.slug === slug);
    return product ? [product] : [];
  });
  const previewProducts = iyalmooligaiPreviewProducts.filter(
    (product) => product.collectionSlug === collection.slug,
  );
  const imageClaims = iyalmooligaiSourceImageClaims[collection.slug];

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <PageNavigation
            backHref="/collections/herbal-care"
            backLabel="All IyalMooligai collections"
            items={[
              { label: "IyalMooligai", href: "/collections/herbal-care" },
              { label: collection.title, current: true },
            ]}
          />

          <section
            aria-labelledby="collection-title"
            className={styles.collection}
            data-collection={collection.slug}
          >
            <div className={styles.collectionCopy}>
              <p className={styles.eyebrow}>
                Collection {collection.number} · IyalMooligai
              </p>
              <span
                className={`${styles.status} ${collection.isUpcoming ? styles.upcomingStatus : styles.availableStatus}`}
              >
                {collection.status}
              </span>
              <h1 id="collection-title">{collection.title}</h1>
              <p className={styles.description}>{collection.description}</p>
              {"audience" in collection ? (
                <p className={styles.audience}>{collection.audience}</p>
              ) : null}
              <ul
                aria-label={`${collection.title} subcategories`}
                className={styles.subcategories}
              >
                {collection.subcategories.map((subcategory) => (
                  <li key={subcategory}>{subcategory}</li>
                ))}
              </ul>
              {collection.isUpcoming ? (
                <p className={styles.availabilityNote}>
                  This collection is coming soon and is not yet available to
                  purchase.
                </p>
              ) : null}
            </div>

            <div className={styles.visual}>
              <Image
                alt={collection.imageAlt}
                fill
                priority
                sizes="(max-width: 700px) 100vw, 48vw"
                src={collection.imageSrc}
              />
            </div>
            {imageClaims ? (
              <p className={styles.sourceNote}>
                Claims visible in the original collection image are reproduced
                as supplied and are pending review:{" "}
                {imageClaims.claims.join("; ")}.
              </p>
            ) : null}
          </section>

          {collection.isUpcoming ? (
            <section
              aria-labelledby="upcoming-title"
              className={styles.upcoming}
            >
              <p className={styles.eyebrow}>Future collection</p>
              <h2 id="upcoming-title">Coming soon</h2>
              <p>
                We&apos;ll share confirmed product details here when this
                collection is available. The products below are informational
                previews only and are not available to purchase.
              </p>
              {previewProducts.length ? (
                <>
                  <h3>Product previews</h3>
                  <p className={styles.sourceNote}>
                    Details are transcribed from the supplied product PDF and
                    have not been independently verified. Benefit statements
                    are withheld until review.
                  </p>
                  <ul className={styles.previewList}>
                    {previewProducts.map((product) => (
                      <li key={product.slug}>
                        <Link
                          href={`/collections/herbal-care/${collection.slug}/products/${product.slug}`}
                        >
                          {product.name}
                        </Link>
                        <span className={styles.previewMeta}>
                          {[
                            product.quantity,
                            product.categories.join(", "),
                            "Coming soon",
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          ) : (
            <section
              aria-labelledby="products-title"
              className={styles.products}
            >
              <div className={styles.productsHeading}>
                <p className={styles.eyebrow}>Available now</p>
                <h2 id="products-title">Herbal products</h2>
              </div>
              {products.length ? (
                <div className={styles.productGrid}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className={styles.availabilityNote}>
                  No confirmed products are currently listed in this collection.
                </p>
              )}
            </section>
          )}

          {collection.slug === "herbal-products" ? (
            <section
              aria-labelledby="range-information-title"
              className={styles.rangeSection}
            >
              <div className={styles.rangeHeading}>
                <p className={styles.eyebrow}>Source document details</p>
                <h2 id="range-information-title">Herbal care ranges</h2>
                <p className={styles.sourceNote}>
                  These range-level details are transcribed from the supplied
                  product PDF; they are not product-specific and have not been
                  independently verified. Benefit statements are withheld until
                  review.
                </p>
              </div>
              <div className={styles.rangeGrid}>
                {iyalmooligaiHerbalRanges.map((range) => (
                  <article className={styles.rangeCard} key={range.category}>
                    <h3>{range.category}</h3>
                    <ul
                      aria-label={`${range.category} items named in source`}
                      className={styles.rangeItems}
                    >
                      {range.rangeItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div>
                      <h4>Quality and sourcing in the source PDF</h4>
                      <p>{range.qualitySourcing}</p>
                    </div>
                    <div>
                      <h4>Usage instructions in the source PDF</h4>
                      <p>
                        {range.usageInstructions ??
                          "Usage instructions were not provided for this range."}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
