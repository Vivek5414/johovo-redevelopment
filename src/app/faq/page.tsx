import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import { sourceHtmlToText } from "@/lib/catalog/migrated-catalog";
import { migratedPublicPages } from "@/lib/migration/migrated-content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Frequently asked questions captured from the public JOHOVO website.",
};

const faqPage = migratedPublicPages.pages.find(({ slug }) => slug === "faq");

function parseFaqItems(text: string) {
  const items: { question: string; answer: string[] }[] = [];
  let currentItem: { question: string; answer: string[] } | null = null;

  for (const line of text.split(/\n+/).map((part) => part.trim()).filter(Boolean)) {
    const question = line.match(/^\d+\.\s+(.+)$/);
    if (question) {
      if (currentItem) items.push(currentItem);
      currentItem = { question: question[1], answer: [] };
      continue;
    }

    if (line === "+" || line === "FAQ Accordion Section") continue;
    currentItem?.answer.push(line);
  }

  if (currentItem) items.push(currentItem);

  return items.filter((item) => item.answer.length > 0);
}

const faqItems = parseFaqItems(sourceHtmlToText(faqPage?.contentHtml) ?? "");

export default function FaqPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>JOHOVO information</p>
            <h1>Frequently asked questions</h1>
            <p>
              Answers captured from the public JOHOVO website. Please confirm
              current product, delivery, and purchase details with JOHOVO.
            </p>
          </header>
          <div className={styles.faqList}>
            {faqItems.map(({ question, answer }, index) => (
              <details className={styles.faqItem} key={`${index}-${question}`}>
                <summary>
                  <span className={styles.questionNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{question}</span>
                </summary>
                <div className={styles.answer}>
                  <div>
                    <p>{answer.join(" ")}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
