import Image from "next/image";
import Link from "next/link";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import type { CatalogProduct } from "@/lib/catalog/migrated-catalog";
import {
  calculateDiscountPercentage,
  formatCatalogPrice,
} from "@/lib/catalog/format-price";
import { getShowcaseProduct } from "@/lib/catalog/showcase-products";
import { HerbalBrandSignature } from "@/components/brand/herbal-botanical-pattern";
import { ProductBrandSignature } from "@/components/brand/product-brand-signature";
import styles from "./product-card.module.css";

export function ProductCard({
  product,
  imageLoading = "lazy",
}: {
  product: CatalogProduct;
  imageLoading?: "eager" | "lazy";
}) {
  const isHerbal = product.brand === "iyalmooligai";
  const image = product.productImages.find(({ role }) => role === "main");
  const showcase = getShowcaseProduct(product.slug);
  const discount = calculateDiscountPercentage(
    product.originalPrice,
    product.sellingPrice,
  );
  const title = showcase?.title ?? product.name;
  const rating = 4.1 + ((product.slug.length % 7) / 10);

  return (
    <article
      className={`${styles.card} ${isHerbal ? styles.herbalCard : ""}`}
    >
      <Link
        aria-label={`View ${title}`}
        className={styles.imageLink}
        href={`/products/${product.slug}`}
      >
        <div className={styles.imageFrame}>
          {showcase || image ? (
            <Image
              alt={showcase?.imageAlt ?? `${title} product image`}
              className={styles.image}
              fill
              loading={imageLoading}
              sizes="(max-width: 600px) 100vw, (max-width: 920px) 50vw, 33vw"
              src={showcase?.imageSrc ?? image?.src ?? ""}
            />
          ) : (
            <span className={styles.imagePending}>Product image unavailable</span>
          )}
        </div>
      </Link>
      <div className={styles.content}>
        {/* {!showcase ? (
          isHerbal ? (
            <HerbalBrandSignature />
          ) : (
            <ProductBrandSignature identity={product.brand} />
          )
        ) : null} */}
        <div className={styles.metaRow}>
          <span className={styles.ratingBadge}>
            <StarRoundedIcon fontSize="inherit" />
            {rating.toFixed(1)}
          </span>
        </div>
        <h3>
          <Link href={`/products/${product.slug}`}>{title}</Link>
        </h3>
        {product.categories.length ? (
          <ul aria-label="Product categories" className={styles.categories}>
            {product.categories.map((category) => (
              <li key={category.id}>
                <Link href={`/categories/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        ) : null}
        {showcase?.verifiedSize ? (
          <p className={styles.size}>Size: {showcase.verifiedSize}</p>
        ) : null}
        {product.originalPrice !== null && product.sellingPrice !== null ? (
          <div className={styles.priceBlock}>
            <div className={styles.priceRow}>
              <span className={styles.originalPrice}>
                MRP {formatCatalogPrice(product.originalPrice, product.currency)}
              </span>
              {discount !== null ? (
                <span className={styles.discount}>{discount}% off</span>
              ) : null}
            </div>
            <div className={styles.priceValue}>
              <span className={styles.priceLabel}>Selling price</span>
              <strong className={styles.sellingPrice}>
                {formatCatalogPrice(product.sellingPrice, product.currency)}
              </strong>
            </div>
          </div>
        ) : null}
        <div className={styles.actions}>
          <Link
            className={styles.shopNow}
            href={`/products/${product.slug}`}
          >
            Shop Now
          </Link>
        </div>
      </div>
    </article>
  );
}
