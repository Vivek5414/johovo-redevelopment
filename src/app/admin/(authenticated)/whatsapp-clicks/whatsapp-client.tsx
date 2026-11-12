"use client";

import { DataTable, type ColumnDef } from "@/components/admin/DataTable/DataTable";

export function AdminWhatsAppClicksClient({ logs }: { logs: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      header: "Log ID",
      accessorKey: "id",
    },
    {
      header: "Page Location",
      cell: (row) => (
        <span
          style={{
            display: "inline-block",
            maxWidth: "260px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: "monospace",
            fontSize: "0.78rem",
            color: "var(--color-herbal-forest-deep)",
          }}
        >
          {row.page_url}
        </span>
      ),
    },
    {
      header: "Device / Machine",
      cell: (row) => (
        <span
          style={{
            padding: "0.15rem 0.5rem",
            borderRadius: "var(--radius-pill)",
            background: "var(--color-surface-muted)",
            border: "1px solid var(--color-border)",
            fontSize: "0.75rem",
          }}
        >
          {row.machine || "Unknown"}
        </span>
      ),
    },
    {
      header: "Browser",
      cell: (row) => (
        <span style={{ fontSize: "0.82rem", color: "var(--color-text-primary)" }}>
          {row.browser || "Unknown"}
        </span>
      ),
    },
    {
      header: "Client IP",
      cell: (row) => (
        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
          {row.ip_address || "127.0.0.1"}
        </span>
      ),
    },
    {
      header: "Time",
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
          WhatsApp Click Logs ({logs.length})
        </h2>
        <p style={{ margin: "0.25rem 0 0", color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
          Real-time user engagement tracking across all WhatsApp order and chat buttons.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        emptyMessage="No WhatsApp click events tracked in database yet."
        pageSize={12}
        searchPlaceholder="Search by IP, page URL, machine, or browser..."
      />
    </div>
  );
}
