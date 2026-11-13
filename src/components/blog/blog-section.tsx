import React from "react";
import Image from "next/image";
import Link from "next/link";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { type BlogPost } from "@/lib/blogs";
import styles from "./blog-section.module.css";

type BlogSectionProps = {
  posts: BlogPost[];
  title?: string;
  eyebrow?: string;
  description?: string;
  showViewAll?: boolean;
};

export function BlogSection({
  posts,
  title = "Botanical Wisdom & Rituals",
  eyebrow = "The JOHOVO Journal",
  description = "Explore time-honored Ayurvedic wisdom, scalp care science, and natural beauty insights curated by our herbalists.",
  showViewAll = true,
}: BlogSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className={styles.blogSection} id="blog">
      <div aria-hidden="true" className={styles.ambientGlow} />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrowBadge}>
            <AutoStoriesRoundedIcon className={styles.eyebrowIcon} />
            <span>{eyebrow}</span>
          </div>
          <h2 className={styles.title}>
            {title.includes("&") ? (
              <>
                {title.split("&")[0]} &amp;{" "}
                <span className={styles.gradientAccent}>{title.split("&")[1]}</span>
              </>
            ) : (
              title
            )}
          </h2>
          <p className={styles.description}>{description}</p>
        </div>

        {/* Blog Posts Grid */}
        <div className={styles.blogGrid}>
          {posts.map((post) => {
            const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <Link className={styles.card} href={`/blog/${post.slug}`} key={post.id}>
                <div className={styles.imageFrame}>
                  <Image
                    alt={post.title}
                    className={styles.coverImage}
                    fill
                    sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 380px"
                    src={post.coverImage}
                  />
                  <span className={styles.categoryTag}>{post.category}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                      <CalendarTodayRoundedIcon className={styles.metaIcon} />
                      <span>{formattedDate}</span>
                    </span>
                    <span className={styles.metaItem}>
                      <AccessTimeRoundedIcon className={styles.metaIcon} />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>

                  <div className={styles.cardFooter}>
                    <div className={styles.authorBlock}>
                      <Image
                        alt={post.author.name}
                        className={styles.authorAvatar}
                        height={28}
                        src={post.author.avatar}
                        width={28}
                      />
                      <span className={styles.authorName}>{post.author.name}</span>
                    </div>

                    <span className={styles.readMoreLink}>
                      Read Article
                      <ArrowForwardRoundedIcon className={styles.arrowIcon} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Optional View All Button */}
        {showViewAll && (
          <div className={styles.viewAllWrap}>
            <Link className={styles.viewAllBtn} href="/blog">
              <span>View All Journal Articles</span>
              <ArrowForwardRoundedIcon fontSize="small" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
