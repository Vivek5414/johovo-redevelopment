import Image from "next/image";
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
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
            <AutoFixHighRoundedIcon className={styles.eyebrowIcon} />
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
              <ShoppingBagRoundedIcon className={styles.ctaIcon} />
              <span>Shop Collection</span>
              <ArrowForwardRoundedIcon className={styles.arrowIcon} />
            </Link>
          </div>

          {/* Benefits */}
          <div className={styles.benefitsRow}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <SpaRoundedIcon />
              </div>
              <span className={styles.benefitLabel}>Natural Ingredients</span>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <ShieldRoundedIcon />
              </div>
              <span className={styles.benefitLabel}>No Harmful Chemicals</span>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIconBox}>
                <FavoriteRoundedIcon />
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
