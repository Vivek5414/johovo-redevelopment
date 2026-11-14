"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { DataTable, type ColumnDef } from "@/components/admin/DataTable/DataTable";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

type FormattedProduct = {
  id: number;
  dbId: number | null;
  isCustom: boolean;
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
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ dbId: number; productName: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const closeDeleteDialog = () => {
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeletingId(deleteTarget.dbId);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.dbId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete product");
      }

      closeDeleteDialog();
      router.refresh();
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

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
              <Image
                alt={row.name}
                fill
                sizes="44px"
                src={row.image}
                style={{ objectFit: "contain", padding: "2px" }}
                unoptimized
              />
            </div>
          ) : null}
          <div>
            <strong style={{ display: "block", color: "var(--color-herbal-forest-deep)", fontSize: "0.85rem" }}>
              {row.name}
            </strong>
            <span style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)" }}>
              SKU: {row.sku} {row.isCustom ? "• Custom Product" : ""}
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
      header: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
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
            Live View ↗
          </Link>

          {row.isCustom && row.dbId ? (
            <>
              <Link
                href={`/admin/products/${row.dbId}/edit`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  color: "var(--color-herbal-forest-deep)",
                  background: "var(--color-surface-muted)",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid var(--color-border)",
                }}
              >
                <EditRoundedIcon style={{ fontSize: "0.85rem" }} />
                <span>Edit</span>
              </Link>

              <button
                disabled={deletingId === row.dbId}
                onClick={() => setDeleteTarget({ dbId: row.dbId!, productName: row.name })}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  color: "var(--color-danger-text)",
                  background: "var(--color-danger-surface)",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  border: "1px solid var(--color-danger)",
                  cursor: "pointer",
                }}
                type="button"
              >
                <DeleteOutlineRoundedIcon style={{ fontSize: "0.85rem" }} />
                <span>{deletingId === row.dbId ? "..." : "Delete"}</span>
              </button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--color-herbal-forest-deep)" }}>
            Products Catalog ({products.length})
          </h2>
          <p style={{ margin: "0.25rem 0 0", color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
            Full product catalog records, pricing, formulations, and active listings.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-pill)",
            background: "var(--color-herbal-forest)",
            color: "#ffffff",
            fontSize: "0.85rem",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 4px 12px color-mix(in srgb, var(--color-herbal-forest) 25%, transparent)",
            transition: "all 0.2s ease",
          }}
        >
          <AddRoundedIcon fontSize="small" />
          <span>Add Product</span>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={products}
        emptyMessage="No products match your search query."
        pageSize={8}
        searchPlaceholder="Search product by name, SKU or category..."
      />

      <ConfirmationModal
        confirmText="Delete product"
        errorMessage={deleteError}
        isConfirming={deletingId !== null}
        message={
          deleteTarget
            ? `This will permanently remove "${deleteTarget.productName}" from the catalog and unpublish it from the public storefront.`
            : "This action cannot be undone."
        }
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        open={Boolean(deleteTarget)}
        title="Delete product?"
      />
    </div>
  );
}
