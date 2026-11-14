import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { ProductCard } from "@/components/product/product-card";
import { LinkButton } from "@/components/ui/link-button";
import { getAllProducts } from "@/lib/products-db";
import styles from "./latest-products-section.module.css";

export async function LatestProductsSection() {
  const latestProducts = (await getAllProducts().catch(() => [])).slice(0, 3);

  if (latestProducts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="latest-products-heading"
      className={styles.latestProductsSection}
    >
      <PageContainer className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.headingWrap}>
            <p className={styles.eyebrow}>Fresh arrivals</p>
            <h2 id="latest-products-heading">Latest Products</h2>
          </div>

          <LinkButton href="/products" className={styles.showProductsButton} variant="primary">
            <span>Show Products</span>
            <ArrowForwardRoundedIcon fontSize="small" />
          </LinkButton>
        </div>

        <div className={styles.productGrid}>
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
