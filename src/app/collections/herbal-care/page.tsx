import type { Metadata } from "next";
import {
  HerbalBotanicalPanel,
  HerbalBrandSignature,
} from "@/components/brand/herbal-botanical-pattern";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageContainer } from "@/components/layout/page-container";
import { ProductCatalogBrowser } from "@/components/product/product-catalog-browser";
import { SiteHeader } from "@/components/site-header";
import { LinkButton } from "@/components/ui/link-button";
import { getCatalogCategories } from "@/lib/catalog/migrated-catalog";
import { getAllProducts } from "@/lib/products-db";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "IyalMooligai Herbal Care",
  description:
    "Browse source-listed IyalMooligai herbal products within the JOHOVO website.",
};

export const dynamic = "force-dynamic";

export default async function HerbalCarePage() {
  const allProducts = await getAllProducts();
  const herbalProducts = allProducts.filter(
    (product) => product.brand === "iyalmooligai",
  );
  const herbalCategories = getCatalogCategories(herbalProducts).filter(
    ({ productCount }) => productCount > 0,
  );

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <HerbalBotanicalPanel className={styles.banner}>
            <div className={styles.bannerContent}>
              <HerbalBrandSignature />
              <p className={styles.eyebrow}>JOHOVO · Herbal Care</p>
              <h1>IyalMooligai Herbal Care</h1>
              <p className={styles.intro}>
                Explore IyalMooligai products identified as the herbal
                sub-brand in the source catalogue. Product details and images
                are preserved from the original JOHOVO website.
              </p>
              <LinkButton href="/products" variant="secondary">
                Browse the catalogue
              </LinkButton>
            </div>
          </HerbalBotanicalPanel>
          <section aria-labelledby="categories-title" className={styles.categories}>
            <p className={styles.eyebrow}>IyalMooligai Herbal Care</p>
            <h2 className={styles.categoriesTitle} id="categories-title">
              Browse by category
            </h2>
            <ProductCatalogBrowser
              categories={herbalCategories}
              products={herbalProducts}
            />
          </section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
