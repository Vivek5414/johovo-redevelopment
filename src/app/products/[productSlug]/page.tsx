import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { PageNavigation } from "@/components/common/page-navigation";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductEnquiryForm } from "@/components/product/product-enquiry-form";
import { WhatsAppDirectBuyLink } from "./whatsapp-direct-link";
import { JOHOVO_CONTACT } from "@/lib/contact";
import {
  calculateDiscountPercentage,
  formatCatalogPrice,
} from "@/lib/catalog/format-price";
import {
  catalogProducts,
  getCatalogProduct,
} from "@/lib/catalog/migrated-catalog";
import { getProductBySlug, getAllProducts } from "@/lib/products-db";
import { getShowcaseProduct } from "@/lib/catalog/showcase-products";
import styles from "./product-details.module.css";

type ProductPageProps = {
  params: Promise<{ productSlug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return catalogProducts.map(({ slug }) => ({ productSlug: slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    return { title: "Product Not Found" };
  }
  const showcase = getShowcaseProduct(product.slug);

  return {
    title: `${showcase?.title ?? product.name} | JOHOVO Herbal`,
    description:
      showcase?.description ??
      product.shortDescription ??
      `Authentic Ayurvedic and herbal formulation for ${product.name}.`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) notFound();

  const showcase = getShowcaseProduct(product.slug);
  const productName = showcase?.title ?? product.name;
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
        ...product.productImages.filter(({ role }) => role === "gallery"),
      ]
    : product.productImages;

  const productSourceUrl = product.originalSourceUrl.split("#", 1)[0];
  const productReviews = product.reviews.filter(
    (review) => review.originalSourceUrl?.split("#", 1)[0] === productSourceUrl,
  );

  const relatedProducts = catalogProducts.filter(
    (candidate) =>
      candidate.id !== product.id &&
      product.categories.some((category) =>
        candidate.categorySlugs.includes(category.slug),
      ),
  );

  const encodedProductName = encodeURIComponent(productName);
  const amazonTargetUrl = product.amazonUrl?.trim() || `https://www.amazon.in/s?k=${encodedProductName}`;
  const flipkartTargetUrl = product.flipkartUrl?.trim() || `https://www.flipkart.com/search?q=${encodedProductName}`;
  const whatsappBuyMessage = encodeURIComponent(
    `Hello JOHOVO, I would like to buy "${productName}". Please share payment & delivery details.`,
  );
  const whatsappDirectBuyUrl = `https://wa.me/${JOHOVO_CONTACT.whatsapp}?text=${whatsappBuyMessage}`;

  return (
    <>
      <SiteHeader />
      <main className={styles.productDetailsPage}>
        <PageContainer>
          <div className={styles.navWrapper}>
            <PageNavigation
              backHref="/products"
              backLabel="Back to All Products"
              items={[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: productName, current: true },
              ]}
            />
          </div>

          {/* Main Hero Product Grid */}
          <div className={styles.heroGrid}>
            <div className={styles.galleryCard}>
              <ProductGallery images={galleryImages} productName={productName} />
            </div>

            <section aria-label="Product Information" className={styles.productInfo}>
              <div className={styles.metaTop}>
                <div className={styles.brandBadge}>
                  <span className={styles.brandDot} />
                  <span className={styles.brandName}>
                    {product.brand === "iyalmooligai" ? "IyalMooligai Herbal" : "JOHOVO Premium"}
                  </span>
                </div>
                {product.sku ? (
                  <span className={styles.skuBadge}>SKU: {product.sku}</span>
                ) : null}
              </div>

              <h1 className={styles.title}>{productName}</h1>

              <div className={styles.ratingCategoryRow}>
                <div className={styles.ratingBadge}>
                  <StarRoundedIcon className={styles.starIcon} />
                  <span>{product.averageRating ? product.averageRating.toFixed(1) : "4.8"}</span>
                </div>
                <span className={styles.reviewCountText}>
                  {productReviews.length > 0 ? `${productReviews.length} Verified Reviews` : "Verified Ayurvedic Formulation"}
                </span>
                {product.categories.map((cat) => (
                  <Link className={styles.categoryPill} href={`/categories/${cat.slug}`} key={cat.id}>
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Price Card */}
              {product.sellingPrice !== null ? (
                <div className={styles.priceCard}>
                  <div className={styles.priceMainRow}>
                    <span className={styles.sellingPrice}>
                      {formatCatalogPrice(product.sellingPrice, product.currency)}
                    </span>
                    {product.originalPrice !== null ? (
                      <span className={styles.mrpLabel}>
                        MRP <span className={styles.originalPrice}>{formatCatalogPrice(product.originalPrice, product.currency)}</span>
                      </span>
                    ) : null}
                    {discount !== null ? (
                      <span className={styles.discountBadge}>{discount}% OFF</span>
                    ) : null}
                  </div>
                  <p className={styles.priceNote}>Inclusive of all taxes • Authentic herbal product</p>
                </div>
              ) : null}

              {/* Size Specification */}
              {showcase?.verifiedSize || product.sizes.length ? (
                <div className={styles.sizeGroup}>
                  <span className={styles.sizeLabel}>Pack Size:</span>
                  <span className={styles.sizePill}>
                    {showcase?.verifiedSize || product.sizes.join(", ")}
                  </span>
                </div>
              ) : null}

              {/* Trust Badges */}
              <div className={styles.highlightsGrid}>
                <div className={styles.highlightItem}>
                  <SpaRoundedIcon className={styles.highlightIcon} />
                  <span>100% Ayurvedic Extracts</span>
                </div>
                <div className={styles.highlightItem}>
                  <VerifiedUserRoundedIcon className={styles.highlightIcon} />
                  <span>Dermatologically Safe</span>
                </div>
                <div className={styles.highlightItem}>
                  <LocalShippingRoundedIcon className={styles.highlightIcon} />
                  <span>Free Shipping Available</span>
                </div>
                <div className={styles.highlightItem}>
                  <StarRoundedIcon className={styles.highlightIcon} />
                  <span>Premium Craftsmanship</span>
                </div>
              </div>

              {/* Three Buy Options: Amazon, Flipkart, WhatsApp */}
              <div className={styles.buyCardsGrid}>
                {/* Option 1: Amazon */}
                <a
                  aria-label={`Buy ${productName} on Amazon`}
                  className={`${styles.marketplaceCard} ${styles.amazonCard}`}
                  href={amazonTargetUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className={styles.amazonLogo}>
                    <ShoppingCartRoundedIcon fontSize="inherit" />
                    <span>amazon<span className={styles.amazonAccent}>.in</span></span>
                  </div>
                  <span className={styles.fastTag}>Fast Prime</span>
                  <span className={styles.marketplaceAction}>
                    <span>Buy Now</span>
                    <OpenInNewRoundedIcon className={styles.marketplaceIcon} />
                  </span>
                </a>

                {/* Option 2: Flipkart */}
                <a
                  aria-label={`Buy ${productName} on Flipkart`}
                  className={`${styles.marketplaceCard} ${styles.flipkartCard}`}
                  href={flipkartTargetUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className={styles.flipkartLogo}>
                    <ShoppingBagRoundedIcon fontSize="inherit" />
                    <span>Flipkart<span className={styles.flipkartAccent}>+</span></span>
                  </div>
                  <span className={styles.fastTag}>Assured</span>
                  <span className={styles.marketplaceAction}>
                    <span>Buy Now</span>
                    <OpenInNewRoundedIcon className={styles.marketplaceIcon} />
                  </span>
                </a>

                {/* Option 3: WhatsApp */}
                <WhatsAppDirectBuyLink
                  productName={productName}
                  url={whatsappDirectBuyUrl}
                />
              </div>
            </section>
          </div>

          {/* Product Overview Section */}
          {showcase?.description || product.shortDescription ? (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.sectionEyebrow}>HERBAL BENEFITS</p>
                <h2 className={styles.sectionTitle}>Product Overview</h2>
              </div>
              <p className={styles.overviewText}>
                {showcase?.description ?? product.shortDescription}
              </p>
            </div>
          ) : null}

          {/* Full Ingredients / Source Description */}
          {product.fullDescription && product.fullDescription.length > 20 ? (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.sectionEyebrow}>TRADITIONAL FORMULATION</p>
                <h2 className={styles.sectionTitle}>Full Formulation &amp; Directions</h2>
              </div>
              <div className={styles.fullDescriptionContent}>
                {product.fullDescription}
              </div>
            </div>
          ) : null}

          {/* Ingredient Highlights */}
          {product.ingredientImages.length ? (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.sectionEyebrow}>KEY BOTANICALS</p>
                <h2 className={styles.sectionTitle}>Active Herbal Ingredients</h2>
              </div>
              <div className={styles.ingredientGrid}>
                {product.ingredientImages.map((img) => (
                  <div className={styles.ingredientCard} key={img.src}>
                    <div className={styles.ingredientImageWrapper}>
                      <Image
                        alt={img.alt || img.name || "Botanical ingredient"}
                        className={styles.ingredientImage}
                        fill
                        sizes="110px"
                        src={img.src}
                        unoptimized
                      />
                    </div>
                    {img.name ? (
                      <span className={styles.ingredientName}>{img.name}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Customer Reviews Section */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>COMMUNITY VOICES</p>
              <h2 className={styles.sectionTitle}>Verified Customer Reviews</h2>
            </div>
            {productReviews.length > 0 ? (
              <div className={styles.reviewsGrid}>
                {productReviews.map((rev, idx) => (
                  <div className={styles.reviewCard} key={`${rev.author ?? "rev"}-${idx}`}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewAuthor}>{rev.author || "Verified Buyer"}</span>
                      <span className={styles.reviewStars}>
                        {"★".repeat(rev.rating || 5)}
                      </span>
                    </div>
                    <blockquote className={styles.reviewQuote}>
                      &ldquo;{rev.text}&rdquo;
                    </blockquote>
                    {rev.date ? (
                      <span className={styles.reviewDate}>{rev.date.slice(0, 10)}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.overviewText}>
                Be the first to share your experience with {productName}.
              </p>
            )}
          </div>

          {/* Product Assistance & Enquiry Section */}
          <div className={styles.sectionCard} id="product-enquiry">
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>NEED ASSISTANCE?</p>
              <h2 className={styles.sectionTitle}>Ask About This Product</h2>
            </div>
            <ProductEnquiryForm productName={productName} />
          </div>

          {/* Related Category Products */}
          {relatedProducts.length > 0 ? (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.sectionEyebrow}>EXPLORE MORE</p>
                <h2 className={styles.sectionTitle}>Related Herbal Essentials</h2>
              </div>
              <div className={styles.relatedGrid}>
                {relatedProducts.slice(0, 3).map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </div>
          ) : null}
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
