import Link from "next/link";
import Logo from "@/components/Logo";
import { getCatalogCategories } from "@/lib/catalog/migrated-catalog";
import { JOHOVO_CONTACT } from "@/lib/contact";
import { PageContainer } from "./page-container";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  const categories = getCatalogCategories();

  return (
    <footer className={styles.footer}>
      <PageContainer className={styles.footerContent}>
        <div className={styles.brandColumn}>
          <Logo className={styles.brand} size="footer" />
          <p>Product information and media from the JOHOVO catalogue.</p>
          <div className={styles.contactLinks}>
            <a href={`tel:${JOHOVO_CONTACT.phone}`}>
              {JOHOVO_CONTACT.displayPhone}
            </a>
            <a href={`mailto:${JOHOVO_CONTACT.email}`}>
              {JOHOVO_CONTACT.email}
            </a>
            <a
              href={`https://wa.me/${JOHOVO_CONTACT.whatsapp}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              WhatsApp {JOHOVO_CONTACT.displayWhatsApp}
            </a>
          </div>
        </div>
        <nav aria-label="Explore JOHOVO" className={styles.linkGroup}>
          <h2>Explore</h2>
          <Link href="/">Home</Link>
          <Link href="/about-us">About JOHOVO</Link>
          <Link href="/products">All Products</Link>
          <Link href="/collections/herbal-care">Herbal Care</Link>
          <Link href="/#reviews">Customer Reviews</Link>
          <Link href="/contact">Contact & enquiries</Link>
        </nav>
        <nav aria-label="Product categories" className={styles.linkGroup}>
          <h2>Categories</h2>
          {categories.map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.id}>
              {category.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Policies and information" className={styles.linkGroup}>
          <h2>Information</h2>
          <Link href="/faq">FAQ</Link>
          <Link href="/delivery-policy">Delivery Policy</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms & Conditions</Link>
          <Link href="/return-policy">Return Policy</Link>
          <Link href="/refund-policy">Refund Policy</Link>
        </nav>
      </PageContainer>
      <PageContainer className={styles.copyright}>
        <span>JOHOVO</span>
        <span>Product prices, details and policies are shown as captured from the source site.</span>
      </PageContainer>
    </footer>
  );
}
