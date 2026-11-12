import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageNavigation } from "@/components/common/page-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/site-header";
import { getIyalMooligaiCollection } from "@/lib/catalog/iyalmooligai-collections";
import { iyalmooligaiPreviewProducts } from "@/lib/catalog/iyalmooligai-source-content";
import styles from "./page.module.css";

type PreviewProductPageProps = {
  params: Promise<{ collectionSlug: string; productSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return iyalmooligaiPreviewProducts.map(({ collectionSlug, slug }) => ({
    collectionSlug,
    productSlug: slug,
  }));
}

export async function generateMetadata({
  params,
}: PreviewProductPageProps): Promise<Metadata> {
  const { collectionSlug, productSlug } = await params;
  const collection = getIyalMooligaiCollection(collectionSlug);
  const product = iyalmooligaiPreviewProducts.find(
    (candidate) =>
      candidate.slug === productSlug &&
      candidate.collectionSlug === collectionSlug,
  );

  if (!collection || !product) return { title: "Product information not found" };

  return {
    title: `${product.name} | ${collection.title}`,
    description: `${product.name} product information from IyalMooligai. This collection is coming soon.`,
  };
}

export default async function PreviewProductPage({
  params,
}: PreviewProductPageProps) {
  const { collectionSlug, productSlug } = await params;
  const collection = getIyalMooligaiCollection(collectionSlug);
  const product = iyalmooligaiPreviewProducts.find(
    (candidate) =>
      candidate.slug === productSlug &&
      candidate.collectionSlug === collectionSlug,
  );

  if (!collection || !collection.isUpcoming || !product) notFound();

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <PageNavigation
            backHref={`/collections/herbal-care/${collection.slug}`}
            backLabel={`Back to ${collection.title}`}
            items={[
              { label: "IyalMooligai", href: "/collections/herbal-care" },
              {
                label: collection.title,
                href: `/collections/herbal-care/${collection.slug}`,
              },
              { label: product.name, current: true },
            ]}
          />

          <article className={styles.product}>
            <header className={styles.header}>
              <p className={styles.eyebrow}>IyalMooligai product preview</p>
              <span className={styles.status}>Coming soon</span>
              <h1>{product.name}</h1>
              <p className={styles.collectionName}>{collection.title}</p>
              <p className={styles.availability}>
                This product is not currently available to purchase. No price
                or availability details were provided in the source PDF.
              </p>
            </header>

            <p className={styles.sourceNote}>
              The details below are transcribed from the supplied product PDF
              and have not been independently verified. Benefit statements are
              withheld until review.
            </p>

            {product.quantity ? (
              <section className={styles.detailSection}>
                <h2>Weight or quantity in source</h2>
                <p>{product.quantity}</p>
              </section>
            ) : null}

            {product.ingredients?.length ? (
              <section className={styles.detailSection}>
                <h2>Ingredients listed in source</h2>
                <ul>
                  {product.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {product.composition ? (
              <section className={styles.detailSection}>
                <h2>Composition listed in source</h2>
                <p>{product.composition}</p>
              </section>
            ) : null}

            <section className={styles.detailSection}>
              <h2>Quality and sourcing in source PDF</h2>
              <p>{product.qualitySourcing}</p>
            </section>

            {product.usageInstructions ? (
              <section className={styles.detailSection}>
                <h2>Usage instructions in source PDF</h2>
                <p>{product.usageInstructions}</p>
              </section>
            ) : (
              <section className={styles.detailSection}>
                <h2>Usage instructions</h2>
                <p>
                  Usage instructions were not provided for this product in the
                  source PDF.
                </p>
              </section>
            )}

            <section className={styles.detailSection}>
              <h2>Benefits</h2>
              <p>
                Source-document benefit statements are withheld pending
                review.
              </p>
            </section>

            <p className={styles.categoryLabels}>
              Categories: {product.categories.join(", ")}
            </p>
            <Link
              className={styles.collectionLink}
              href={`/collections/herbal-care/${collection.slug}`}
            >
              Return to collection
            </Link>
          </article>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
