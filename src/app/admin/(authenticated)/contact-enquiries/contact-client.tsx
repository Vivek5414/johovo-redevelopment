"use client";

import { DataTable, type ColumnDef } from "@/components/admin/DataTable/DataTable";
import { LeadQuickActions } from "@/components/admin/QuickActions/LeadQuickActions";

export function AdminContactEnquiriesClient({ enquiries }: { enquiries: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Contact Name",
      cell: (row) => (
        <div>
          <strong style={{ color: "var(--color-herbal-forest-deep)", fontSize: "0.88rem" }}>{row.name}</strong>
          {row.email ? (
            <span style={{ display: "block", fontSize: "0.72rem", color: "var(--color-text-secondary)" }}>
              {row.email}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      header: "Phone",
      cell: (row) => (
        <span style={{ color: "var(--color-herbal-forest-deep)", fontWeight: 600 }}>
          {row.phone}
        </span>
      ),
    },
    {
      header: "Quick Contact",
      cell: (row) => (
        <LeadQuickActions
          customerName={row.name}
          email={row.email}
          phone={row.phone}
          productName={row.product}
        />
      ),
    },
    {
      header: "Selected Product",
      cell: (row) => (
        <span
          style={{
            fontSize: "0.78rem",
            color: row.product ? "var(--color-herbal-forest-deep)" : "var(--color-text-secondary)",
          }}
        >
          {row.product || "General Query"}
        </span>
      ),
    },
    {
      header: "Message",
      cell: (row) => (
        <div style={{ maxWidth: "300px", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
          {row.message || "No message entered"}
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
          Contact Form Enquiries ({enquiries.length})
        </h2>
        <p style={{ margin: "0.25rem 0 0", color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
          Messages submitted from the website Contact page. Follow up directly with customer via Call, WhatsApp, or Email.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={enquiries}
        emptyMessage="No contact form submissions recorded yet."
        pageSize={10}
        searchPlaceholder="Search contact form leads..."
      />
    </div>
  );
}
