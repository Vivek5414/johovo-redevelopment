import Image from "next/image";
import Link from "next/link";
import styles from "./hero.module.css";
import HeroBg from "/public/images/hero/hero.png";
import GirlImage from "/public/images/hero/girl.png";

export function HeroSection() {
  return (
    <header aria-label="IyalMooligai hero section" className={styles.heroSection}>
      {/* Background layer */}
      <div className={styles.heroBackground} aria-hidden="true">
        <Image
          alt=""
          className={styles.heroBgImage}
          fill
          priority
          sizes="100vw"
          src={HeroBg}
        />
      </div>

      <div className={styles.heroContainer}>
        {/* Left Section (Content & CTAs & Benefits) */}
        <div className={styles.heroContent}>
          {/* Brand Logo */}
          <div className={styles.brandLogoWrapper}>
            <Image
              alt="IyalMooligai logo"
              className={styles.brandLogo}
              src="/images/brand/logo2.png"
              width={260}
              height={140}
              priority
            />
          </div>

          {/* Eyebrow */}
          <div className={styles.eyebrow}>
            <span>NATURALLY RADIANT</span>
            <svg
              className={styles.eyebrowIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
            </svg>
            <span>LIVING</span>
          </div>

          {/* Headline */}
          <h1 className={styles.headline}>
            Nurture Your
            <span className={styles.headlineHighlight}>Skin Naturally</span>
          </h1>

          {/* Description */}
          <p className={styles.description}>
            Gentle, herbal and effective care for everyday glow. Discover skincare,
            haircare and bodycare made with nature&apos;s trusted ingredients.
          </p>

          {/* CTA Buttons */}
          <div className={styles.ctaRow}>
            <Link href="/products" className={styles.primaryCta}>
              <svg
                className={styles.ctaIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              <span>Shop Collection</span>
              <svg
                className={styles.arrowIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <Link href="/categories" className={styles.secondaryCta}>
              <svg
                className={styles.ctaIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
              <span>Explore Categories</span>
            </Link>
          </div>

          {/* Benefits */}
          <div className={styles.benefitsRow}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <span className={styles.benefitLabel}>Natural Ingredients</span>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 2v7.31L4.67 19.3A2 2 0 0 0 6.4 22h11.2a2 2 0 0 0 1.73-2.7L14 9.31V2" />
                  <line x1="8.5" y1="2" x2="15.5" y2="2" />
                  <line x1="7" y1="16" x2="17" y2="16" />
                </svg>
              </div>
              <span className={styles.benefitLabel}>No Harmful Chemicals</span>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <span className={styles.benefitLabel}>Skin Friendly Formulation</span>
            </div>
          </div>
        </div>

        {/* Right Section (Prominent Girl Image) */}
        <div className={styles.heroVisual}>
          <div className={styles.girlWrapper}>
            <Image
              alt="IyalMooligai herbal skincare showcase"
              className={styles.girlImage}
              src={GirlImage}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 650px"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
