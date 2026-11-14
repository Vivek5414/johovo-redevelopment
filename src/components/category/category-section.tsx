"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import EnergySavingsLeafRoundedIcon from "@mui/icons-material/EnergySavingsLeafRounded";
import OpacityRoundedIcon from "@mui/icons-material/OpacityRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import verifiedBadgeIcon from "@mui/icons-material/VerifiedRounded";
import categoriesData from "@/data/categories.json";
import { PageContainer } from "@/components/layout/page-container";
import styles from "./category-section.module.css";

export type SubRangeItem = {
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

export type CategoryItem = {
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
  subRanges?: SubRangeItem[];
};

const categoryIcons: Record<string, typeof SpaRoundedIcon> = {
  "herbal-products": SpaRoundedIcon,
  "wellness-snacks": EnergySavingsLeafRoundedIcon,
  "cold-pressed-oils": OpacityRoundedIcon,
};

export function CategorySection() {
  const categories = categoriesData as CategoryItem[];
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id ?? "herbal-products");

  const currentCategory = categories.find((c) => c.id === activeTab) ?? categories[0];

  if (!categories || categories.length === 0) return null;

  return (
    <section
      aria-label="IyalMooligai authentic herbal categories and natural ranges"
      className={styles.categorySection}
      id="categories"
    >
      <PageContainer>
        <div className={styles.categorySectionWrapper}>
          {/* Header Bar */}
          <div className={styles.sectionHeader}>
            <div className={styles.headerTextGroup}>
              <div className={styles.eyebrowBadge}>
                <span className={styles.eyebrowDot} />
                <span className={styles.eyebrow}>IYALMOOLIGAI BOTANICAL COLLECTIONS</span>
              </div>
              <h2 className={styles.title}>
                Explore by <span className={styles.titleAccent}>Natural Category</span>
              </h2>
              <p className={styles.subtitle}>
                Pure tradition, ethically sourced herbs, wooden-press Marachekku oils, and nutrient-dense wellness trail mixes.
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className={styles.tabsContainer} role="tablist" aria-label="Product categories tabs">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.id] ?? SpaRoundedIcon;
              const isActive = category.id === activeTab;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${category.id}`}
                  id={`tab-${category.id}`}
                  className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
                  onClick={() => setActiveTab(category.id)}
                >
                  <span className={styles.tabIcon}>
                    <IconComponent fontSize="small" />
                  </span>
                  <span className={styles.tabTextWrap}>
                    <span className={styles.tabTitle}>{category.shortTitle}</span>
                    <span className={styles.tabBadge}>{category.badge}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Category Showcase Panel */}
          {currentCategory && (
            <div
              id={`panel-${currentCategory.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${currentCategory.id}`}
              className={styles.activeShowcase}
            >
              <div className={styles.categoryHeroBanner}>
                <div className={styles.heroTextContent}>
                  <div className={styles.badgeRow}>
                    <span className={styles.heroPill}>{currentCategory.tag}</span>
                    <span className={styles.heroPillSecondary}>{currentCategory.badge}</span>
                  </div>
                  <h3 className={styles.categoryHeroTitle}>{currentCategory.title}</h3>
                  <p className={styles.categoryHeroDesc}>
                    {currentCategory.introCopy || currentCategory.description}
                  </p>
                  <Link href={currentCategory.href} className={styles.heroExploreBtn}>
                    <span>Explore Full Range</span>
                    <ArrowForwardRoundedIcon fontSize="small" />
                  </Link>
                </div>
                <div className={styles.heroImageWrapper}>
                  <Image
                    src={currentCategory.image}
                    alt={currentCategory.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className={styles.heroImage}
                  />
                  <div className={styles.heroImageOverlay} />
                  <div className={styles.trustTag}>
                    <LocalFloristRoundedIcon fontSize="small" className={styles.trustIcon} />
                    <span>100% Chemical-Free &amp; Pure</span>
                  </div>
                </div>
              </div>

              {/* Sub-ranges Grid */}
              {currentCategory.subRanges && currentCategory.subRanges.length > 0 && (
                <div className={styles.subRangesWrapper}>
                  <div className={styles.subRangesHeader}>
                    <h4 className={styles.subRangesHeading}>
                      Key Ranges in {currentCategory.shortTitle}
                    </h4>
                    <span className={styles.subRangesCount}>
                      {currentCategory.subRanges.length} Distinct Formulations
                    </span>
                  </div>

                  <div className={styles.subRangesGrid}>
                    {currentCategory.subRanges.map((sub, idx) => (
                      <div key={sub.id || idx} className={styles.subCard}>
                        <div className={styles.subCardHeader}>
                          <span className={styles.subCardIndex}>0{idx + 1}</span>
                          <div>
                            <h5 className={styles.subCardTitle}>{sub.name}</h5>
                            <span className={styles.subCardTagline}>{sub.tagline}</span>
                          </div>
                        </div>

                        {sub.qualitySourcing && (
                          <div className={styles.featureBlock}>
                            <div className={styles.featureLabel}>
                              <span className={styles.featureDot} /> Sourcing &amp; Purity
                            </div>
                            <p className={styles.featureText}>{sub.qualitySourcing}</p>
                          </div>
                        )}

                        {sub.benefits && (
                          <div className={styles.featureBlock}>
                            <div className={styles.featureLabel}>
                              <span className={styles.featureDotAlt} /> Core Benefits
                            </div>
                            <p className={styles.featureText}>{sub.benefits}</p>
                          </div>
                        )}

                        {sub.items && sub.items.length > 0 && (
                          <div className={styles.itemsWrapper}>
                            <span className={styles.itemsLabel}>Featured Items:</span>
                            <div className={styles.itemTags}>
                              {sub.items.slice(0, 6).map((item, itemIdx) => (
                                <span key={itemIdx} className={styles.itemTag}>
                                  {item}
                                </span>
                              ))}
                              {sub.items.length > 6 && (
                                <span className={styles.itemTagMore}>
                                  +{sub.items.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className={styles.subCardFooter}>
                          <Link
                            href={`/products?category=${currentCategory.slug}`}
                            className={styles.subCardLink}
                          >
                            <span>Shop now</span>
                            <ArrowForwardRoundedIcon fontSize="inherit" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </PageContainer>
    </section>
  );
}