"use client";

import { useMemo, useState } from "react";
import type {
  CatalogCategory,
  CatalogProduct,
} from "@/lib/catalog/migrated-catalog";
import { ProductCard } from "./product-card";
import styles from "./product-catalog-browser.module.css";

type ProductCatalogBrowserProps = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  initialSearch?: string;
  initialCategorySlug?: string;
};

export function ProductCatalogBrowser({
  products,
  categories,
  initialSearch = "",
  initialCategorySlug,
}: ProductCatalogBrowserProps) {
  const availableCategories = categories.filter(
    ({ productCount }) => productCount > 0,
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategorySlug ?? null,
  );
  const [search, setSearch] = useState(initialSearch);
  const [sortOrder, setSortOrder] = useState("source");
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory = !selectedCategory ||
        product.categorySlugs.includes(selectedCategory);
      const searchableText = [product.name, product.sku, ...product.categories.map(({ name }) => name), product.shortDescription]
        .filter(Boolean).join(" ").toLocaleLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });

    if (sortOrder === "price-ascending" || sortOrder === "price-descending") {
      const direction = sortOrder === "price-ascending" ? 1 : -1;
      return [...filtered].sort((left, right) => {
        if (left.sellingPrice === null) return right.sellingPrice === null ? 0 : 1;
        if (right.sellingPrice === null) return -1;
        return (left.sellingPrice - right.sellingPrice) * direction;
      });
    }

    return filtered;
  }, [products, search, selectedCategory, sortOrder]);

  return (
    <div className={styles.browser}>
      <label className={styles.searchLabel} htmlFor="product-search">
        Search products
        <input
          autoComplete="off"
          className={styles.searchInput}
          id="product-search"
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setVisibleCount(6);
          }}
          placeholder="Search by product, SKU, or category"
          type="search"
          value={search}
        />
      </label>

      <nav aria-label="Product categories" className={styles.categoryNavigation}>
        <button
          aria-pressed={selectedCategory === null}
          className={`${styles.categoryButton} ${selectedCategory === null ? styles.selected : ""}`}
          onClick={() => setSelectedCategory(null)}
          type="button"
        >
          All Products <span>{products.length}</span>
        </button>
        {availableCategories.map((category) => (
          <button
            aria-pressed={selectedCategory === category.slug}
            className={`${styles.categoryButton} ${category.parentId !== 0 ? styles.childCategory : ""} ${selectedCategory === category.slug ? styles.selected : ""}`}
            key={category.id}
            onClick={() => {
              setSelectedCategory(
                selectedCategory === category.slug ? null : category.slug,
              );
              setVisibleCount(6);
            }}
            type="button"
          >
            {category.name} <span>{category.productCount}</span>
          </button>
        ))}
      </nav>

      <p aria-live="polite" className={styles.resultCount} role="status">
        {visibleProducts.length}{" "}
        {visibleProducts.length === 1 ? "product" : "products"}
        {selectedCategory
          ? ` in ${availableCategories.find(({ slug }) => slug === selectedCategory)?.name ?? ""}`
          : ""}
      </p>

      <label className={styles.sortLabel} htmlFor="product-sort">
        Sort by
        <select
          id="product-sort"
          onChange={(event) => setSortOrder(event.currentTarget.value)}
          value={sortOrder}
        >
          <option value="source">Source order</option>
          <option value="price-ascending">Price: low to high</option>
          <option value="price-descending">Price: high to low</option>
        </select>
      </label>

      {visibleProducts.length ? (
        <div className={styles.productGrid}>
          {visibleProducts.slice(0, visibleCount).map((product, index) => (
            <ProductCard
              imageLoading={index < 2 ? "eager" : "lazy"}
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <p className={styles.emptyState}>
          No products match the selected category and search.
        </p>
      )}
      {visibleProducts.length > visibleCount ? (
        <button
          className={styles.loadMore}
          onClick={() => setVisibleCount((count) => count + 6)}
          type="button"
        >
          Show more products
        </button>
      ) : null}
    </div>
  );
}
