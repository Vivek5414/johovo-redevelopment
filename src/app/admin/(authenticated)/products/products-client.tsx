"use client";

import Image from "next/image";
import Link from "next/link";
import { DataTable, type ColumnDef } from "@/components/admin/DataTable/DataTable";

type FormattedProduct = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  sku: string;
  category: string;
  sellingPrice: string;
  originalPrice: string;
  image: string | null;
  rating: string;
  sizes: string;
};

export function AdminProductsClient({ products }: { products: FormattedProduct[] }) {
  const columns: ColumnDef<FormattedProduct>[] = [
    {
      header: "Product",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {row.image ? (
            <div
              style={{
                position: "relative",
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                flexShrink: 0,
              }}
            >
              <Image alt={row.name} fill sizes="44px" src={row.image} style={{ objectFit: "contain", padding: "2px" }} />
            </div>
          ) : null}
          <div>
            <strong style={{ display: "block", color: "var(--color-herbal-forest-deep)", fontSize: "0.85rem" }}>
              {row.name}
            </strong>
            <span style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)" }}>
              SKU: {row.sku}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Selling Price",
      accessorKey: "sellingPrice",
    },
    {
      header: "MRP",
      accessorKey: "originalPrice",
    },
    {
      header: "Brand",
      accessorKey: "brand",
    },
    {
      header: "Pack Size",
      accessorKey: "sizes",
    },
    {
      header: "Live View",
      cell: (row) => (
        <Link
          href={`/products/${row.slug}`}
          style={{
            color: "var(--color-herbal-natural)",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "0.78rem",
          }}
          target="_blank"
        >
          View Page ↗
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-herbal-forest-deep)" }}>
          Products Catalog ({products.length})
        </h2>
        <p style={{ margin: "0.25rem 0 0", color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
          Full product catalog records, pricing, formulations, and active listings.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={products}
        emptyMessage="No products match your search query."
        pageSize={8}
        searchPlaceholder="Search product by name, SKU or category..."
      />
    </div>
  );
}
