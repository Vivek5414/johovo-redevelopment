import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  HerbalBrandSignature,
} from "@/components/brand/herbal-botanical-pattern";
import { ProductBrandSignature } from "@/components/brand/product-brand-signature";
import { PageNavigation } from "@/components/common/page-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageContainer } from "@/components/layout/page-container";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppEnquiryForm } from "@/components/contact/whatsapp-enquiry-form";
import {
  calculateDiscountPercentage,
  formatCatalogPrice,
} from "@/lib/catalog/format-price";
import {
  catalogProducts,
  getCatalogProduct,
} from "@/lib/catalog/migrated-catalog";
import { getShowcaseProduct } from "@/lib/catalog/showcase-products";
import styles from "./page.module.css";

type ProductPageProps = {
  params: Promise<{ productSlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogProducts.map(({ slug }) => ({ productSlug: slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = getCatalogProduct(productSlug);

  if (!product) {
    return { title: "Product not found" };
  }
  const showcase = getShowcaseProduct(product.slug);

  return {
    title: showcase?.title ?? product.name,
    description:
      showcase?.description ??
      product.shortDescription ??
      `Product information for ${product.name}.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const product = getCatalogProduct(productSlug);

  if (!product) notFound();

  const showcase = getShowcaseProduct(product.slug);
  const productSourceUrl = product.originalSourceUrl.split("#", 1)[0];
  const productReviews = product.reviews.filter(
    (review) =>
      review.originalSourceUrl?.split("#", 1)[0] === productSourceUrl,
  );
  const discount = calculateDiscountPercentage(
    product.originalPrice,
    product.sellingPrice,
  );
  const galleryImages = showcase
    ? [
        {
          src: showcase.imageSrc,
          alt: showcase.imageAlt,
          name: null,
          originalSourceUrl: product.originalSourceUrl,
          role: "main" as const,
        },
        ...product.productImages.filter(
          ({ role }) => role === "gallery",
        ),
      ]
    : product.productImages;
  const categoryProducts = catalogProducts.filter(
    (candidate) =>
      candidate.id !== product.id &&
      product.categories.some((category) =>
        candidate.categorySlugs.includes(category.slug),
      ),
  );

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <PageNavigation
            backHref="/products"
            items={[
              { label: "Products", href: "/products" },
              { label: showcase?.title ?? product.name, current: true },
            ]}
          />

          <div className={styles.productLayout}>
            <ProductGallery
              images={galleryImages}
              productName={showcase?.title ?? product.name}
            />

            <section aria-labelledby="product-title" className={styles.summary}>
              {product.brand === "iyalmooligai" ? (
                <HerbalBrandSignature className={styles.brandSignature} />
              ) : (
                <ProductBrandSignature
                  className={styles.brandSignature}
                  identity={product.brand}
                />
              )}
              {product.categories.length ? (
                <ul aria-label="Product categories" className={styles.categories}>
                  {product.categories.map((category) => (
                    <li key={category.id}>{category.name}</li>
                  ))}
                </ul>
              ) : null}
              <h1 id="product-title">{showcase?.title ?? product.name}</h1>
              {product.sku ? (
                <p className={styles.sku}>SKU: {product.sku}</p>
              ) : null}
              {showcase?.verifiedSize ? (
                <p className={styles.sizes}>
                  <span>Available size:</span> {showcase.verifiedSize}
                </p>
              ) : null}
              {product.sellingPrice !== null ? (
                <div className={styles.priceBlock}>
                  {product.originalPrice !== null ? (
                    <div className={styles.priceItem}>
                      <span className={styles.priceLabel}>MRP</span>
                      <span
                        className={
                          discount !== null ? styles.originalPrice : undefined
                        }
                      >
                        {formatCatalogPrice(
                          product.originalPrice,
                          product.currency,
                        )}
                      </span>
                    </div>
                  ) : null}
                  <div className={styles.priceItem}>
                    <span className={styles.priceLabel}>Selling price</span>
                    <span className={styles.sellingPrice}>
                      {formatCatalogPrice(product.sellingPrice, product.currency)}
                    </span>
                  </div>
                  {discount !== null ? (
                    <span className={styles.discount}>{discount}% off</span>
                  ) : null}
                  <small>
                    Captured from the source site; current price and availability
                    are unconfirmed.
                  </small>
                </div>
              ) : null}
              <a
                className={styles.sourceProductLink}
                href={product.originalSourceUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Shop Now on JOHOVO
              </a>
              <a className={styles.enquiryLink} href="#product-enquiry">
                Ask about this product
              </a>
              {product.averageRating !== null ? (
                <p className={styles.rating}>
                  Source rating: {product.averageRating.toFixed(1)} / 5
                  {product.reviewCount > 0
                    ? ` (${product.reviewCount} reviews)`
                    : ""}
                </p>
              ) : product.reviewCount > 0 ? (
                <p className={styles.rating}>
                  {product.reviewCount} public reviews; star ratings were not
                  available in the source data.
                </p>
              ) : null}
            </section>
          </div>

          {showcase?.description || product.shortDescription ? (
            <section
              aria-labelledby="short-description-title"
              className={styles.shortDescription}
            >
              <h2 id="short-description-title">Product overview</h2>
              <p>{showcase?.description ?? product.shortDescription}</p>
            </section>
          ) : null}

          {product.fullDescription && product.fullDescription.length > 20 ? (
            <section
              aria-labelledby="description-title"
              className={styles.informationSection}
            >
              <h2 id="description-title">Product information</h2>
              <div className={styles.sourceDescription}>
                {product.fullDescription}
              </div>
            </section>
          ) : null}

          {product.ingredientImages.length ? (
            <section
              aria-labelledby="ingredient-images-title"
              className={styles.informationSection}
            >
              <h2 id="ingredient-images-title">
                Ingredient images from the source page
              </h2>
              <div className={styles.ingredientGrid}>
                {product.ingredientImages.map((image) => (
                  <figure className={styles.ingredientImage} key={image.src}>
                    <div>
                      <Image
                        alt={image.alt}
                        fill
                        sizes="(max-width: 600px) 40vw, 180px"
                        src={image.src}
                        unoptimized
                      />
                    </div>
                    {image.name ? <figcaption>{image.name}</figcaption> : null}
                  </figure>
                ))}
              </div>
              <p className={styles.sourceNote}>
                These illustrations and labels are reproduced from the source
                product page and do not independently verify the product
                formula.
              </p>
            </section>
          ) : null}

          {product.videos.length ? (
            <section
              aria-labelledby="videos-title"
              className={styles.informationSection}
            >
              <h2 id="videos-title">Product videos</h2>
              <div className={styles.videoGrid}>
                {product.videos.map((video) => (
                  <div className={styles.videoItem} key={video.src}>
                    <video
                      controls
                      preload="metadata"
                      title={`${product.name} product video`}
                    >
                      <source src={video.src} type="video/mp4" />
                      <a href={video.originalSourceUrl}>
                        View the source product video
                      </a>
                    </video>
                    <a
                      href={video.originalSourceUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Open original video
                    </a>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section
            aria-labelledby="reviews-title"
            className={`${styles.informationSection} ${styles.reviewsSection}`}
          >
            <h2 id="reviews-title">Customer reviews</h2>
            {productReviews.length ? (
              <>
                <p className={styles.reviewSummary}>
                  {productReviews.length} verified{" "}
                  {productReviews.length === 1 ? "review" : "reviews"} for{" "}
                  {showcase?.title ?? product.name}
                </p>
                {productReviews.some((review) => review.rating !== null) ? null : (
                  <p className={styles.sourceNote}>
                    Individual star ratings were not available in the original
                    review data.
                  </p>
                )}
                <div className={styles.reviewGrid}>
                  {productReviews.map((review, index) => (
                    <article
                      className={styles.review}
                      key={`${review.author ?? "review"}-${review.date ?? index}-${index}`}
                    >
                      <span className={styles.reviewProduct}>
                        {showcase?.title ?? product.name}
                      </span>
                      {review.rating !== null ? (
                        <p
                          aria-label={`${review.rating} out of 5 stars`}
                          className={styles.reviewRating}
                        >
                          {"★".repeat(review.rating)}
                        </p>
                      ) : null}
                      <blockquote>{review.text}</blockquote>
                      <p className={styles.reviewAttribution}>
                        {review.author ? <span>{review.author}</span> : null}
                        {review.date ? (
                          <time dateTime={review.date}>
                            {review.date.slice(0, 10)}
                          </time>
                        ) : null}
                      </p>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <p className={styles.reviewEmpty}>
                Be the first to share your experience with this product.
              </p>
            )}
          </section>
          {product.migrationNotes.length ? (
            <details className={styles.sourceNotes}>
              <summary>Source notes and discrepancies</summary>
              <ul>
                {product.migrationNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </details>
          ) : null}
          <section
            aria-labelledby="product-enquiry-title"
            className={styles.enquirySection}
            id="product-enquiry"
          >
            <h2 id="product-enquiry-title">Ask about this product</h2>
            <WhatsAppEnquiryForm initialProduct={showcase?.title ?? product.name} />
          </section>
          {categoryProducts.length ? (
            <section
              aria-labelledby="more-products-title"
              className={styles.relatedSection}
            >
              <h2 id="more-products-title">More from the same category</h2>
              <div className={styles.relatedGrid}>
                {categoryProducts.slice(0, 3).map((candidate) => (
                  <ProductCard key={candidate.id} product={candidate} />
                ))}
              </div>
            </section>
          ) : null}
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
