import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageContainer } from "@/components/layout/page-container";
import styles from "./status-page.module.css";

type StatusPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function StatusPage({ eyebrow, title, description }: StatusPageProps) {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer width="reading">
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.description}>{description}</p>
          <Link className={styles.homeLink} href="/">
            Return to the JOHOVO homepage
          </Link>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
