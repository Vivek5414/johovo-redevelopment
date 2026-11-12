"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import categoriesData from "@/data/categories.json";
import { PageContainer } from "@/components/layout/page-container";
import styles from "./category-section.module.css";

export type CategoryItem = {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  href: string;
  image: string;
  tag?: string;
  description?: string;
};

export function CategorySection() {
  const categories = categoriesData as CategoryItem[];
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!railRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!railRef.current) return;
    const scrollAmount = railRef.current.clientWidth * 0.75;
    railRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section
      aria-label="Popular herbal skincare & haircare categories"
      className={styles.categorySection}
    >
      <PageContainer>
        <div className={styles.categorySectionWrapper}>
          {/* Redesigned Premium Herbal Header Bar */}
          <div className={styles.sectionHeader}>
            <div className={styles.headerTextGroup}>
              <div className={styles.eyebrowBadge}>
                <span className={styles.eyebrowDot} />
                <span className={styles.eyebrow}>DISCOVER BY CATEGORY</span>
              </div>
              <h2 className={styles.title}>
                Top Ayurvedic <span className={styles.titleAccent}>&amp; Herbal Picks</span>
              </h2>
            </div>
            <Link className={styles.viewAllLink} href="/products">
              <span>View All Products</span>
              <span className={styles.viewAllIconWrapper}>
                <ArrowForwardRoundedIcon className={styles.viewAllIcon} />
              </span>
            </Link>
          </div>

          {/* Flipkart-style Horizontal Category Strip */}
          <div className={styles.scrollContainer}>
            {canScrollLeft ? (
              <button
                aria-label="Scroll categories left"
                className={`${styles.scrollBtn} ${styles.scrollBtnPrev}`}
                onClick={() => scroll("left")}
                type="button"
              >
                <ArrowBackIosNewRoundedIcon className={styles.scrollIcon} />
              </button>
            ) : null}

            <div className={styles.categoryRail} ref={railRef}>
              {categories.map((category) => (
                <Link
                  className={styles.categoryItem}
                  href={category.href}
                  key={category.id}
                >
                  <div className={styles.imageWrapper}>
                    {category.tag ? (
                      <span className={styles.tagBadge}>{category.tag}</span>
                    ) : null}
                    <Image
                      alt={category.title}
                      className={styles.categoryImg}
                      fill
                      sizes="88px"
                      src={category.image}
                    />
                  </div>
                  <div className={styles.categoryLabel}>
                    <span className={styles.categoryTitle}>{category.title}</span>
                    {category.subtitle ? (
                      <span className={styles.categorySubtitle}>
                        {category.subtitle}
                      </span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>

            {canScrollRight ? (
              <button
                aria-label="Scroll categories right"
                className={`${styles.scrollBtn} ${styles.scrollBtnNext}`}
                onClick={() => scroll("right")}
                type="button"
              >
                <ArrowForwardIosRoundedIcon className={styles.scrollIcon} />
              </button>
            ) : null}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
