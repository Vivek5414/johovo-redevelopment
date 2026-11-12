"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { PageContainer } from "@/components/layout/page-container";
import { getCatalogCategories } from "@/lib/catalog/migrated-catalog";
import { JOHOVO_CONTACT } from "@/lib/contact";
import { recordContactClick } from "@/lib/tracking";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  const categories = getCatalogCategories();

  return (
    <footer className={styles.footer}>
      <PageContainer className={styles.footerInner}>
        <div className={styles.brandColumn}>
          <Logo className={styles.logo} size="footer" />
          <p className={styles.tagline}>
            Product information and media from the JOHOVO catalogue.
          </p>

          <div className={styles.contactLinks}>
            <a
              href={`tel:${JOHOVO_CONTACT.phone}`}
              onClick={() => recordContactClick("call")}
            >
              {JOHOVO_CONTACT.displayPhone}
            </a>
            <a href={`mailto:${JOHOVO_CONTACT.email}`}>{JOHOVO_CONTACT.email}</a>
            <a
              href={`https://wa.me/${JOHOVO_CONTACT.whatsapp}`}
              onClick={() => recordContactClick("whatsapp")}
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

        <nav aria-label="Help and legal" className={styles.linkGroup}>
          <h2>Help</h2>
          <Link href="/faq">FAQ</Link>
          <Link href="/delivery-policy">Delivery Policy</Link>
          <Link href="/return-policy">Return Policy</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
        </nav>
      </PageContainer>

      <div className={styles.footerBottom}>
        <PageContainer className={styles.footerBottomInner}>
          <p>© {new Date().getFullYear()} JOHOVO. All rights reserved.</p>
          <p className={styles.footerDisclaimer}>
            Authentic herbal &amp; botanical cosmetic formulations.
          </p>
        </PageContainer>
      </div>
    </footer>
  );
}
