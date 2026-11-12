import type { Metadata } from "next";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactChannels } from "@/components/contact/contact-channels";
import { PageNavigation } from "@/components/common/page-navigation";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import { catalogProducts } from "@/lib/catalog/migrated-catalog";
import { getShowcaseProduct } from "@/lib/catalog/showcase-products";
import { JOHOVO_CONTACT } from "@/lib/contact";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact Us & Enquiries | JOHOVO",
  description:
    "Get in touch with JOHOVO. Send a product enquiry, connect via WhatsApp, phone or email for personalized herbal skincare & hair care guidance.",
};

export default function ContactPage() {
  const productOptions = catalogProducts.map(
    (product) => getShowcaseProduct(product.slug)?.title ?? product.name
  );

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
                { label: "Contact Us", current: true },
              ]}
            />
          </PageContainer>
        </div>

        {/* Hero Header */}
        <header className={styles.header}>
          <PageContainer>
            <div className={styles.headerInner}>
              <p className={styles.eyebrow}>GET IN TOUCH</p>
              <h1 className={styles.title}>Let&apos;s Talk Beauty & Wellness</h1>
              <p className={styles.subtitle}>
                Have a question about our botanical formulations or need assistance choosing the right herbal routine? We&apos;re here to guide you.
              </p>
            </div>
          </PageContainer>
        </header>

        {/* Main Contact Section */}
        <section aria-label="Contact information and form" className={styles.contentSection}>
          <PageContainer>
            <div className={styles.contactGrid}>
              {/* Left Column: Direct Contact Details & Assurance */}
              <div className={styles.infoColumn}>
                <div className={styles.infoCard}>
                  <h2 className={styles.infoCardTitle}>Quick Contact Channels</h2>
                  <p className={styles.infoCardDesc}>
                    Reach out to our customer care team directly via phone, WhatsApp, or email.
                  </p>

                  <div className={styles.channelsList}>
                    <ContactChannels />

                    {/* Email */}
                    <a className={styles.channelItem} href={`mailto:${JOHOVO_CONTACT.email}`}>
                      <div className={styles.channelIconBox}>
                        <EmailRoundedIcon />
                      </div>
                      <div className={styles.channelMeta}>
                        <span className={styles.channelLabel}>Email Us</span>
                        <strong className={styles.channelValue}>{JOHOVO_CONTACT.email}</strong>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Trust Highlights */}
                <div className={styles.trustCard}>
                  <h3 className={styles.trustCardTitle}>Our Commitment to You</h3>
                  <ul className={styles.trustList}>
                    <li>
                      <CheckCircleOutlineRoundedIcon className={styles.trustCheck} />
                      <span>100% Herbal & Authentic Formulations</span>
                    </li>
                    <li>
                      <CheckCircleOutlineRoundedIcon className={styles.trustCheck} />
                      <span>Dedicated support within 24 business hours</span>
                    </li>
                    <li>
                      <CheckCircleOutlineRoundedIcon className={styles.trustCheck} />
                      <span>All enquiries securely stored and respected</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Redesigned Contact Form Saving to Neon */}
              <div className={styles.formColumn}>
                <div className={styles.formHeader}>
                  <h2 className={styles.formHeaderTitle}>Send Us a Message</h2>
                  <p className={styles.formHeaderSubtitle}>
                    Fill in your details below and we will save your enquiry to our database for prompt response.
                  </p>
                </div>

                <ContactForm products={productOptions} />
              </div>
            </div>
          </PageContainer>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
