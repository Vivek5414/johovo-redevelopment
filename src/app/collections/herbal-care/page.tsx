import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HerbalBotanicalPanel } from "@/components/brand/herbal-botanical-pattern";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/site-header";
import { LinkButton } from "@/components/ui/link-button";
import { iyalmooligaiCollections } from "@/lib/catalog/iyalmooligai-collections";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "IyalMooligai – Natural Health & Wellness",
  description:
    "Explore the IyalMooligai brand experience across herbal products, healthy snacks and cold pressed oils.",
  openGraph: {
    title: "IyalMooligai – Natural Health & Wellness",
    description:
      "Explore the IyalMooligai brand experience across herbal products, healthy snacks and cold pressed oils.",
  },
};

export default function HerbalCarePage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <HerbalBotanicalPanel className={styles.banner}>
            <div className={styles.bannerContent}>
              <Image
                alt="IyalMooligai logo"
                className={styles.brandLogo}
                height={120}
                src="/images/brand/iyalmooligai-logo.png"
                unoptimized
                width={260}
              />
              <p className={styles.eyebrow}>JOHOVO · Natural Health &amp; Wellness</p>
              <h1>IyalMooligai – Natural Health &amp; Wellness</h1>
              <p className={styles.intro}>
                Explore a thoughtfully curated range of personal care, everyday
                wellness foods and traditional cold pressed oils, brought together
                under the IyalMooligai brand.
              </p>
              <div className={styles.buttonRow}>
                <LinkButton href="#category-grid" variant="secondary">
                  Explore categories
                </LinkButton>
                <LinkButton href="/products" variant="secondary">
                  Browse the catalogue
                </LinkButton>
              </div>
            </div>
          </HerbalBotanicalPanel>

          <section
            aria-labelledby="category-grid-title"
            className={styles.categoryOverview}
            id="category-grid"
          >
            <div className={styles.sectionIntro}>
              <p className={styles.eyebrow}>IyalMooligai brand experience</p>
              <h2 id="category-grid-title">Three wellness categories</h2>
              <p className={styles.sourceDisclosure}>
                Collection artwork and product details are reproduced from the
                supplied PDF; claims shown in the source text or packaging have
                not been independently verified.
              </p>
            </div>

            <div className={styles.categoryGrid}>
              {iyalmooligaiCollections.map((category) => {
                const isAvailable = !category.isUpcoming;

                return (
                  <article
                    className={`${styles.categoryCard} ${!isAvailable ? styles.upcomingCard : ""}`}
                    data-category={category.slug}
                    id={category.slug}
                    key={category.slug}
                  >
                    <div className={styles.categoryHeader}>
                      <span className={styles.categoryNumber}>{category.number}</span>
                      <span
                        className={`${styles.categoryStatus} ${isAvailable ? styles.availableStatus : styles.upcomingStatus}`}
                      >
                        {category.status}
                      </span>
                      <div className={styles.categoryHeadingWrap}>
                        <h3>{category.title}</h3>
                        <p>{category.description}</p>
                      </div>
                    </div>

                    <div className={`${styles.categoryVisual} ${category.isUpcoming ? styles.upcomingVisual : ""}`}>
                      {category.imageSrc ? (
                        <Image
                          alt={category.imageAlt}
                          fill
                          sizes="(max-width: 600px) 100vw, 420px"
                          src={category.imageSrc}
                        />
                      ) : (
                        <Image
                          alt="IyalMooligai brand logo"
                          className={styles.upcomingLogo}
                          height={120}
                          src="/images/brand/iyalmooligai-logo.png"
                          unoptimized
                          width={260}
                        />
                      )}
                    </div>

                    <ul aria-label={`${category.title} subcategories`} className={styles.tagList}>
                      {category.subcategories.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>

                    {category.isUpcoming ? (
                      <p className={styles.comingSoonNote}>
                        This collection is not yet available to purchase.
                      </p>
                    ) : null}
                    <Link
                      className={styles.categoryLink}
                      href={`/collections/herbal-care/${category.slug}`}
                    >
                      {isAvailable ? "View available products" : "Explore collection"}{" "}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
