import Logo from "@/components/Logo";
import { catalogProducts } from "@/lib/catalog/migrated-catalog";
import { SiteNavigation } from "./site-navigation";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const searchProducts = catalogProducts.map((product) => ({
    name: product.name,
    slug: product.slug,
    categories: product.categories.map(({ name }) => name),
  }));

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo className={styles.brand} />
        <SiteNavigation products={searchProducts} />
      </div>
    </header>
  );
}
