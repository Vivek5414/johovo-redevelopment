import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import OpacityRoundedIcon from "@mui/icons-material/OpacityRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import { PageNavigation } from "@/components/common/page-navigation";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import categoriesData from "@/data/categories.json";
import styles from "./categories.module.css";

export const metadata: Metadata = {
  title: "All Categories | IyalMooligai Herbal, Cold Pressed Oils & Wellness Snacks",
  description:
    "Explore our complete range of authentic Ayurvedic herbal products, 100% pure Marachekku cold pressed oils, and nutrient-rich wellness trail mixes.",
};

type SubRange = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  items: string[];
  qualitySourcing?: string;
  benefits?: string;
  howToUse?: string;
  salesHook?: string;
};

type CategoryItem = {
  id: string;
  title: string;
  shortTitle: string;
  subtitle?: string;
  slug: string;
  href: string;
  image: string;
  tag?: string;
  badge?: string;
  description?: string;
  introCopy?: string;
  subRanges?: SubRange[];
};

const categoryIcons: Record<string, typeof SpaRoundedIcon> = {
  "herbal-products": SpaRoundedIcon,
  "wellness-snacks": EnergySavingsLeafRoundedIcon,
  "cold-pressed-oils": OpacityRoundedIcon,
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
              <span className={styles.badgeText}>AUTHENTIC BOTANICAL ARCHITECTURE</span>
            </div>
            <h1 className={styles.title}>
              Explore Our <span className={styles.titleAccent}>Herbal Categories</span>
            </h1>
            <p className={styles.description}>
              Handcrafted with pure botanical herbs, traditional wooden-press Marachekku oils, and wholesome wellness dry fruit mixes. Crafted without chemical additives or preservatives.
            </p>
          </header>

          <div className={styles.categoriesPillars}>
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.id] ?? SpaRoundedIcon;
              return (
                <article key={category.id} className={styles.pillarSection} id={category.slug}>
                  {/* Category Pillar Header */}
                  <div className={styles.pillarHeader}>
                    <div className={styles.pillarNumberWrap}>
                      <span className={styles.pillarNumber}>0{index + 1}</span>
                      <div className={styles.pillarIcon}>
                        <IconComponent fontSize="medium" />
                      </div>
                    </div>
                    <div className={styles.pillarInfo}>
                      <div className={styles.pillarBadgeRow}>
                        <span className={styles.pillarTag}>{category.tag}</span>
                        <span className={styles.pillarBadge}>{category.badge}</span>
                      </div>
                      <h2 className={styles.pillarTitle}>{category.title}</h2>
                      <p className={styles.pillarSubtitle}>{category.subtitle}</p>
                      <p className={styles.pillarDesc}>
                        {category.introCopy || category.description}
                      </p>
                    </div>
                    <div className={styles.pillarAction}>
                      <Link href={category.href} className={styles.pillarCtaBtn}>
                        <span>Browse {category.shortTitle}</span>
                        <ArrowForwardRoundedIcon fontSize="small" />
                      </Link>
                    </div>
                  </div>

                  {/* Sub-ranges Grid */}
                  {category.subRanges && category.subRanges.length > 0 && (
                    <div className={styles.subRangesList}>
                      {category.subRanges.map((sub, sIdx) => (
                        <div key={sub.id || sIdx} className={styles.subRangeCard}>
                          <div className={styles.subRangeCardHeader}>
                            <span className={styles.subRangeBadge}>Range 0{sIdx + 1}</span>
                            <h3 className={styles.subRangeName}>{sub.name}</h3>
                            <span className={styles.subRangeTagline}>{sub.tagline}</span>
                          </div>

                          {sub.qualitySourcing && (
                            <div className={styles.featureBox}>
                              <div className={styles.featureBoxHeader}>
                                <span className={styles.featureDotGreen} />
                                <strong>Quality Sourcing:</strong>
                              </div>
                              <p>{sub.qualitySourcing}</p>
                            </div>
                          )}

                          {sub.benefits && (
                            <div className={styles.featureBox}>
                              <div className={styles.featureBoxHeader}>
                                <span className={styles.featureDotPink} />
                                <strong>Key Benefits:</strong>
                              </div>
                              <p>{sub.benefits}</p>
                            </div>
                          )}

                          {sub.howToUse && (
                            <div className={styles.featureBox}>
                              <div className={styles.featureBoxHeader}>
                                <span className={styles.featureDotGold} />
                                <strong>How to Use:</strong>
                              </div>
                              <p>{sub.howToUse}</p>
                            </div>
                          )}

                          {sub.salesHook && (
                            <div className={styles.salesHookBox}>
                              <span className={styles.salesHookStar}>✨</span>
                              <em>{sub.salesHook}</em>
                            </div>
                          )}

                          {sub.items && sub.items.length > 0 && (
                            <div className={styles.itemsBlock}>
                              <span className={styles.itemsHeading}>Included / Available:</span>
                              <div className={styles.itemsChips}>
                                {sub.items.map((it, iIdx) => (
                                  <span key={iIdx} className={styles.itemChip}>
                                    <CheckCircleRoundedIcon className={styles.chipCheck} />
                                    {it}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className={styles.subRangeFooter}>
                            <Link href={category.href} className={styles.subRangeLink}>
                              <span>View Products in this Range</span>
                              <ArrowForwardRoundedIcon fontSize="inherit" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}