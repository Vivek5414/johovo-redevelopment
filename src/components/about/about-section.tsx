import React from "react";
import Image from "next/image";
import Link from "next/link";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import NaturePeopleRoundedIcon from "@mui/icons-material/NaturePeopleRounded";
import RecyclingRoundedIcon from "@mui/icons-material/RecyclingRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import FaceRetouchingNaturalRoundedIcon from "@mui/icons-material/FaceRetouchingNaturalRounded";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import CleanHandsRoundedIcon from "@mui/icons-material/CleanHandsRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { JOHOVO_CONTACT } from "@/lib/contact";
import styles from "./about-section.module.css";

const corePillars = [
  {
    icon: SpaRoundedIcon,
    iconColor: "var(--color-herbal-forest)",
    bg: "rgba(32, 59, 51, 0.08)",
    title: "Herbal Purity & Safety",
    text: "Meticulously selected botanicals and clean Ayurvedic herbs blended without harsh sulfates, parabens, or heavy chemicals.",
  },
  {
    icon: NaturePeopleRoundedIcon,
    iconColor: "var(--color-brand-green)",
    bg: "rgba(23, 204, 27, 0.1)",
    title: "Promoting Natural Beauty",
    text: "We believe in working in deep harmony with your body's natural rhythms to nurture long-lasting radiance from within.",
  },
  {
    icon: RecyclingRoundedIcon,
    iconColor: "var(--color-brand-cyan)",
    bg: "rgba(4, 207, 224, 0.1)",
    title: "Conscious Sustainability",
    text: "Eco-conscious sourcing and minimal-impact formulations committed to preserving earth's herbal biodiversity.",
  },
  {
    icon: VolunteerActivismRoundedIcon,
    iconColor: "var(--color-brand-pink)",
    bg: "rgba(252, 40, 116, 0.1)",
    title: "Customer Devotion",
    text: "Honest customer relationships, transparent formulations, and handcrafted attention to every single parcel delivered.",
  },
];

const categorySpotlights = [
  {
    name: "Skin Care",
    icon: FaceRetouchingNaturalRoundedIcon,
    desc: "Rejuvenating face packs and daily botanicals that restore glow and suppleness.",
    href: "/categories/face-care",
  },
  {
    name: "Hair Care",
    icon: ContentCutRoundedIcon,
    desc: "Authentic IyalMooligai herbal oils that reduce hair fall and nourish roots.",
    href: "/categories/hair-care",
  },
  {
    name: "Body Care",
    icon: CleanHandsRoundedIcon,
    desc: "Silky rose washes, scrubs, and moisture-locking lotions for holistic body wellness.",
    href: "/categories/body-care",
  },
  {
    name: "Herbal Care",
    icon: AutoAwesomeRoundedIcon,
    desc: "Traditional Indian herbal recipes crafted for gentle, time-tested restorative care.",
    href: "/collections/herbal-care",
  },
];

export function AboutSection() {
  const whatsappUrl = `https://wa.me/${JOHOVO_CONTACT.whatsapp}?text=${encodeURIComponent(
    "Hello JOHOVO, I would like to know more about your herbal products and story."
  )}`;

  return (
    <section className={styles.aboutSection} id="about">
      {/* Background Ambient Glows */}
      <div aria-hidden="true" className={styles.ambientGlow} />
      <div aria-hidden="true" className={styles.ambientGlowSecondary} />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerBlock}>
          <div className={styles.eyebrowBadge}>
            <SpaRoundedIcon className={styles.leafIcon} />
            <span>Rooted in Nature, Crafted for Radiance</span>
          </div>
          <h2 className={styles.mainTitle}>
            Embrace the Pure Art of{" "}
            <span className={styles.gradientAccent}>Botanical Care</span>
          </h2>
          <p className={styles.leadDescription}>
            At JOHOVO, we harness the regenerative essence of traditional Indian botanicals to formulate clean, potent skincare, hair rituals, and body wellness.
          </p>
        </div>

        {/* Story & Visual Hero Grid */}
        <div className={styles.storyHeroGrid}>
          <div className={styles.storyContent}>
            <h3 className={styles.sectionSubhead}>Our Story &amp; Philosophy</h3>
            <p className={styles.storyParagraph}>
              JOHOVO was founded on a singular principle: harnessing the gentle, restorative potency of nature to create effective, gentle, and sustainable beauty rituals. What began as a reverence for traditional Ayurvedic botanicals evolved into our signature line of revitalizing face formulations, nutrient-dense hair oils, and skin-loving essentials.
            </p>
            <p className={styles.storyParagraph}>
              Each bottle and jar is developed without harmful additives, prioritizing pure plant extracts such as Bhringaraj, Amla, Neem, Ashwagandha, and pure botanical oils that honor your skin’s biological barrier.
            </p>

            <div className={styles.quoteCard}>
              <p className={styles.quoteText}>
                &ldquo;Our mission is to provide high-quality, herbal-based products that cater to your diverse beauty needs — inspiring healthy, glowing skin, luscious locks, and soft nourished lips and body.&rdquo;
              </p>
              <cite className={styles.quoteCite}>— The JOHOVO Founding Vision</cite>
            </div>
          </div>

          <div className={styles.visualWrapper}>
            <div className={styles.mainImageFrame}>
              <Image
                alt="JOHOVO botanical lifestyle and herbal formulation"
                className={styles.mainImage}
                fill
                priority={false}
                sizes="(max-width: 768px) 100vw, 500px"
                src="/images/reference-homepage-branded.png"
              />
            </div>

            {/* Floating Trust Badge */}
            <div className={styles.floatingStatCard}>
              <div className={styles.statIconWrap}>
                <VerifiedRoundedIcon fontSize="inherit" />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>100% Herbal</span>
                <span className={styles.statLabel}>Clean Botanicals &amp; Oils</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars / Values Grid */}
        <div className={styles.pillarsSection}>
          <div className={styles.pillarsHeading}>
            <h3>What Guides Every Formulation</h3>
            <p>Our commitment to authentic ingredients and your long-term wellness.</p>
          </div>

          <div className={styles.pillarsGrid}>
            {corePillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div className={styles.pillarCard} key={idx}>
                  <div
                    className={styles.pillarIconContainer}
                    style={{ background: pillar.bg, color: pillar.iconColor }}
                  >
                    <IconComp fontSize="inherit" />
                  </div>
                  <h4 className={styles.pillarTitle}>{pillar.title}</h4>
                  <p className={styles.pillarText}>{pillar.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Range Spotlight */}
        <div className={styles.categoriesShowcase}>
          <div className={styles.categoriesHeader}>
            <h3>Curated Rituals for Every Care Need</h3>
            <p>Explore thoughtfully crafted remedies designed for everyday rejuvenation.</p>
          </div>

          <div className={styles.categoriesGrid}>
            {categorySpotlights.map((cat, idx) => {
              const CatIcon = cat.icon;
              return (
                <Link className={styles.categoryMiniCard} href={cat.href} key={idx}>
                  <div className={styles.catIconRow}>
                    <div className={styles.catIcon}>
                      <CatIcon fontSize="inherit" />
                    </div>
                    <ArrowForwardRoundedIcon className={styles.arrowPill} />
                  </div>
                  <h4 className={styles.catName}>{cat.name}</h4>
                  <p className={styles.catDesc}>{cat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <div aria-hidden="true" className={styles.ctaDecorLeft} />
          <div aria-hidden="true" className={styles.ctaDecorRight} />

          <div className={styles.ctaContent}>
            <h3 className={styles.ctaHeading}>Ready to Transform Your Daily Ritual?</h3>
            <p className={styles.ctaText}>
              Discover our signature herbal oils, revitalizing face packs, and botanical remedies handcrafted to nurture you naturally.
            </p>
            <div className={styles.ctaActionGroup}>
              <Link className={styles.primaryBtn} href="/products">
                <span>Explore All Products</span>
                <ArrowForwardRoundedIcon fontSize="small" />
              </Link>
              <a
                className={styles.secondaryBtn}
                href={whatsappUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <WhatsAppIcon fontSize="small" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
