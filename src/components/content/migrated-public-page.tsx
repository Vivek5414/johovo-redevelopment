import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  migratedPublicPages,
  type MigratedPublicPage as SourcePage,
} from "@/lib/migration/migrated-content";
import { sourceHtmlToText } from "@/lib/catalog/migrated-catalog";
import styles from "./migrated-public-page.module.css";

type Props = {
  slug: string;
  description: string;
  note?: string;
};

function getSourcePage(slug: string): SourcePage | undefined {
  return migratedPublicPages.pages.find((page) => page.slug === slug);
}

function parseSourceText(text: string) {
  const blocks: ({ type: "paragraph"; text: string } | { type: "list"; items: string[] })[] = [];

  for (const line of text.split(/\n+/).map((part) => part.trim()).filter(Boolean)) {
    if (line.startsWith("• ")) {
      const lastBlock = blocks.at(-1);
      if (lastBlock?.type === "list") {
        lastBlock.items.push(line.slice(2));
      } else {
        blocks.push({ type: "list", items: [line.slice(2)] });
      }
    } else {
      blocks.push({ type: "paragraph", text: line });
    }
  }

  return blocks;
}

export function getMigratedPublicPageMetadata(
  slug: string,
  description: string,
): Metadata {
  const page = getSourcePage(slug);
  return {
    title: sourceHtmlToText(page?.titleHtml) ?? "JOHOVO information",
    description,
  };
}

export function MigratedPublicPage({ slug, description, note }: Props) {
  const page = getSourcePage(slug);
  const title = sourceHtmlToText(page?.titleHtml);
  const content = sourceHtmlToText(page?.contentHtml);
  if (!page || !title || !content) notFound();

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>JOHOVO information</p>
            <h1>{title}</h1>
            <p>{description}</p>
            <p className={styles.sourceNote}>
              This page presents text captured from the publicly available
              JOHOVO website. Its current accuracy has not been independently
              confirmed.
            </p>
            {note ? <p className={styles.sourceNote}>{note}</p> : null}
          </header>
          <article className={styles.content}>
            {parseSourceText(content).map((block, index) =>
              block.type === "list" ? (
                <ul key={`list-${index}`}>
                  {block.items.map((item, itemIndex) => (
                    <li key={`${index}-${itemIndex}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={`paragraph-${index}`}>{block.text}</p>
              ),
            )}
          </article>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
