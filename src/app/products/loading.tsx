import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductGridSkeleton } from "@/components/product/product-skeleton";
import styles from "./page.module.css";
import browserStyles from "@/components/product/product-catalog-browser.module.css";

export default function ProductsLoading() {
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

          <div className={browserStyles.browser}>
            {/* Top Bar Skeleton */}
            <div className={browserStyles.topBar}>
              <div className={browserStyles.searchLabel}>
                <span className={browserStyles.searchLabelText}>Search products</span>
                <div
                  className={browserStyles.searchFieldWrap}
                  style={{ minHeight: "52px" }}
                />
              </div>
            </div>

            <div className={browserStyles.catalogLayout}>
              {/* Category Sidebar Skeleton */}
              <aside className={browserStyles.sidebar}>
                <div className={browserStyles.categorySidebarCard}>
                  <h2>Categories</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          height: "42px",
                          borderRadius: "999px",
                          background: "var(--color-surface-muted)",
                          opacity: 0.6,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Products Grid Skeleton */}
              <div className={browserStyles.mainCatalogContent}>
                <ProductGridSkeleton count={6} />
              </div>
            </div>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
