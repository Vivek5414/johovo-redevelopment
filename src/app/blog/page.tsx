import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageContainer } from "@/components/layout/page-container";
import { PageNavigation } from "@/components/common/page-navigation";
import { BlogSection } from "@/components/blog";
import { getAllBlogs } from "@/lib/blogs";
import styles from "./blog-page.module.css";

export const metadata: Metadata = {
  title: "The Botanical Journal | JOHOVO - Natural Beauty & Ayurvedic Wisdom",
  description:
    "Explore herbal care guides, botanical formulation secrets, and scalp care rituals from JOHOVO's wellness experts.",
};

export default function BlogListingPage() {
  const blogs = getAllBlogs();

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className={styles.navigationBar}>
          <PageContainer>
            <PageNavigation
              backHref="/"
              backLabel="Back to Home"
              items={[
                { label: "Home", href: "/" },
                { label: "Journal", current: true },
              ]}
            />
          </PageContainer>
        </div>

        <header className={styles.heroHeader}>
          <PageContainer>
            <div className={styles.heroInner}>
              <p className={styles.eyebrow}>BOTANICAL WISDOM &amp; CARE GUIDES</p>
              <h1 className={styles.mainTitle}>The JOHOVO Journal</h1>
              <p className={styles.heroDescription}>
                Ancient Ayurvedic rituals, holistic botanical science, and practical guides to nurture radiant skin, scalp, and hair naturally.
              </p>
            </div>
          </PageContainer>
        </header>

        <BlogSection
          eyebrow="ALL ARTICLES"
          posts={blogs}
          showViewAll={false}
          title="All Stories &amp; Ritual Guides"
        />
      </main>
      <SiteFooter />
    </>
  );
}
