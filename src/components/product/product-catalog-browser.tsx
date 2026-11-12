"use client";

import { useMemo, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const sortOptions = [
    { value: "source", label: "Recommended" },
    { value: "price-ascending", label: "Price: Low to High" },
    { value: "price-descending", label: "Price: High to Low" },
  ];

  return (
    <div className={styles.browser}>
      <div className={styles.topBar}>
        <label className={styles.searchLabel} htmlFor="product-search">
          <span className={styles.searchLabelText}>Search products</span>
          <span className={styles.searchFieldWrap}>
            <SearchRoundedIcon className={styles.searchIcon} fontSize="small" />
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
          </span>
        </label>

        <div className={styles.toolbarMeta}>
          <p aria-live="polite" className={styles.resultCount} role="status">
            {visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"}
            {selectedCategory
              ? ` in ${availableCategories.find(({ slug }) => slug === selectedCategory)?.name ?? ""}`
              : ""}
          </p>
        </div>

        <button
          aria-label="Open filters"
          className={styles.mobileFilterButton}
          onClick={() => setShowMobileFilters(true)}
          type="button"
        >
          <FilterListRoundedIcon fontSize="small" />
          Filters
        </button>
      </div>

      {showMobileFilters ? (
        <button
          aria-label="Close filters"
          className={styles.mobileFilterBackdrop}
          onClick={() => setShowMobileFilters(false)}
          type="button"
        />
      ) : null}

      <div className={styles.catalogLayout}>
        <aside className={`${styles.filterSidebar} ${showMobileFilters ? styles.filterSidebarOpen : ""}`}>
          <div className={styles.sidebarBox}>
            <div className={styles.mobileFilterHeader}>
              <h2>Filters</h2>
              <button
                aria-label="Close filters"
                className={styles.closeFilterButton}
                onClick={() => setShowMobileFilters(false)}
                type="button"
              >
                <CloseRoundedIcon fontSize="small" />
              </button>
            </div>
            <h2 className={styles.mobileSortTitle}>Sort by</h2>
            <div className={styles.sortOptions} role="radiogroup" aria-label="Sort products by">
              {sortOptions.map((option) => (
                <button
                  aria-pressed={sortOrder === option.value}
                  className={`${styles.sortOption} ${sortOrder === option.value ? styles.sortSelected : ""}`}
                  key={option.value}
                  onClick={() => setSortOrder(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sidebarBox}>
            <h2>Categories</h2>
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
                    setShowMobileFilters(false);
                  }}
                  type="button"
                >
                  {category.name} <span>{category.productCount}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className={styles.mainCatalogContent}>
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
      </div>
    </div>
  );
}
