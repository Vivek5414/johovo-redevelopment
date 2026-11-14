"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import LockPersonRoundedIcon from "@mui/icons-material/LockPersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import { PageContainer } from "@/components/layout/page-container";
import categoriesData from "@/data/categories.json";
import { JOHOVO_CONTACT } from "@/lib/contact";
import { recordContactClick } from "@/lib/tracking";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Botanical Trust Bar */}
      <div className={styles.trustBanner}>
        <PageContainer className={styles.trustBannerInner}>
          <div className={styles.trustItem}>
            <SpaRoundedIcon className={styles.trustIcon} fontSize="small" />
            <span>100% Pure Botanical Ingredients</span>
          </div>
          <div className={styles.trustItem}>
            <ShieldRoundedIcon className={styles.trustIcon} fontSize="small" />
            <span>Ethically Sourced &amp; Chemical Free</span>
          </div>
          <div className={styles.trustItem}>
            <LockPersonRoundedIcon className={styles.trustIcon} fontSize="small" />
            <span>Authorized JOHOVO Herbal Care</span>
          </div>
        </PageContainer>
      </div>

      <PageContainer className={styles.footerInner}>
        {/* Brand & Contact Column */}
        <div className={styles.brandColumn}>
          <Logo className={styles.logo} size="footer" />
          <p className={styles.tagline}>
            Pure Ayurvedic formulations, unrefined cold-pressed Marachekku oils, and nutrient-dense wellness trail mixes crafted with time-honored heritage.
          </p>

          <div className={styles.contactLinks}>
            <a
              href={`tel:${JOHOVO_CONTACT.phone}`}
              onClick={() => recordContactClick("call")}
              className={styles.contactItem}
            >
              <PhoneRoundedIcon fontSize="small" className={styles.contactIcon} />
              <span>{JOHOVO_CONTACT.displayPhone}</span>
            </a>
            <a
              href={`mailto:${JOHOVO_CONTACT.email}`}
              className={styles.contactItem}
            >
              <EmailRoundedIcon fontSize="small" className={styles.contactIcon} />
              <span>{JOHOVO_CONTACT.email}</span>
            </a>
            <a
              href={`https://wa.me/${JOHOVO_CONTACT.whatsapp}`}
              onClick={() => recordContactClick("whatsapp")}
              rel="noopener noreferrer"
              target="_blank"
              className={styles.contactItem}
            >
              <WhatsAppIcon fontSize="small" className={styles.contactIcon} />
              <span>WhatsApp: {JOHOVO_CONTACT.displayWhatsApp}</span>
            </a>
          </div>
        </div>

        {/* Quick Explore */}
        <nav aria-label="Explore JOHOVO" className={styles.linkGroup}>
          <h2>Explore</h2>
          <Link href="/">Home</Link>
          <Link href="/about-us">About JOHOVO</Link>
          <Link href="/products">All Products</Link>
          <Link href="/blog">Herbal Care Blog</Link>
          <Link href="/testimonial">Customer Reviews</Link>
          <Link href="/johovoinsta">Instagram Feed</Link>
          <Link href="/contact">Contact &amp; Enquiries</Link>
        </nav>

        {/* Categories from JSON */}
        <nav aria-label="Product categories" className={styles.linkGroup}>
          <h2>Categories</h2>
          {categoriesData.map((cat: any) => (
            <Link href={cat.href || `/categories/${cat.slug}`} key={cat.id}>
              {cat.shortTitle || cat.title}
            </Link>
          ))}
          <Link href="/categories/herbal-products">Herbal Hair &amp; Face</Link>
          <Link href="/categories/wellness-snacks">Wellness Trail Mixes</Link>
          <Link href="/categories/cold-pressed-oils">100% Marachekku Oils</Link>
        </nav>

        {/* Customer Care & Policies */}
        <nav aria-label="Help and policies" className={styles.linkGroup}>
          <h2>Policies &amp; Help</h2>
          <Link href="/faq">FAQ</Link>
          <Link href="/delivery-policy">Delivery Policy</Link>
          <Link href="/return-policy">Return Policy</Link>
          <Link href="/refund-policy">Refund Policy</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
        </nav>

  
      </PageContainer>

      {/* Footer Bottom Bar */}
      <div className={styles.footerBottom}>
        <PageContainer className={styles.footerBottomInner}>
          <div className={styles.copyrightText}>
            <p>© {currentYear} JOHOVO. All rights reserved.</p>
            <span className={styles.divider}>•</span>
            <p className={styles.footerDisclaimer}>
              Authentic Herbal Formulations &amp; Marachekku Botanical Oils
            </p>
          </div>
          <div className={styles.adminBottomBadge}>
            <Link href="/admin/login" className={styles.adminSmallPill}>
              <LockPersonRoundedIcon sx={{ fontSize: 13 }} />
              <span>Admin Login</span>
            </Link>
          </div>
        </PageContainer>
      </div>
    </footer>
  );
}