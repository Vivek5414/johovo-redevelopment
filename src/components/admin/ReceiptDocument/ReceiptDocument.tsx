import React from "react";
import Logo from "@/components/Logo";
import { JOHOVO_CONTACT } from "@/lib/contact";
import styles from "./ReceiptDocument.module.css";

export type ReceiptDocItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type ReceiptDocumentData = {
  invoiceNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: string;
  discountPercent?: number | "";
  items: ReceiptDocItem[];
  subtotal?: number;
  discountAmount?: number;
  totalAmount?: number;
  createdAt?: string | Date;
};

export function ReceiptDocument({ data }: { data: ReceiptDocumentData }) {
  const items = data.items || [];
  const subtotal =
    typeof data.subtotal === "number"
      ? data.subtotal
      : items.reduce((acc, it) => acc + (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0), 0);

  const discountPercentVal =
    typeof data.discountPercent === "number" && !Number.isNaN(data.discountPercent) && data.discountPercent > 0
      ? Math.min(100, Math.max(0, data.discountPercent))
      : 0;

  const discountDeduction =
    typeof data.discountAmount === "number" && !Number.isNaN(data.discountAmount)
      ? data.discountAmount
      : (subtotal * discountPercentVal) / 100;

  const grandTotal =
    typeof data.totalAmount === "number" && !Number.isNaN(data.totalAmount)
      ? data.totalAmount
      : Math.max(0, subtotal - discountDeduction);

  const formattedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  return (
    <div className={styles.receiptSheet} id="printable-receipt">
      <div className={styles.receiptTop}>
        <div className={styles.companyMeta}>
          <Logo size="header" />
          <p style={{ margin: "0.35rem 0 0", fontWeight: "bold", color: "var(--color-herbal-forest-deep)" }}>
            JOHOVO Herbal &amp; Ayurvedic Care
          </p>
          <span>Phone: {JOHOVO_CONTACT.displayPhone}</span>
          <span>Email: {JOHOVO_CONTACT.email}</span>
          <span>Website: www.johovo.in</span>
        </div>

        <div className={styles.receiptDocTitle}>
          <h2>TAX RECEIPT</h2>
          <span className={styles.receiptNumber}>{data.invoiceNumber}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
            Date: {formattedDate}
          </span>
        </div>
      </div>

      {/* Customer Details */}
      <div className={styles.customerMetaGrid}>
        <div className={styles.metaCol}>
          <span>BILLED TO:</span>
          <strong>{data.customerName || "Customer Name"}</strong>
          <span>{data.customerPhone || "Phone Number"}</span>
          <span>{data.customerEmail || ""}</span>
        </div>
        <div className={styles.metaCol}>
          <span>PAYMENT DETAILS:</span>
          <strong>Mode: {data.paymentMethod || "UPI / Online Transfer"}</strong>
          <span>Status: Paid / Confirmed</span>
        </div>
      </div>

      {/* Items Table */}
      <div className={styles.receiptTableWrapper}>
        <table className={styles.receiptTable}>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id || idx}>
                <td>
                  <strong>{item.name}</strong>
                </td>
                <td style={{ textAlign: "center" }}>{item.quantity}</td>
                <td style={{ textAlign: "right" }}>₹{Number(item.unitPrice).toFixed(2)}</td>
                <td>₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className={styles.receiptTotals}>
        <div className={styles.totalRow}>
          <span>Subtotal:</span>
          <strong>₹{subtotal.toFixed(2)}</strong>
        </div>
        {discountPercentVal > 0 || discountDeduction > 0 ? (
          <div className={styles.totalRow}>
            <span style={{ color: "var(--color-brand-pink)" }}>
              Discount{discountPercentVal > 0 ? ` (${discountPercentVal}%)` : ""}:
            </span>
            <strong style={{ color: "var(--color-brand-pink)" }}>
              -₹{discountDeduction.toFixed(2)}
            </strong>
          </div>
        ) : null}
        <div className={styles.totalRow}>
          <span>Shipping:</span>
          <strong style={{ color: "var(--color-herbal-natural)" }}>FREE</strong>
        </div>
        <div className={styles.grandTotalRow}>
          <span>Total Amount:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer Notice */}
      <div className={styles.receiptFooterNotes}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Thank you for choosing JOHOVO authentic botanical formulations!
        </p>
        <span>
          For queries, contact support: {JOHOVO_CONTACT.displayPhone} • {JOHOVO_CONTACT.email}
        </span>
        <span>This is a computer-generated receipt issued by JOHOVO.</span>
      </div>
    </div>
  );
}
