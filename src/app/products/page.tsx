import type { Metadata } from "next";
import { PageNavigation } from "@/components/common/page-navigation";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductCatalogBrowser } from "@/components/product/product-catalog-browser";
import { getCatalogCategories } from "@/lib/catalog/migrated-catalog";
import { getAllProducts } from "@/lib/products-db";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse JOHOVO products and their source-listed categories.",
};

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<{ search?: string | string[] }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const initialSearch = Array.isArray(params.search)
    ? params.search[0] ?? ""
    : params.search ?? "";

  const products = await getAllProducts();

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <PageNavigation
            backHref="/"
            backLabel="Back to Home"
            items={[
              { label: "Home", href: "/" },
              { label: "Products", current: true },
            ]}
          />

          <header className={styles.hero}>
            <div className={styles.heroHeader}>
              <span className={styles.badgeDot} aria-hidden="true" />
              <span className={styles.heroBadge}>JOHOVO catalogue</span>
            </div>

            <div className={styles.heroContent}>
              <div className={styles.heading}>
                <h1>
                  Browse <span>Products</span>
                </h1>
                <p className={styles.lead}>
                  Discover source-listed JOHOVO essentials alongside live formulations curated by administrators.
                </p>
              </div>

              <div className={styles.heroStats} aria-label="Catalogue overview">
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{products.length}</span>
                  <span className={styles.statLabel}>Products</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statValue}>{getCatalogCategories().length}</span>
                  <span className={styles.statLabel}>Categories</span>
                </div>
              </div>
            </div>
          </header>

          <ProductCatalogBrowser
            categories={getCatalogCategories()}
            initialSearch={initialSearch}
            products={products}
          />
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
