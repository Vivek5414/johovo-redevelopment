import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppEnquiryForm } from "@/components/contact/whatsapp-enquiry-form";
import { catalogProducts } from "@/lib/catalog/migrated-catalog";
import { getShowcaseProduct } from "@/lib/catalog/showcase-products";
import { JOHOVO_CONTACT } from "@/lib/contact";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact and product enquiry information for JOHOVO.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>Contact & enquiries</p>
            <h1>Get in touch with JOHOVO</h1>
            <p>
              Contact details below were publicly listed on the original JOHOVO
              website. Please confirm current availability directly with
              JOHOVO.
            </p>
          </header>
          <div className={styles.contactGrid}>
            <section aria-labelledby="contact-details-title" className={styles.details}>
              <h2 id="contact-details-title">Contact details</h2>
              <a href={`tel:${JOHOVO_CONTACT.phone}`}>
                Call {JOHOVO_CONTACT.displayPhone}
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
              <p>
                Source:{" "}
                <a
                  href={JOHOVO_CONTACT.sourceUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  JOHOVO return policy
                </a>
              </p>
            </section>
            <section aria-labelledby="enquiry-title" className={styles.formPanel}>
              <h2 id="enquiry-title">Send an enquiry</h2>
              <WhatsAppEnquiryForm
                products={catalogProducts.map(
                  (product) =>
                    getShowcaseProduct(product.slug)?.title ?? product.name,
                )}
              />
            </section>
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
