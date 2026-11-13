import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageContainer } from "@/components/layout/page-container";
import { PageNavigation } from "@/components/common/page-navigation";
import { BlogSection } from "@/components/blog";
import { getAllBlogs, getBlogBySlug } from "@/lib/blogs";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import styles from "./blog-detail.module.css";

type Props = {
  params: Promise<{ blogSlug: string }>;
};

export async function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({
    blogSlug: blog.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { blogSlug } = await params;
  const blog = getBlogBySlug(blogSlug);

  if (!blog) {
    return {
      title: "Article Not Found | JOHOVO",
    };
  }

  return {
    title: `${blog.title} | JOHOVO Journal`,
    description: blog.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { blogSlug } = await params;
  const blog = getBlogBySlug(blogSlug);

  if (!blog) {
    notFound();
  }

  const allBlogs = getAllBlogs();
  const relatedPosts = allBlogs.filter((item) => item.slug !== blog.slug).slice(0, 3);

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        {/* Navigation Breadcrumb */}
        <div className={styles.navigationBar}>
          <PageContainer>
            <PageNavigation
              backHref="/blog"
              backLabel="Back to Journal"
              items={[
                { label: "Home", href: "/" },
                { label: "Journal", href: "/blog" },
                { label: blog.title, current: true },
              ]}
            />
          </PageContainer>
        </div>

        {/* Article Header */}
        <header className={styles.articleHeader}>
          <PageContainer>
            <div className={styles.headerContainer}>
              <span className={styles.categoryBadge}>
                <SpaRoundedIcon style={{ fontSize: "0.95rem", color: "var(--color-herbal-natural)" }} />
                <span>{blog.category}</span>
              </span>

              <h1 className={styles.articleTitle}>{blog.title}</h1>
              <p className={styles.articleExcerpt}>{blog.excerpt}</p>

              <div className={styles.metaInfoRow}>
                <div className={styles.authorWrapper}>
                  <Image
                    alt={blog.author.name}
                    className={styles.authorImg}
                    height={44}
                    src={blog.author.avatar}
                    width={44}
                  />
                  <div className={styles.authorMeta}>
                    <span className={styles.authorName}>{blog.author.name}</span>
                    <span className={styles.authorRole}>{blog.author.role}</span>
                  </div>
                </div>

                <div className={styles.readingDetails}>
                  <span className={styles.metaItem}>
                    <CalendarTodayRoundedIcon className={styles.metaIcon} />
                    <span>{formattedDate}</span>
                  </span>
                  <span className={styles.metaItem}>
                    <AccessTimeRoundedIcon className={styles.metaIcon} />
                    <span>{blog.readTime}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className={styles.coverWrapper}>
              <div className={styles.coverFrame}>
                <Image
                  alt={blog.title}
                  className={styles.coverImage}
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 960px"
                  src={blog.coverImage}
                />
              </div>
            </div>
          </PageContainer>
        </header>

        {/* Article Body Content */}
        <article className={styles.articleLayout}>
          <PageContainer>
            <div className={styles.articleBody}>
              {blog.content.map((block, idx) => {
                if (block.type === "paragraph") {
                  return <p key={idx}>{block.text}</p>;
                }
                if (block.type === "heading") {
                  return (
                    <h2 className={styles.sectionHeading} key={idx}>
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <div className={styles.blockquoteCard} key={idx}>
                      <p>{block.text}</p>
                    </div>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul className={styles.articleList} key={idx}>
                      {block.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return null;
              })}

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className={styles.tagsRow}>
                  <span className={styles.tagLabel}>Topics:</span>
                  {blog.tags.map((tag, tagIdx) => (
                    <span className={styles.tagPill} key={tagIdx}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Related Product Spotlight */}
              {blog.relatedProductSlug && (
                <div className={styles.productSpotlight}>
                  <div className={styles.productSpotlightContent}>
                    <p className={styles.spotlightEyebrow}>RECOMMENDED BOTANICAL CARE</p>
                    <h3 className={styles.spotlightTitle}>Experience the Formulation</h3>
                    <p className={styles.spotlightDesc}>
                      Crafted with handpicked herbs following the traditional formulation principles explored in this article.
                    </p>
                  </div>
                  <Link
                    className={styles.spotlightAction}
                    href={`/products/${blog.relatedProductSlug}`}
                  >
                    <span>View Product Details</span>
                    <ArrowForwardRoundedIcon fontSize="small" />
                  </Link>
                </div>
              )}
            </div>
          </PageContainer>
        </article>

        {/* Related Articles Carousel / Section */}
        {relatedPosts.length > 0 && (
          <BlogSection
            description="Explore more botanical wisdom and natural beauty guides from our journal."
            eyebrow="MORE FROM THE JOURNAL"
            posts={relatedPosts}
            showViewAll={true}
            title="Related Journal Stories"
          />
        )}
      </main>
      <SiteFooter />
    </>
  );
}
