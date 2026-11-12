"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import testimonialsData from "@/data/testimonials.json";
import { ContentSection } from "@/components/layout/content-section";
import { PageContainer } from "@/components/layout/page-container";
import Link from "next/link";
import styles from "./testimonials.module.css";

export type TestimonialItem = {
  id: string;
  name: string;
  location?: string;
  rating: number;
  quote: string;
  product?: string;
  productSlug?: string;
  productImage?: string;
  date?: string;
  verified?: boolean;
};

export function TestimonialsSection() {
  const reviews = testimonialsData as TestimonialItem[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Default to 1 for SSR/mobile safety, then calibrate on mount
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function updateVisibleCount() {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    }
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const totalSlides = reviews.length;
  const maxIndex = Math.max(0, totalSlides - visibleCount);

  // Keep currentIndex clamped if visibleCount changes
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(0, totalSlides - visibleCount)));
  }, [visibleCount, totalSlides]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoscroll timer
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, maxIndex, nextSlide]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    setTouchStart(null);
  };

  if (!reviews.length) return null;

  return (
    <ContentSection className={styles.reviews} id="reviews">
      <PageContainer>
        {/* Section Header with Eyebrow, Title and All Reviews Link */}
        <div className={styles.sectionHeading}>
          <div className={styles.headingCopy}>
            <p className={styles.eyebrow}>CUSTOMER STORIES & REVIEWS</p>
            <h2 className={styles.headingTitle}>Real Experiences. Honest Reviews.</h2>
            <p className={styles.sectionDescription}>
              See how our natural Ayurvedic & herbal formulations bring gentle, radiant transformation to everyday self-care.
            </p>
          </div>

          <div className={styles.headerActions}>
            <Link className={styles.viewAllBtn} href="/testimonial">
              <span>View All ({reviews.length}) Reviews</span>
              <ArrowForwardRoundedIcon className={styles.viewAllIcon} />
            </Link>

            {/* Slider Controls */}
            <div className={styles.sliderControls}>
              <button
                aria-label="Previous reviews"
                className={styles.controlBtn}
                onClick={prevSlide}
                type="button"
              >
                <ArrowBackIosNewRoundedIcon className={styles.controlIcon} />
              </button>
              <button
                aria-label={isPaused ? "Play auto scroll" : "Pause auto scroll"}
                className={styles.controlBtn}
                onClick={() => setIsPaused((p) => !p)}
                type="button"
              >
                {isPaused ? (
                  <PlayArrowRoundedIcon className={styles.controlIcon} />
                ) : (
                  <PauseRoundedIcon className={styles.controlIcon} />
                )}
              </button>
              <button
                aria-label="Next reviews"
                className={styles.controlBtn}
                onClick={nextSlide}
                type="button"
              >
                <ArrowForwardIosRoundedIcon className={styles.controlIcon} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          aria-label="Customer testimonials 3-card auto-scrolling carousel"
          aria-roledescription="carousel"
          className={styles.carouselContainer}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
        >
          <div
            className={styles.carouselTrack}
            ref={trackRef}
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            }}
          >
            {reviews.map((review) => (
              <div
                aria-roledescription="slide"
                className={styles.carouselSlide}
                key={review.id}
                style={{
                  width: `${100 / visibleCount}%`,
                  flex: `0 0 ${100 / visibleCount}%`,
                }}
              >
                <article className={styles.reviewCard}>
                  {/* Decorative quote badge */}
                  <div className={styles.cardHeader}>
                    <div className={styles.quoteBadge}>
                      <FormatQuoteRoundedIcon className={styles.quoteIcon} />
                    </div>
                    {/* Star Rating */}
                    <div
                      aria-label={`${review.rating} out of 5 stars`}
                      className={styles.starRow}
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

                  {/* Customer Quote */}
                  <blockquote className={styles.quoteText}>
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>

                  {/* Customer Info */}
                  <div className={styles.authorMeta}>
                    <div className={styles.avatar}>
                      {review.name.charAt(0)}
                    </div>
                    <div className={styles.authorDetails}>
                      <div className={styles.authorNameRow}>
                        <strong className={styles.authorName}>{review.name}</strong>
                        {review.verified !== false ? (
                          <span className={styles.verifiedBadge} title="Verified Purchase">
                            <VerifiedRoundedIcon className={styles.verifiedIcon} />
                            <span>Verified</span>
                          </span>
                        ) : null}
                      </div>
                      {review.location ? (
                        <span className={styles.authorLocation}>{review.location}</span>
                      ) : null}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className={styles.carouselPagination}>
          {Array.from({ length: maxIndex + 1 }, (_, dotIndex) => (
            <button
              aria-label={`Go to slide ${dotIndex + 1}`}
              className={`${styles.paginationDot} ${
                currentIndex === dotIndex ? styles.paginationDotActive : ""
              }`}
              key={`dot-${dotIndex}`}
              onClick={() => setCurrentIndex(dotIndex)}
              type="button"
            />
          ))}
        </div>
      </PageContainer>
    </ContentSection>
  );
}
