import styles from "./product-skeleton.module.css";

export function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.imageFrame} ${styles.shimmer}`} />
      <div className={styles.content}>
        <div className={styles.metaRow}>
          <div className={`${styles.ratingPill} ${styles.shimmer}`} />
        </div>
        <div className={`${styles.titleLine} ${styles.shimmer}`} />
        <div className={`${styles.titleLineShort} ${styles.shimmer}`} />
        <div className={styles.categoriesRow}>
          <div className={`${styles.categoryTag} ${styles.shimmer}`} />
          <div className={`${styles.categoryTag} ${styles.shimmer}`} />
        </div>
        <div className={styles.priceBlock}>
          <div className={`${styles.mrpLine} ${styles.shimmer}`} />
          <div className={`${styles.sellingLine} ${styles.shimmer}`} />
        </div>
        <div className={styles.actions}>
          <div className={`${styles.buttonPill} ${styles.shimmer}`} />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
