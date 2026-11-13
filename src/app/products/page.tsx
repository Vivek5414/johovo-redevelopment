import type { Metadata } from "next";
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
          <header className={styles.heading}>
            <p className={styles.eyebrow}>JOHOVO catalogue</p>
            <h1>Products</h1>
            <p className={styles.lead}>
              Browse products captured from the JOHOVO source catalogue and live formulations added by administrators.
            </p>
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
