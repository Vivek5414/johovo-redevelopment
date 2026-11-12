import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import BrushRoundedIcon from "@mui/icons-material/BrushRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import FaceRetouchingNaturalRoundedIcon from "@mui/icons-material/FaceRetouchingNaturalRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  HerbalBrandSignature,
  HerbalBotanicalPanel,
} from "@/components/brand/herbal-botanical-pattern";
import { ContentSection } from "@/components/layout/content-section";
import { PageContainer } from "@/components/layout/page-container";
import { ContactForm } from "@/components/contact/contact-form";
import { HomeContactDetails } from "./home-contact-details";
import { ProductCard } from "@/components/product/product-card";
import { LinkButton } from "@/components/ui/link-button";
import { InstagramSection as InstagramShowcaseSection } from "@/components/Instagram";
import { ScrollReveal } from "./scroll-reveal";
import {
  catalogProducts,
  getCatalogCategories,
} from "@/lib/catalog/migrated-catalog";
import {
  calculateDiscountPercentage,
  formatCatalogPrice,
} from "@/lib/catalog/format-price";
import { JOHOVO_CONTACT } from "@/lib/contact";
import {
  getShowcaseProduct,
  showcaseProducts,
} from "@/lib/catalog/showcase-products";
import styles from "./home-sections.module.css";

const categories = getCatalogCategories();
const categoryCardContent: Record<string, { description: string }> = {
  "face-care": {
    description: "Everyday face-care essentials for a fresh, cared-for feel.",
  },
  facepack: {
    description: "Explore herbal face-pack favourites from the collection.",
  },
  "hair-care": {
    description: "Thoughtful botanical essentials for your hair-care routine.",
  },
  "hair-oil": {
    description: "Discover IyalMooligai herbal hair oil and its botanical blend.",
  },
  makeup: {
    description: "A considered collection for your everyday beauty ritual.",
  },
  tranding: {
    description: "Discover a current pick from the JOHOVO collection.",
  },
};
const categoryDisplayOrder = [
  "face-care",
  "facepack",
  "hair-care",
  "hair-oil",
  "makeup",
  "tranding",
];
const herbalProducts = catalogProducts.filter(
  (product) => product.brand === "iyalmooligai",
);
const heroProduct =
  herbalProducts.find((product) =>
    product.categories.some(({ name }) => name === "Hair Oil"),
  ) ?? catalogProducts[0];
const heroImage = heroProduct?.productImages.find(
  ({ role }) => role === "main",
);
const heroFeatureCategories = categories.filter(
  ({ slug, parentId, productCount }) =>
    parentId === 0 &&
    productCount > 0 &&
    ["face-care", "hair-care", "makeup"].includes(slug),
);
const heroLifestyleImage =
  heroImage?.src ?? "/images/reference-homepage-featured.png";
const heroLifestyleAlt =
  heroImage?.alt ?? "JOHOVO homepage promotion featuring its product collection";
const hairOil = herbalProducts.find((product) =>
  product.categories.some(({ name }) => name === "Hair Oil"),
);

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {description ? <p className={styles.sectionDescription}>{description}</p> : null}
    </div>
  );
}

function HeroCategoryIcon({ slug }: { slug: string }) {
  const Icon =
    slug === "face-care"
      ? FaceRetouchingNaturalRoundedIcon
      : slug === "hair-care"
        ? BrushRoundedIcon
        : PaletteRoundedIcon;

  return (
    <span className={styles.heroFeatureIcon}>
      <Icon fontSize="inherit" />
    </span>
  );
}

export function HeroSection() {
  return (
    <ContentSection className={styles.hero} id="top">
      <PageContainer className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>A more natural beauty ritual</p>
          <h1>
            Nurture Your
            <br />
            Skin Naturally
            <br />
            <span className={styles.headlineBrand}>
              with <BrandLogo identity="johovo" />
            </span>
          </h1>
          <p className={styles.heroIntro}>
            Thoughtful, herbal-based care for your diverse beauty needs, from
            glowing skin to nourished hair and body.
          </p>
        </div>
        <figure
          aria-label="JOHOVO skincare lifestyle portrait"
          className={styles.heroVisual}
        >
          <span aria-hidden="true" className={styles.botanicalSprig} />
          <div className={styles.lifestyleFrame}>
            <Image
              alt={heroLifestyleAlt}
              className={styles.lifestyleImage}
              fill
              preload
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 55vw, 46vw"
              src={heroLifestyleImage}
            />
          </div>
          <ul
            aria-label="Explore product categories"
            className={styles.heroFeatureBadges}
          >
            {heroFeatureCategories.map((category) => (
              <li key={category.id}>
                <Link
                  className={styles.heroFeatureBadge}
                  href={`/categories/${category.slug}`}
                >
                  <span className={styles.heroFeatureIcon}>
                    <HeroCategoryIcon slug={category.slug} />
                  </span>
                  <span>{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className={styles.botanicalLeaf} />
        </figure>
        {heroProduct ? (
          <Link
            aria-label={`View ${heroProduct.name}`}
            className={styles.featuredProduct}
            href={`/products/${heroProduct.slug}`}
          >
            <span className={styles.featuredProductImage}>
              {heroImage ? (
                <Image
                  alt={heroImage.alt}
                  fill
                  sizes="(max-width: 700px) 112px, 136px"
                  src={heroImage.src}
                />
              ) : null}
            </span>
            <span className={styles.featuredProductDetails}>
              <span className={styles.featuredProductEyebrow}>
                Featured product
              </span>
              {heroProduct.brand === "iyalmooligai" ? (
                <HerbalBrandSignature className={styles.featuredBrand} />
              ) : null}
              <span className={styles.featuredProductName}>
                {heroProduct.name}
              </span>
              {heroProduct.sellingPrice !== null ? (
                <span className={styles.featuredProductPrice}>
                  <span className={styles.featuredProductPriceValues}>
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: heroProduct.currency ?? "INR",
                      maximumFractionDigits: 2,
                    }).format(heroProduct.sellingPrice)}
                    {heroProduct.originalPrice !== null &&
                    heroProduct.originalPrice > heroProduct.sellingPrice ? (
                      <del>
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: heroProduct.currency ?? "INR",
                          maximumFractionDigits: 2,
                        }).format(heroProduct.originalPrice)}
                      </del>
                    ) : null}
                  </span>
                  <small>Source-listed price</small>
                </span>
              ) : null}
              <span className={styles.featuredProductLink}>
                View product <ArrowForwardRoundedIcon fontSize="small" />
              </span>
            </span>
          </Link>
        ) : null}
      </PageContainer>
    </ContentSection>
  );
}

export function AboutSection() {
  return (
    <ContentSection className={styles.about} id="about" tone="neutral">
      <PageContainer className={styles.aboutGrid}>
        <div className={styles.aboutLabel}>
          <p className={styles.eyebrow}>About JOHOVO</p>
          <h2>The company behind the catalogue.</h2>
          <LinkButton href="/about-us" size="compact" variant="quiet">
            Read about JOHOVO <span aria-hidden="true">→</span>
          </LinkButton>
        </div>
        <blockquote className={styles.aboutQuote}>
          <p>
            “At JOHOVO, we’re passionate about helping you achieve healthy,
            glowing skin, luscious locks, and soft, nourished lips and body. Our
            mission is to provide high-quality, herbal-based products that cater
            to your diverse beauty needs.”
          </p>
          <cite>From JOHOVO’s public About page</cite>
        </blockquote>
      </PageContainer>
    </ContentSection>
  );
}

export function CollectionsSection() {
  return (
    <ContentSection className={styles.collections} id="collections">
      <PageContainer>
        <SectionHeading
          description="Explore six featured products across the IyalMooligai and JOHOVO collections."
          eyebrow="The JOHOVO collection"
          title="Care, chosen with intention"
        />
        <div className={styles.showcaseGrid}>
          {showcaseProducts.map(({ slug }, index) => {
            const product = catalogProducts.find(
              (candidate) => candidate.slug === slug,
            );
            return product ? (
              <ScrollReveal index={index} key={product.id}>
                <ProductCard
                  product={product}
                />
              </ScrollReveal>
            ) : null;
          })}
        </div>
      </PageContainer>
    </ContentSection>
  );
}

export function ProductCategoriesSection() {
  const categoryCards = categoryDisplayOrder.flatMap((slug) => {
    const category = categories.find((item) => item.slug === slug);
    const content = categoryCardContent[slug];
    if (!category || !content || category.productCount <= 0) return [];

    return [{ category, content }];
  });
  const featuredProducts = showcaseProducts.flatMap((presentation) => {
    const product = catalogProducts.find(
      ({ slug }) => slug === presentation.slug,
    );
    return product ? [{ presentation, product }] : [];
  });

  return (
    <ContentSection className={styles.categorySection} id="product-categories">
      <PageContainer>
        <ScrollReveal index={0}>
          <SectionHeading
            eyebrow="EXPLORE JOHOVO"
            title="Discover Your Beauty Essentials"
            description="Explore our collections and find the right essentials for your everyday beauty and personal-care routine."
          />
        </ScrollReveal>
        <nav
          aria-label="Product categories"
          className={styles.categoryNavigation}
        >
          {categoryCards.map(({ category, content }, index) => (
            <ScrollReveal index={index} key={category.id}>
              <Link
                className={styles.categoryLink}
                href={`/categories/${category.slug}`}
              >
                <span className={styles.categoryLinkNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.categoryLinkText}>
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.categoryDescription}>
                    {content.description}
                  </span>
                  <span className={styles.categoryCount}>
                    {category.productCount}{" "}
                    {category.productCount === 1 ? "product" : "products"}
                  </span>
                </span>
                <span aria-hidden="true" className={styles.categoryArrow}>
                  →
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </nav>
        <ScrollReveal index={0}>
          <SectionHeading
            eyebrow="JOHOVO PRODUCTS"
            title="Shop the collection"
            description="Explore the products featured in the JOHOVO catalogue."
          />
        </ScrollReveal>
        <div className={styles.categoryProductGrid}>
          {featuredProducts.map(({ presentation, product }, index) => {
            const discount = calculateDiscountPercentage(
              product.originalPrice,
              product.sellingPrice,
            );
            const description =
              product.shortDescription &&
              product.shortDescription.trim().length > 20
                ? product.shortDescription
                : "Product details are available on the product page.";

            return (
              <ScrollReveal index={index} key={product.id}>
                <article className={styles.categoryProductCard}>
                  <Link
                    aria-label={`View ${presentation.title}`}
                    className={styles.categoryProductImage}
                    href={`/products/${product.slug}`}
                  >
                    <Image
                      alt={presentation.imageAlt}
                      fill
                      sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 33vw"
                      src={presentation.imageSrc}
                    />
                  </Link>
                  <div className={styles.categoryProductContent}>
                    {product.categories.length ? (
                      <span className={styles.categoryProductType}>
                        {product.categories[0].name}
                      </span>
                    ) : null}
                    <h3>
                      <Link href={`/products/${product.slug}`}>
                        {presentation.title}
                      </Link>
                    </h3>
                    <p className={styles.categoryProductDescription}>
                      {description}
                    </p>
                    {product.sizes.length ? (
                      <p className={styles.categoryProductSize}>
                        Size: {product.sizes.join(", ")}
                      </p>
                    ) : null}
                    <div className={styles.categoryProductPrice}>
                      {product.originalPrice !== null ? (
                        <del>
                          {formatCatalogPrice(
                            product.originalPrice,
                            product.currency,
                          )}
                        </del>
                      ) : null}
                      {product.sellingPrice !== null ? (
                        <strong>
                          {formatCatalogPrice(
                            product.sellingPrice,
                            product.currency,
                          )}
                        </strong>
                      ) : (
                        <span>Price not listed</span>
                      )}
                      {discount !== null ? (
                        <span className={styles.categoryProductDiscount}>
                          {discount}% off
                        </span>
                      ) : null}
                    </div>
                    <p className={styles.categoryProductNote}>
                      Source-listed price; current availability is unconfirmed.
                    </p>
                    <div className={styles.categoryProductActions}>
                      <Link href={`/products/${product.slug}`}>View Product</Link>
                      <Link
                        className={styles.categoryProductActionShop}
                        href={`/products/${product.slug}`}
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </PageContainer>
    </ContentSection>
  );
}

export function HerbalSection() {
  if (!herbalProducts.length) return null;

  return (
    <ContentSection className={styles.herbal} id="herbal-care">
      <PageContainer>
        <HerbalBotanicalPanel className={styles.herbalPanel}>
          <div className={styles.herbalIntro}>
            <HerbalBrandSignature />
            <p className={styles.eyebrow}>Herbal product sub-brand</p>
            <h2>IyalMooligai</h2>
            <p>
              Discover the products identified as IyalMooligai in the source
              catalogue, presented within JOHOVO.
            </p>
            <LinkButton href="/collections/herbal-care" variant="secondary">
              Explore Herbal Care
            </LinkButton>
          </div>
          <div className={styles.herbalProductLinks}>
            {herbalProducts.map((product) => {
              const presentation = getShowcaseProduct(product.slug);
              return (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <span>{presentation?.title ?? product.name}</span>
                  <span aria-hidden="true">View product →</span>
                </Link>
              );
            })}
            <Link href="/collections/herbal-care">
              <span>Browse all IyalMooligai products</span>
              <span aria-hidden="true">Explore Herbal Care →</span>
            </Link>
          </div>
        </HerbalBotanicalPanel>
      </PageContainer>
    </ContentSection>
  );
}

export function ProductInformationSection() {
  if (!hairOil?.ingredientImages.length) return null;

  return (
    <ContentSection className={styles.information} id="product-information">
      <PageContainer>
        <SectionHeading
          eyebrow="Product information"
          title="Source imagery, kept with its product."
          description={`These illustrations were captured on the ${hairOil.name} source page. Their labels do not independently verify the product formula.`}
        />
        <div className={styles.ingredientGrid}>
          {hairOil.ingredientImages.map((image) => (
            <figure className={styles.ingredientCard} key={image.src}>
              <div>
                <Image
                  alt={image.alt}
                  fill
                  sizes="(max-width: 600px) 40vw, (max-width: 1000px) 25vw, 160px"
                  src={image.src}
                />
              </div>
              {image.name ? <figcaption>{image.name}</figcaption> : null}
            </figure>
          ))}
        </div>
        <Link
          className={styles.informationLink}
          href={`/products/${hairOil.slug}`}
        >
          View all information for {hairOil.name} <span aria-hidden="true">→</span>
        </Link>
      </PageContainer>
    </ContentSection>
  );
}

export function InstagramSection() {
  return <InstagramShowcaseSection />;
}

export function ContactSection() {
  return (
    <ContentSection className={styles.contact} id="contact">
      <PageContainer className={styles.contactGrid}>
        <ScrollReveal index={0}>
          <div className={styles.contactCopy}>
            <p className={styles.eyebrow}>Contact &amp; enquiries</p>
            <h2>Let&apos;s Talk About Your Beauty Needs.</h2>
            <p>
              Have a question about a JOHOVO product? We&apos;re here to help.
              Contact our team or send us your enquiry.
            </p>
            <HomeContactDetails />
            <LinkButton
              className={styles.contactButton}
              href="/contact"
              variant="secondary"
            >
              Contact JOHOVO
            </LinkButton>
          </div>
        </ScrollReveal>
        <ScrollReveal index={1}>
          <div className={styles.contactForm}>
            <div className={styles.contactFormHeading}>
              <p className={styles.eyebrow}>We&apos;re happy to help</p>
              <h3>Send Us an Enquiry</h3>
              <p>
                Fill in your details below and we&apos;ll help you find the right herbal product.
              </p>
            </div>
            <ContactForm
              products={catalogProducts.map(
                (product) =>
                  getShowcaseProduct(product.slug)?.title ?? product.name,
              )}
            />
          </div>
        </ScrollReveal>
      </PageContainer>
    </ContentSection>
  );
}
