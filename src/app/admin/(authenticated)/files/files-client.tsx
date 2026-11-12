"use client";

import { DataTable, type ColumnDef } from "@/components/admin/DataTable/DataTable";

export function AdminFilesClient({ files }: { files: any[] }) {
  const columns: ColumnDef<any>[] = [
    {
      header: "File ID",
      accessorKey: "id",
    },
    {
      header: "Product / Association",
      cell: (row) => (
        <strong style={{ color: "var(--color-herbal-forest-deep)", fontSize: "0.85rem" }}>
          {row.product_name}
        </strong>
      ),
    },
    {
      header: "File Name",
      accessorKey: "file_name",
    },
    {
      header: "Type",
      accessorKey: "mime_type",
    },
    {
      header: "Preview & Link",
      cell: (row) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {row.preview_url ? (
            <a
              href={row.preview_url}
              style={{ color: "var(--color-herbal-natural)", fontWeight: 600, fontSize: "0.78rem" }}
              target="_blank"
            >
              Preview ↗
            </a>
          ) : null}
          {row.download_url ? (
            <a
              href={row.download_url}
              style={{ color: "var(--color-text-secondary)", fontSize: "0.78rem" }}
              target="_blank"
            >
              Download
            </a>
          ) : null}
        </div>
      ),
    },
    {
      header: "Uploaded At",
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
          Uploaded Cloud Files ({files.length})
        </h2>
        <p style={{ margin: "0.25rem 0 0", color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
          Product media files uploaded and recorded in the database.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={files}
        emptyMessage="No files uploaded to product_files table yet."
        pageSize={10}
        searchPlaceholder="Search files by product or name..."
      />
    </div>
  );
}
