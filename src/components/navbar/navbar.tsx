"use client";

import Image from "next/image";
import Link from "next/link";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import navbarData from "./navbar-data.json";
import styles from "./navbar.module.css";

export type SearchProduct = {
  name: string;
  slug: string;
  categories: string[];
  href?: string;
};

export type NavbarProps = {
  products?: SearchProduct[];
};

export function Navbar({ products = [] }: NavbarProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { brand, navLinks, contact } = navbarData;

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

  // Close mobile drawer on Escape key
  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  };

  const handleLinkClick = (href: string, event: React.MouseEvent) => {
    setMenuOpen(false);
    if (href === "/" && pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand Logo from JSON */}
        <Link
          aria-label={`${brand.name} - ${brand.tagline}`}
          className={styles.brand}
          href={brand.homeUrl}
          onClick={(e) => handleLinkClick("/", e)}
        >
          <Image
            alt={brand.logo.alt}
            className={styles.logoImage}
            height={brand.logo.height}
            priority
            sizes="(max-width: 480px) 130px, 160px"
            src={brand.logo.src}
            unoptimized
            width={brand.logo.width}
          />
        </Link>

        {/* Desktop / Laptop Navigation links from JSON */}
        <nav aria-label="Main navigation" className={styles.nav}>
          {navLinks.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                href={item.href}
                key={item.label}
                onClick={(e) => handleLinkClick(item.href, e)}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Tools (Product Search, Quick Phone Pill, Hamburger Menu) */}
        <div className={styles.tools}>
          {/* Product Search Form */}
          <form action="/products" className={styles.searchForm} role="search">
            <input
              autoComplete="off"
              className={styles.searchInput}
              name="search"
              onChange={(e) => setQuery(e.currentTarget.value)}
              placeholder="Search products..."
              type="search"
              value={query}
            />
            <button
              aria-label="Submit search"
              className={styles.searchButton}
              type="submit"
            >
              <SearchRoundedIcon className={styles.searchIcon} />
            </button>

            {/* Search Suggestions dropdown */}
            {matches.length > 0 ? (
              <ul aria-label="Search suggestions" className={styles.suggestions}>
                {matches.map((product) => (
                  <li className={styles.suggestionItem} key={product.slug}>
                    <Link
                      href={product.href ?? `/products/${product.slug}`}
                      onClick={() => setQuery("")}
                    >
                      <span className={styles.suggestionName}>{product.name}</span>
                      {product.categories.length > 0 ? (
                        <span className={styles.suggestionCategories}>
                          {product.categories.join(", ")}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
                <li className={styles.allResults}>
                  <button type="submit">See all matching products →</button>
                </li>
              </ul>
            ) : normalizedQuery ? (
              <p className={styles.noSuggestions}>No matching products found.</p>
            ) : null}
          </form>


          {/* Mobile Hamburger Button */}
          <button
            aria-controls="mobile-navigation-drawer"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className={styles.menuButton}
            onClick={() => setMenuOpen((open) => !open)}
            ref={menuButtonRef}
            type="button"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        aria-hidden="true"
        className={styles.mobileDrawerOverlay}
        data-open={menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <div
        aria-label="Mobile navigation"
        className={styles.mobileDrawer}
        data-open={menuOpen}
        id="mobile-navigation-drawer"
      >
        <nav className={styles.mobileNavLinks}>
          {navLinks.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`${styles.mobileNavLink} ${active ? styles.mobileNavLinkActive : ""}`}
                href={item.href}
                key={item.label}
                onClick={(e) => handleLinkClick(item.href, e)}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Contact Quick Actions */}
        <div className={styles.mobileContactSection}>
          <p className={styles.mobileContactTitle}>Direct Support</p>
          <a
            className={`${styles.mobileContactButton} ${styles.mobileWhatsappBtn}`}
            href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.defaultWhatsAppMessage)}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <WhatsAppIcon style={{ width: "18px", height: "18px" }} />
            <span>WhatsApp Us</span>
          </a>
          <a
            className={`${styles.mobileContactButton} ${styles.mobileCallBtn}`}
            href={`tel:${contact.phone}`}
          >
            <PhoneRoundedIcon style={{ width: "18px", height: "18px" }} />
            <span>Call {contact.displayPhone}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
