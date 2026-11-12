import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { PageNavigation } from "@/components/common/page-navigation";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import categoriesData from "@/data/categories.json";
import styles from "./categories.module.css";

export const metadata: Metadata = {
  title: "Categories | JOHOVO Herbal & Ayurvedic Skincare",
  description:
    "Explore our complete range of authentic Ayurvedic and herbal formulations categorized by face care, hair care, body care, and botanicals.",
};

type CategoryItem = {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  href: string;
  image: string;
  tag?: string;
  description?: string;
};

export default function CategoriesPage() {
  const categories = categoriesData as CategoryItem[];

  return (
    <>
      <SiteHeader />
      <main className={styles.categoriesPage}>
        <PageContainer>
          <PageNavigation
            backHref="/"
            backLabel="Back to Home"
            items={[
              { label: "Home", href: "/" },
              { label: "Categories", current: true },
            ]}
          />

          <header className={styles.headerSection}>
            <div className={styles.headerBadge}>
              <span className={styles.badgeDot} />
              <span className={styles.badgeText}>DISCOVER BY CATEGORY</span>
            </div>
            <h1 className={styles.title}>
              Explore Our <span className={styles.titleAccent}>Herbal Collections</span>
            </h1>
            <p className={styles.description}>
              Handcrafted with pure botanical essences and time-honored Ayurvedic wisdom. Choose a category below to discover targeted natural remedies.
            </p>
          </header>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <Link
                aria-label={`Explore ${category.title}`}
                className={styles.categoryCard}
                href={category.href}
                key={category.id}
              >
                <div className={styles.cardImageContainer}>
                  {category.tag ? (
                    <span className={styles.tagBadge}>{category.tag}</span>
                  ) : null}
                  <Image
                    alt={category.title}
                    className={styles.categoryImage}
                    fill
                    priority={false}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    src={category.image}
                  />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeaderGroup}>
                    <h2 className={styles.cardTitle}>{category.title}</h2>
                    {category.subtitle ? (
                      <span className={styles.cardSubtitle}>
                        {category.subtitle}
                      </span>
                    ) : null}
                  </div>

                  {category.description ? (
                    <p className={styles.cardDescription}>
                      {category.description}
                    </p>
                  ) : null}

                  <div className={styles.cardFooter}>
                    <span>Browse Collection</span>
                    <span className={styles.actionIconWrapper}>
                      <ArrowForwardRoundedIcon className={styles.actionIcon} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
