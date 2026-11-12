import type { Metadata } from "next";
import Link from "next/link";
import StarIcon from "@mui/icons-material/Star";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import testimonialsData from "@/data/testimonials.json";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { TestimonialItem } from "@/components/testimonials/testimonials";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Customer Testimonials & Reviews | JOHOVO",
  description:
    "Read genuine reviews and authentic experiences from our community about JOHOVO herbal skincare, hair care and wellness products.",
};

export default function TestimonialPage() {
  const reviews = testimonialsData as TestimonialItem[];
  const totalReviews = reviews.length;
  const averageRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
  ).toFixed(1);

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        {/* Hero Header */}
        <header className={styles.header}>
          <PageContainer>
            <div className={styles.headerInner}>
              <p className={styles.eyebrow}>COMMUNITY LOVE & FEEDBACK</p>
              <h1 className={styles.title}>All Customer Reviews</h1>
              <p className={styles.subtitle}>
                Real stories and heartfelt testimonials from people who use and love our herbal & botanical formulations.
              </p>

              {/* Trust & Rating Summary Banner */}
              <div className={styles.ratingBanner}>
                <div className={styles.statBox}>
                  <div className={styles.statNumber}>
                    <span>{averageRating}</span>
                    <span className={styles.statMax}>/5.0</span>
                  </div>
                  <div className={styles.statStars}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon className={styles.starIcon} key={`overall-star-${i}`} />
                    ))}
                  </div>
                  <span className={styles.statLabel}>Average Customer Rating</span>
                </div>

                <div className={styles.statDivider} />

                <div className={styles.statBox}>
                  <div className={styles.statNumber}>{totalReviews}+</div>
                  <span className={styles.statLabel}>Verified User Testimonials</span>
                </div>

                <div className={styles.statDivider} />

                <div className={styles.statBox}>
                  <div className={styles.statNumber}>100%</div>
                  <span className={styles.statLabel}>Pure Natural Ingredients</span>
                </div>
              </div>
            </div>
          </PageContainer>
        </header>

        {/* Reviews Grid Section */}
        <section aria-label="Customer review cards" className={styles.gridSection}>
          <PageContainer>
            <div className={styles.reviewsGrid}>
              {reviews.map((review) => (
                <article className={styles.card} key={review.id}>
                  {/* Card Top */}
                  <div className={styles.cardTop}>
                    <div className={styles.quoteIconBox}>
                      <FormatQuoteRoundedIcon className={styles.quoteIcon} />
                    </div>
                    <div
                      aria-label={`${review.rating} out of 5 stars`}
                      className={styles.cardStars}
                    >
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <StarIcon
                          className={
                            starIndex < review.rating
                              ? styles.starFilled
                              : styles.starEmpty
                          }
                          key={`${review.id}-star-${starIndex}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote Body */}
                  <blockquote className={styles.quoteBody}>
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>

                  {/* Author Meta */}
                  <div className={styles.authorSection}>
                    <div className={styles.avatar}>
                      {review.name.charAt(0)}
                    </div>
                    <div className={styles.authorInfo}>
                      <div className={styles.authorRow}>
                        <strong className={styles.authorName}>{review.name}</strong>
                        {review.verified !== false ? (
                          <span className={styles.verifiedBadge}>
                            <VerifiedRoundedIcon className={styles.verifiedIcon} />
                            <span>Verified</span>
                          </span>
                        ) : null}
                      </div>
                      <div className={styles.authorSubRow}>
                        {review.location ? (
                          <span className={styles.location}>{review.location}</span>
                        ) : null}
                        {review.date ? (
                          <span className={styles.date}>• {review.date}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Bottom CTA to shop */}
            <div className={styles.bottomCtaBox}>
              <h3>Experience the Natural Transformation Yourself</h3>
              <p>Explore our full catalogue of authentic herbal beauty & self-care essentials.</p>
              <Link className={styles.ctaButton} href="/products">
                Shop Our Best-Sellers
              </Link>
            </div>
          </PageContainer>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
