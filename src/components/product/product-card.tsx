import Image from "next/image";
import Link from "next/link";
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
        {!showcase ? (
          isHerbal ? (
            <HerbalBrandSignature />
          ) : (
            <ProductBrandSignature identity={product.brand} />
          )
        ) : null}
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
        {showcase?.description || product.shortDescription ? (
          <p className={styles.description}>
            {showcase?.description ?? product.shortDescription}
          </p>
        ) : null}
        {showcase?.verifiedSize ? (
          <p className={styles.size}>Size: {showcase.verifiedSize}</p>
        ) : null}
        {product.originalPrice !== null && product.sellingPrice !== null ? (
          <div className={styles.priceBlock}>
            <div className={styles.priceValue}>
              <span className={styles.priceLabel}>MRP</span>
              <span className={discount ? styles.originalPrice : undefined}>
                {formatCatalogPrice(product.originalPrice, product.currency)}
              </span>
            </div>
            <div className={styles.priceValue}>
              <span className={styles.priceLabel}>Selling price</span>
              <strong className={styles.sellingPrice}>
                {formatCatalogPrice(product.sellingPrice, product.currency)}
              </strong>
            </div>
            {discount !== null ? (
              <span className={styles.discount}>{discount}% off</span>
            ) : null}
          </div>
        ) : null}
        <p className={styles.priceNote}>
          Source-listed price; current availability is unconfirmed.
        </p>
        <div className={styles.actions}>
          <Link className={styles.viewProduct} href={`/products/${product.slug}`}>
            View Product
          </Link>
          <a
            className={styles.shopNow}
            href={product.originalSourceUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Shop Now
          </a>
        </div>
      </div>
    </article>
  );
}
