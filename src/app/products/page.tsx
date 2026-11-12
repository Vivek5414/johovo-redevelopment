import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductCatalogBrowser } from "@/components/product/product-catalog-browser";
import {
  catalogProducts,
  getCatalogCategories,
} from "@/lib/catalog/migrated-catalog";
import { getIyalMooligaiCollection } from "@/lib/catalog/iyalmooligai-collections";
import { iyalmooligaiPreviewProducts } from "@/lib/catalog/iyalmooligai-source-content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse JOHOVO products and their source-listed categories.",
};

type ProductsPageProps = {
  searchParams: Promise<{ search?: string | string[] }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const initialSearch = Array.isArray(params.search)
    ? params.search[0] ?? ""
    : params.search ?? "";
  const previewProducts = iyalmooligaiPreviewProducts.map((product) => {
    const collection = getIyalMooligaiCollection(product.collectionSlug);
    if (!collection) {
      throw new Error(
        `Unknown IyalMooligai collection: ${product.collectionSlug}`,
      );
    }

    return {
      slug: product.slug,
      name: product.name,
      href: `/collections/herbal-care/${collection.slug}/products/${product.slug}`,
      collectionTitle: collection.title,
      categories: product.categories,
      quantity: product.quantity,
    };
  });

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>JOHOVO catalogue</p>
            <h1>Products</h1>
            <p className={styles.lead}>
              Browse products captured from the JOHOVO source catalogue. Prices
              and product details are shown as recorded and may require
              confirmation before purchase.
            </p>
          </header>
          <ProductCatalogBrowser
            categories={getCatalogCategories()}
            initialSearch={initialSearch}
            products={catalogProducts}
            previewProducts={previewProducts}
          />
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
