"use client";

import Link from "next/link";
import { DataTable, type ColumnDef } from "@/components/admin/DataTable/DataTable";

type EnrichedCategory = {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  tag: string;
  subtitle: string;
  href: string;
};

export function AdminCategoriesClient({ categories }: { categories: EnrichedCategory[] }) {
  const columns: ColumnDef<EnrichedCategory>[] = [
    {
      header: "Category ID",
      accessorKey: "id",
    },
    {
      header: "Name",
      cell: (row) => (
        <div>
          <strong style={{ color: "var(--color-herbal-forest-deep)", fontSize: "0.88rem" }}>{row.name}</strong>
          <span style={{ display: "block", fontSize: "0.72rem", color: "var(--color-text-secondary)" }}>
            Subtitle: {row.subtitle}
          </span>
        </div>
      ),
    },
    {
      header: "Slug",
      accessorKey: "slug",
    },
    {
      header: "Products Count",
      cell: (row) => (
        <span
          style={{
            display: "inline-block",
            padding: "0.15rem 0.5rem",
            borderRadius: "var(--radius-pill)",
            background: "var(--color-herbal-cream)",
            border: "1px solid var(--color-herbal-border)",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--color-herbal-forest-deep)",
          }}
        >
          {row.productCount} {row.productCount === 1 ? "Product" : "Products"}
        </span>
      ),
    },
    {
      header: "Badge / Tag",
      cell: (row) => (
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            textTransform: "uppercase",
            color: "var(--color-herbal-natural)",
          }}
        >
          {row.tag}
        </span>
      ),
    },
    {
      header: "View Category",
      cell: (row) => (
        <Link
          href={row.href}
          style={{
            color: "var(--color-herbal-natural)",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "0.78rem",
          }}
          target="_blank"
        >
          View Collection ↗
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-herbal-forest-deep)" }}>
          Categories ({categories.length})
        </h2>
        <p style={{ margin: "0.25rem 0 0", color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
          Herbal skincare, hair care, and body wash taxonomy groupings.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        emptyMessage="No categories found."
        pageSize={10}
        searchPlaceholder="Search categories..."
      />
    </div>
  );
}
