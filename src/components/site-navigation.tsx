"use client";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./site-header.module.css";

type SearchProduct = {
  name: string;
  slug: string;
  categories: string[];
};

const links = [
  { href: "/", label: "Home", matches: (path: string) => path === "/" },
  {
    href: "/about-us",
    label: "About",
    matches: (path: string) => path === "/about-us",
  },
  {
    href: "/#collections",
    label: "Collections",
    matches: (path: string) => path.startsWith("/categories/"),
  },
  {
    href: "/products",
    label: "All Products",
    matches: (path: string) => path.startsWith("/products"),
  },
  {
    href: "/blog",
    label: "Blog",
    matches: (path: string) => path.startsWith("/blog"),
  },
  {
    href: "/johovoinsta",
    label: "Instagram",
    matches: (path: string) => path.startsWith("/johovoinsta"),
  },
  {
    href: "/contact",
    label: "Contact",
    matches: (path: string) => path === "/contact",
  },
];

export function SiteNavigation({ products }: { products: SearchProduct[] }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matches = normalizedQuery
    ? products
        .filter((product) =>
          [product.name, ...product.categories]
            .join(" ")
            .toLocaleLowerCase()
            .includes(normalizedQuery),
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={styles.desktopNavigation}
        data-open={menuOpen}
        id="site-navigation"
      >
        {links.map(({ href, label, matches: isActive }) => (
          <Link
            aria-current={isActive(pathname) ? "page" : undefined}
            href={href}
            key={label}
            onClick={(event) => {
              setMenuOpen(false);
              if (label === "Home" && pathname === "/") {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className={styles.tools}>
        <form action="/products" className={styles.search} role="search">
          <label className={styles.visuallyHidden} htmlFor="header-product-search">
            Search products
          </label>
          <input
            autoComplete="off"
            id="header-product-search"
            name="search"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search products"
            type="search"
            value={query}
          />
          <button aria-label="Search products" type="submit">
            <SearchRoundedIcon />
          </button>
          {matches.length ? (
            <ul aria-label="Search suggestions" className={styles.suggestions}>
              {matches.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={() => setQuery("")}
                  >
                    <span>{product.name}</span>
                    {product.categories.length ? (
                      <small>{product.categories.join(", ")}</small>
                    ) : null}
                  </Link>
                </li>
              ))}
              <li className={styles.allResults}>
                <button type="submit">See all matching products</button>
              </li>
            </ul>
          ) : normalizedQuery ? (
            <p className={styles.noSuggestions}>No matching products found.</p>
          ) : null}
        </form>

        <button
          aria-controls="site-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className={styles.mobileMenu}
          onClick={() => setMenuOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
