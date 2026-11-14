import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { PageNavigation } from "@/components/common/page-navigation";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/site-header";
import categoriesData from "@/data/categories.json";
import {
  getCatalogCategories,
  resolveCatalogCategorySlug,
} from "@/lib/catalog/migrated-catalog";
import { getAllProducts } from "@/lib/products-db";
import styles from "./page.module.css";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  const dynamicSlugs = categoriesData.map((c: any) => ({ categorySlug: c.slug }));
  const catalogSlugs = getCatalogCategories().map(({ slug }) => ({ categorySlug: slug }));
  const allSlugs = new Set([...dynamicSlugs.map((s) => s.categorySlug), ...catalogSlugs.map((s) => s.categorySlug)]);
  return Array.from(allSlugs).map((slug) => ({ categorySlug: slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const jsonCategory = categoriesData.find((c: any) => c.slug === categorySlug);
  if (jsonCategory) {
    return {
      title: jsonCategory.seo?.title || `${jsonCategory.title} | IyalMooligai JOHOVO`,
      description: jsonCategory.seo?.description || jsonCategory.description,
      keywords: jsonCategory.seo?.keywords,
    };
  }

  const catalogCat = getCatalogCategories().find(
    ({ slug }) => slug === categorySlug,
  );
  return catalogCat
    ? {
        title: `${catalogCat.name} | JOHOVO Authentic Botanical Collection`,
        description: `Browse authentic products in the ${catalogCat.name} category.`,
      }
    : { title: "Category not found | JOHOVO" };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const resolvedCategorySlug = resolveCatalogCategorySlug(categorySlug) ?? categorySlug;

  const jsonCategory = categoriesData.find((c: any) => c.slug === categorySlug);
  const catalogCat = getCatalogCategories().find(
    ({ slug }) => slug === resolvedCategorySlug,
  );

  if (!jsonCategory && !catalogCat) {
    notFound();
  }

  const categoryTitle = jsonCategory ? jsonCategory.title : catalogCat!.name;
  const categoryDesc = jsonCategory
    ? jsonCategory.introCopy || jsonCategory.description
    : `Browse authentic products in the ${catalogCat!.name} collection.`;

  // Find products matching the category slug or its sub-ranges
  const subSlugs = (jsonCategory?.subRanges?.map((s: any) => resolveCatalogCategorySlug(s.slug)).filter(Boolean) as string[]) || [];
  const relevantSlugs = [resolvedCategorySlug, ...subSlugs];

  const allDbProducts = await getAllProducts();
  const products = allDbProducts.filter((product) =>
    product.categorySlugs.some((s) => relevantSlugs.includes(s) || (categorySlug === "herbal-products" && product.brand === "iyalmooligai")),
  );

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <PageNavigation
            backHref="/categories"
            backLabel="Back to Categories"
            items={[
              { label: "Home", href: "/" },
              { label: "Categories", href: "/categories" },
              { label: jsonCategory?.shortTitle || categoryTitle, current: true },
            ]}
          />

          <header className={styles.heading}>
            <div className={styles.categoryBadgeRow}>
              <span className={styles.categoryBadge}>100% PURE &amp; AUTHENTIC</span>
              {jsonCategory?.badge && (
                <span className={styles.categoryBadgeAlt}>{jsonCategory.badge}</span>
              )}
            </div>
            <h1 className={styles.categoryTitle}>{categoryTitle}</h1>
            <p className={styles.categoryDescription}>{categoryDesc}</p>
          </header>

          {/* Sub-ranges Highlight If Available */}
          {jsonCategory?.subRanges && jsonCategory.subRanges.length > 0 && (
            <section className={styles.subRangesSection} aria-label="Available ranges">
              <h2 className={styles.subRangesTitle}>Featured Formulations &amp; Ranges</h2>
              <div className={styles.subRangesGrid}>
                {jsonCategory.subRanges.map((sub: any, idx: number) => (
                  <div key={sub.id || idx} className={styles.subRangeCard}>
                    <div className={styles.subCardTop}>
                      <span className={styles.subIndex}>0{idx + 1}</span>
                      <div>
                        <h3 className={styles.subName}>{sub.name}</h3>
                        <p className={styles.subTagline}>{sub.tagline}</p>
                      </div>
                    </div>

                    {sub.qualitySourcing && (
                      <div className={styles.subInfoRow}>
                        <strong className={styles.subInfoLabel}>Quality Sourcing:</strong>
                        <p>{sub.qualitySourcing}</p>
                      </div>
                    )}

                    {sub.benefits && (
                      <div className={styles.subInfoRow}>
                        <strong className={styles.subInfoLabel}>Benefits:</strong>
                        <p>{sub.benefits}</p>
                      </div>
                    )}

                    {sub.howToUse && (
                      <div className={styles.subInfoRow}>
                        <strong className={styles.subInfoLabel}>How to Use:</strong>
                        <p>{sub.howToUse}</p>
                      </div>
                    )}

                    {sub.salesHook && (
                      <div className={styles.salesHook}>
                        <span>✨</span> {sub.salesHook}
                      </div>
                    )}

                    {sub.items && sub.items.length > 0 && (
                      <div className={styles.itemsWrap}>
                        <span className={styles.itemsTitle}>Key Items:</span>
                        <div className={styles.itemTags}>
                          {sub.items.map((it: string, iIdx: number) => (
                            <span key={iIdx} className={styles.itemTag}>
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.catalogProductsSection} aria-label="Products">
            <Link
              href={`/products?category=${resolvedCategorySlug}`}
              className={styles.showProductsButton}
            >
              Show Products
            </Link>
          </section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}