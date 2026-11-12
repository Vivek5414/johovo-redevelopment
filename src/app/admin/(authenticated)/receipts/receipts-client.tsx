"use client";

import { useState } from "react";
import Link from "next/link";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import { ReceiptDocument, ReceiptDocumentData } from "@/components/admin/ReceiptDocument/ReceiptDocument";
import styles from "./receipts.module.css";

type ReceiptRecord = {
  id: number;
  invoice_number: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  payment_method: string | null;
  discount_percent: string | number | null;
  subtotal: string | number | null;
  discount_amount: string | number | null;
  total_amount: string | number | null;
  items: any;
  created_at: string;
};

export function ReceiptsListClient({ receipts }: { receipts: ReceiptRecord[] }) {
  const [search, setSearch] = useState("");
  const [activeReceipt, setActiveReceipt] = useState<ReceiptRecord | null>(null);
  const [dispatchingId, setDispatchingId] = useState<number | null>(null);

  const filtered = receipts.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.invoice_number?.toLowerCase().includes(q) ||
      r.customer_name?.toLowerCase().includes(q) ||
      r.customer_phone?.toLowerCase().includes(q) ||
      r.customer_email?.toLowerCase().includes(q)
    );
  });

  const totalRevenue = receipts.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0);

  const triggerDownloadOrPrint = (r: ReceiptRecord) => {
    setActiveReceipt(r);

    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    // Give state a tick to mount the receipt sheet for print
    setTimeout(() => {
      if (typeof window === "undefined" || typeof document === "undefined") {
        return;
      }

      const cleanName = (r.customer_name || "Customer").trim().replace(/[^a-zA-Z0-9_-]/g, "_");
      const cleanPhone = (r.customer_phone || r.invoice_number || "receipt")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const targetTitle = `${cleanName}-${cleanPhone}`;

      const originalTitle = document.title;
      document.title = targetTitle;

      window.print();

      setTimeout(() => {
        if (typeof document !== "undefined") {
          document.title = originalTitle;
        }
      }, 1000);
    }, 150);
  };

  const getDocData = (r: ReceiptRecord): ReceiptDocumentData => {
    let parsedItems = [];
    if (typeof r.items === "string") {
      try {
        parsedItems = JSON.parse(r.items);
      } catch (e) {
        parsedItems = [];
      }
    } else if (Array.isArray(r.items)) {
      parsedItems = r.items;
    }

    return {
      invoiceNumber: r.invoice_number,
      customerName: r.customer_name,
      customerPhone: r.customer_phone || undefined,
      customerEmail: r.customer_email || undefined,
      paymentMethod: r.payment_method || undefined,
      discountPercent: r.discount_percent ? Number(r.discount_percent) : 0,
      subtotal: Number(r.subtotal) || 0,
      discountAmount: Number(r.discount_amount) || 0,
      totalAmount: Number(r.total_amount) || 0,
      items: parsedItems,
      createdAt: r.created_at,
    };
  };

  const dispatchReceiptByMail = async (r: ReceiptRecord) => {
    if (!r.customer_email) {
      alert("This receipt has no customer email to dispatch.");
      return;
    }

    setDispatchingId(r.id);

    try {
      const response = await fetch("/api/admin/receipts/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptId: r.id }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Failed to dispatch mail");
      }

      alert(`Receipt sent to ${r.customer_email}`);
    } catch (error: any) {
      alert(error?.message || "Unable to dispatch receipt mail.");
    } finally {
      setDispatchingId(null);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>Customer Receipts &amp; Invoices</h2>
          <p className={styles.desc}>
            View, search, preview, and download/print all generated customer purchase receipts.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link className={styles.createBtn} href="/admin/receipt">
            <AddRoundedIcon fontSize="small" />
            <span>Generate New Receipt</span>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Receipts</span>
          <span className={styles.statValue}>{receipts.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Invoiced Amount</span>
          <span className={styles.statValue}>₹{totalRevenue.toLocaleString("en-IN")}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Avg Order Value</span>
          <span className={styles.statValue}>
            ₹{receipts.length > 0 ? Math.round(totalRevenue / receipts.length).toLocaleString("en-IN") : 0}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.searchBox}>
          <SearchRoundedIcon fontSize="small" />
          <input
            className={styles.searchInput}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice #, customer name, phone, or email..."
            type="text"
            value={search}
          />
        </div>
      </div>

      {/* Desktop / Laptop Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Customer</th>
                <th>Payment Mode</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Total Paid</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className={styles.emptyState} colSpan={8}>
                    No receipts found. Generate your first receipt using the button above.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className={styles.invoicePill}>{r.invoice_number}</span>
                    </td>
                    <td>
                      <div className={styles.customerMeta}>
                        <span className={styles.customerName}>{r.customer_name}</span>
                        <span className={styles.customerContact}>
                          {r.customer_phone || r.customer_email || "No contact"}
                        </span>
                      </div>
                    </td>
                    <td>{r.payment_method || "UPI / Online"}</td>
                    <td>₹{Number(r.subtotal || 0).toFixed(2)}</td>
                    <td>
                      {Number(r.discount_amount || 0) > 0 ? (
                        <span style={{ color: "var(--color-brand-pink)", fontWeight: 600 }}>
                          -₹{Number(r.discount_amount).toFixed(2)} ({r.discount_percent}%)
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span className={styles.amount}>₹{Number(r.total_amount || 0).toFixed(2)}</span>
                    </td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--color-text-secondary)" }}>
                      {new Date(r.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div className={styles.actionBtnGroup}>
                        <button
                          className={styles.viewBtn}
                          onClick={() => setActiveReceipt(r)}
                          title="Preview Receipt"
                          type="button"
                        >
                          <VisibilityRoundedIcon style={{ fontSize: "0.95rem" }} />
                          <span>View</span>
                        </button>
                        <button
                          className={styles.downloadBtn}
                          onClick={() => triggerDownloadOrPrint(r)}
                          title="Download / Print PDF"
                          type="button"
                        >
                          <DownloadRoundedIcon style={{ fontSize: "0.95rem" }} />
                          <span>Download PDF</span>
                        </button>
                        <button
                          className={styles.viewBtn}
                          disabled={dispatchingId === r.id}
                          onClick={() => dispatchReceiptByMail(r)}
                          title="Dispatch receipt by email"
                          type="button"
                          style={{ opacity: dispatchingId === r.id ? 0.7 : 1 }}
                        >
                          <PrintRoundedIcon style={{ fontSize: "0.95rem" }} />
                          <span>{dispatchingId === r.id ? "Sending..." : "Dispatch Mail"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet Card Layout */}
      <div className={styles.mobileCardsGrid}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>No receipts found.</div>
        ) : (
          filtered.map((r) => (
            <div className={styles.mobileCard} key={r.id}>
              <div className={styles.mobileCardHeader}>
                <div>
                  <span className={styles.invoicePill}>{r.invoice_number}</span>
                  <div className={styles.customerName} style={{ marginTop: "0.35rem" }}>
                    {r.customer_name}
                  </div>
                  <div className={styles.customerContact}>{r.customer_phone || r.customer_email}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={styles.amount} style={{ fontSize: "1.1rem" }}>
                    ₹{Number(r.total_amount || 0).toFixed(2)}
                  </span>
                  <div style={{ fontSize: "0.7rem", color: "var(--color-text-secondary)" }}>
                    {new Date(r.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
              </div>

              <div className={styles.mobileCardBody}>
                <div className={styles.mobileMetaCol}>
                  <span className={styles.mobileMetaLabel}>Payment</span>
                  <span className={styles.mobileMetaValue}>{r.payment_method || "UPI"}</span>
                </div>
                <div className={styles.mobileMetaCol}>
                  <span className={styles.mobileMetaLabel}>Discount</span>
                  <span className={styles.mobileMetaValue}>
                    {Number(r.discount_amount || 0) > 0 ? `₹${r.discount_amount}` : "None"}
                  </span>
                </div>
              </div>

              <div className={styles.mobileCardActions}>
                <button
                  className={styles.viewBtn}
                  onClick={() => setActiveReceipt(r)}
                  type="button"
                >
                  <VisibilityRoundedIcon style={{ fontSize: "0.9rem" }} />
                  <span>Preview</span>
                </button>
                <button
                  className={styles.downloadBtn}
                  onClick={() => triggerDownloadOrPrint(r)}
                  type="button"
                >
                  <DownloadRoundedIcon style={{ fontSize: "0.9rem" }} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Preview & Print Dialog */}
      {activeReceipt && (
        <div className={styles.modalBackdrop} onClick={() => setActiveReceipt(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Receipt Preview ({activeReceipt.invoice_number})</h3>
              <div className={styles.modalHeaderRight}>
                <button
                  className={styles.downloadBtn}
                  onClick={() => triggerDownloadOrPrint(activeReceipt)}
                  type="button"
                >
                  <PrintRoundedIcon style={{ fontSize: "0.95rem" }} />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  aria-label="Close modal"
                  className={styles.modalCloseBtn}
                  onClick={() => setActiveReceipt(null)}
                  type="button"
                >
                  <CloseRoundedIcon />
                </button>
              </div>
            </div>
            <div className={styles.modalBody}>
              <ReceiptDocument data={getDocData(activeReceipt)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
