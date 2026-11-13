import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageContainer } from "@/components/layout/page-container";
import { PageNavigation } from "@/components/common/page-navigation";
import { AboutSection } from "@/components/about";
import styles from "./about-us.module.css";

export const metadata: Metadata = {
  title: "About Us | JOHOVO - Authentic Botanical Formulations",
  description:
    "Learn about JOHOVO's story, mission, and dedication to pure herbal skincare, hair wellness, and clean beauty.",
};

export default function AboutPage() {
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
                { label: "About Us", current: true },
              ]}
            />
          </PageContainer>
        </div>

        <AboutSection />
      </main>
      <SiteFooter />
    </>
  );
}
