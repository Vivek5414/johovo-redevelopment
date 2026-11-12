"use client";

import { DataTable, type ColumnDef } from "@/components/admin/DataTable/DataTable";

export function AdminProductEnquiriesClient({ enquiries }: { enquiries: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      header: "Lead ID",
      accessorKey: "id",
    },
    {
      header: "Product Name",
      cell: (row) => (
        <strong style={{ color: "var(--color-herbal-forest-deep)", fontSize: "0.85rem" }}>
          {row.product_name}
        </strong>
      ),
    },
    {
      header: "Customer Name",
      cell: (row) => (
        <div>
          <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{row.name}</span>
          {row.email ? (
            <span style={{ display: "block", fontSize: "0.72rem", color: "var(--color-text-secondary)" }}>
              {row.email}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      header: "Phone Number",
      cell: (row) => (
        <a
          href={`tel:${row.phone}`}
          style={{ color: "var(--color-herbal-forest-deep)", fontWeight: 600, textDecoration: "none" }}
        >
          {row.phone}
        </a>
      ),
    },
    {
      header: "Customer Message",
      cell: (row) => (
        <div style={{ maxWidth: "340px", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
          {row.message}
        </div>
      ),
    },
    {
      header: "Submitted At",
      cell: (row) => (
        <span style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
          {new Date(row.created_at).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-herbal-forest-deep)" }}>
          Product Enquiries ({enquiries.length})
        </h2>
        <p style={{ margin: "0.25rem 0 0", color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
          Direct customer leads submitted from individual product detail pages.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={enquiries}
        emptyMessage="No product enquiries recorded in Neon database yet."
        pageSize={10}
        searchPlaceholder="Search by customer name, phone, email, or product..."
      />
    </div>
  );
}
