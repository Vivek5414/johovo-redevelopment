import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductCatalogBrowser } from "@/components/product/product-catalog-browser";
import { SiteHeader } from "@/components/site-header";
import {
  catalogProducts,
  getCatalogCategories,
} from "@/lib/catalog/migrated-catalog";
import styles from "./page.module.css";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getCatalogCategories().map(({ slug }) => ({ categorySlug: slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCatalogCategories().find(
    ({ slug }) => slug === categorySlug,
  );
  return category
    ? {
        title: category.name,
        description: `Browse JOHOVO products in the source-listed ${category.name} category.`,
      }
    : { title: "Category not found" };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const category = getCatalogCategories().find(
    ({ slug }) => slug === categorySlug,
  );
  if (!category) notFound();

  const products = catalogProducts.filter((product) =>
    product.categorySlugs.includes(category.slug),
  );

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <PageContainer>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/products">Products</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{category.name}</span>
          </nav>
          <header className={styles.heading}>
            <p className={styles.eyebrow}>Source-listed category</p>
            <h1>{category.name}</h1>
            <p>
              Product names and details are shown as captured from the JOHOVO
              source catalogue.
            </p>
          </header>
          <ProductCatalogBrowser
            categories={getCatalogCategories(products)}
            initialCategorySlug={category.slug}
            products={products}
          />
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
