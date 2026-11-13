import React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageContainer } from "@/components/layout/page-container";
import { PageNavigation } from "@/components/common/page-navigation";
import { JOHOVO_CONTACT } from "@/lib/contact";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import styles from "./policy-layout.module.css";

export const POLICY_NAV_LINKS = [
  { label: "Delivery Policy", href: "/delivery-policy", slug: "delivery-policy" },
  { label: "Return Policy", href: "/return-policy", slug: "return-policy" },
  { label: "Privacy Policy", href: "/privacy-policy", slug: "privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions", slug: "terms-and-conditions" },
  { label: "Frequently Asked Questions", href: "/faq", slug: "faq" },
];

export type PolicySectionItem = {
  title?: string;
  text?: string;
  bullets?: string[];
};

export type PolicySectionData = {
  title: string;
  icon?: React.ReactNode;
  lead?: string;
  items?: PolicySectionItem[];
  bodyParagraphs?: string[];
  bullets?: string[];
};

type PolicyPageLayoutProps = {
  activeSlug: "delivery-policy" | "return-policy" | "privacy-policy" | "terms-and-conditions" | "faq";
  eyebrow: string;
  title: string;
  gradientTitlePart?: string;
  description: string;
  lastUpdated?: string;
  leadNotice?: string;
  sections?: PolicySectionData[];
  children?: React.ReactNode;
};

export function PolicyPageLayout({
  activeSlug,
  eyebrow,
  title,
  gradientTitlePart,
  description,
  lastUpdated = "Updated for 2026",
  leadNotice,
  sections,
  children,
}: PolicyPageLayoutProps) {
  const whatsappUrl = `https://wa.me/${JOHOVO_CONTACT.whatsapp}?text=${encodeURIComponent(
    `Hello JOHOVO, I have a question regarding your ${title}.`
  )}`;

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        {/* Navigation Breadcrumbs */}
        <div className={styles.navigationBar}>
          <PageContainer>
            <PageNavigation
              backHref="/"
              backLabel="Back to Home"
              items={[
                { label: "Home", href: "/" },
                { label: title, current: true },
              ]}
            />
          </PageContainer>
        </div>

        {/* Hero Header */}
        <header className={styles.heroHeader}>
          <div aria-hidden="true" className={styles.ambientGlow} />
          <PageContainer>
            <div className={styles.headerInner}>
              <div className={styles.eyebrowBadge}>
                <span>{eyebrow}</span>
              </div>
              <h1 className={styles.mainTitle}>
                {title}{" "}
                {gradientTitlePart && (
                  <span className={styles.gradientAccent}>{gradientTitlePart}</span>
                )}
              </h1>
              <p className={styles.heroDescription}>{description}</p>
              {lastUpdated && (
                <div className={styles.lastUpdatedPill}>
                  <AccessTimeRoundedIcon style={{ fontSize: "0.95rem" }} />
                  <span>{lastUpdated}</span>
                </div>
              )}
            </div>
          </PageContainer>
        </header>

        {/* Content Layout: Article + Legal Sidebar */}
        <div className={styles.layoutWrapper}>
          <PageContainer>
            <div className={styles.layoutGrid}>
              {/* Main Content Area */}
              <article className={styles.mainArticle}>
                {leadNotice && <div className={styles.leadNoticeCard}>{leadNotice}</div>}

                {sections?.map((section, idx) => (
                  <div className={styles.policySectionCard} key={idx}>
                    <div className={styles.sectionHeaderRow}>
                      {section.icon && (
                        <div className={styles.sectionIconWrap}>{section.icon}</div>
                      )}
                      <h2 className={styles.sectionTitle}>{section.title}</h2>
                    </div>

                    <div className={styles.sectionBody}>
                      {section.lead && <p>{section.lead}</p>}

                      {section.bodyParagraphs?.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}

                      {section.items?.map((item, itemIdx) => (
                        <div className={styles.itemBlock} key={itemIdx}>
                          {item.title && <div className={styles.itemTitle}>{item.title}</div>}
                          {item.text && <div className={styles.itemText}>{item.text}</div>}
                          {item.bullets && item.bullets.length > 0 && (
                            <ul className={styles.bulletList}>
                              {item.bullets.map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}

                      {section.bullets && section.bullets.length > 0 && (
                        <ul className={styles.bulletList}>
                          {section.bullets.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}

                {children}
              </article>

              {/* Sidebar with Navigation & Direct Support */}
              <aside className={styles.sidebar}>
                {/* Legal Policy Navigation Links */}
                <div className={styles.sidebarCard}>
                  <h3 className={styles.sidebarTitle}>Customer Policies</h3>
                  <nav className={styles.policyNavList}>
                    {POLICY_NAV_LINKS.map((link) => {
                      const isActive = link.slug === activeSlug;
                      return (
                        <Link
                          className={`${styles.policyNavLink} ${
                            isActive ? styles.policyNavLinkActive : ""
                          }`}
                          href={link.href}
                          key={link.slug}
                        >
                          <span>{link.label}</span>
                          <ArrowForwardRoundedIcon className={styles.navArrow} />
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Direct Support Assistance */}
                <div className={`${styles.sidebarCard} ${styles.supportCard}`}>
                  <h3 className={styles.sidebarTitle}>Need Help?</h3>
                  <p>
                    Our customer care team is available 7 days a week to clarify any order, delivery, or return queries.
                  </p>
                  <div className={styles.supportList}>
                    <a className={styles.supportItem} href={`tel:${JOHOVO_CONTACT.phone}`}>
                      <PhoneRoundedIcon className={styles.supportItemIcon} />
                      <span>{JOHOVO_CONTACT.displayPhone}</span>
                    </a>
                    <a className={styles.supportItem} href={`mailto:${JOHOVO_CONTACT.email}`}>
                      <EmailRoundedIcon className={styles.supportItemIcon} />
                      <span>{JOHOVO_CONTACT.email}</span>
                    </a>
                  </div>
                  <a
                    className={styles.whatsappActionBtn}
                    href={whatsappUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <WhatsAppIcon fontSize="small" />
                    <span>WhatsApp Support</span>
                  </a>
                </div>
              </aside>
            </div>
          </PageContainer>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
