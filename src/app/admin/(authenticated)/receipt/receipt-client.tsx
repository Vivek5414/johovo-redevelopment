"use client";

import { useState } from "react";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import Logo from "@/components/Logo";
import { JOHOVO_CONTACT } from "@/lib/contact";
import styles from "./receipt.module.css";

type ReceiptItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

type ReceiptClientProps = {
  products: { name: string; price: number }[];
};

export function ReceiptClient({ products }: ReceiptClientProps) {
  const [customerName, setCustomerName] = useState("Priya Sharma");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [customerEmail, setCustomerEmail] = useState("priya@example.com");
  const [invoiceNumber, setInvoiceNumber] = useState(`JH-REC-${Math.floor(100000 + Math.random() * 900000)}`);
  const [paymentMethod, setPaymentMethod] = useState("UPI / Online Transfer");
  const [discountPercent, setDiscountPercent] = useState<number | "">("");

  const [items, setItems] = useState<ReceiptItem[]>([
    {
      id: "1",
      name: "IyalMooligai Herbal Face Pack",
      quantity: 1,
      unitPrice: 720,
    },
    {
      id: "2",
      name: "IyalMooligai Herbal Hair Oil",
      quantity: 1,
      unitPrice: 799,
    },
  ]);

  const addItem = () => {
    const defaultProduct = products[0] || { name: "Herbal Skincare Product", price: 720 };
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: defaultProduct.name,
        quantity: 1,
        unitPrice: defaultProduct.price || 720,
      },
    ]);
  };

  const updateItem = (id: string, field: keyof ReceiptItem, val: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, it) => acc + (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0), 0);
  const discountPercentVal =
    typeof discountPercent === "number" && !Number.isNaN(discountPercent) && discountPercent > 0
      ? Math.min(100, Math.max(0, discountPercent))
      : 0;
  const discountDeduction = (subtotal * discountPercentVal) / 100;
  const grandTotal = Math.max(0, subtotal - discountDeduction);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.receiptPage}>
      {/* Top Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>Receipt &amp; Invoice Generator</h2>
          <p className={styles.desc}>Generate, preview, and print formal customer purchase receipts / PDF invoices.</p>
        </div>
        <button className={styles.printBtn} onClick={handlePrint} type="button">
          <PrintRoundedIcon />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      <div className={styles.layoutGrid}>
        {/* Editor Form Card */}
        <div className={styles.formCard}>
          <h3 className={styles.formCardTitle}>Receipt Details Editor</h3>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Receipt / Order #</label>
            <input
              className={styles.input}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              type="text"
              value={invoiceNumber}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Customer Name</label>
            <input
              className={styles.input}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              type="text"
              value={customerName}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Customer Phone</label>
            <input
              className={styles.input}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Customer Phone"
              type="tel"
              value={customerPhone}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Customer Email</label>
            <input
              className={styles.input}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              value={customerEmail}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Payment Mode</label>
            <select
              className={styles.select}
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
            >
              <option value="UPI / Online Transfer">UPI / Online Transfer</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
              <option value="WhatsApp Direct Order">WhatsApp Direct Order</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              Discount (%) <span style={{ fontWeight: "normal", color: "var(--color-text-secondary)" }}>(Optional)</span>
            </label>
            <input
              className={styles.input}
              max={100}
              min={0}
              onChange={(e) => {
                const val = e.target.value.trim();
                setDiscountPercent(val === "" ? "" : Number(val));
              }}
              placeholder="e.g. 10"
              step="any"
              type="number"
              value={discountPercent}
            />
          </div>

          <div className={styles.itemsHeader}>
            <h4 style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-herbal-forest-deep)" }}>Purchased Items</h4>
            <button className={styles.addItemBtn} onClick={addItem} type="button">
              <AddRoundedIcon style={{ fontSize: "0.9rem" }} />
              <span>Add Item</span>
            </button>
          </div>

          {items.map((item) => (
            <div className={styles.itemRow} key={item.id}>
              <select
                className={styles.select}
                onChange={(e) => {
                  const found = products.find((p) => p.name === e.target.value);
                  updateItem(item.id, "name", e.target.value);
                  if (found) {
                    updateItem(item.id, "unitPrice", found.price);
                  }
                }}
                value={item.name}
              >
                {products.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                className={styles.input}
                min={1}
                onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                type="number"
                value={item.quantity}
              />
              <input
                className={styles.input}
                onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                type="number"
                value={item.unitPrice}
              />
              <button
                aria-label="Remove item"
                className={styles.removeBtn}
                onClick={() => removeItem(item.id)}
                type="button"
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </button>
            </div>
          ))}
        </div>

        {/* Live Printable Receipt Sheet (A4 PDF Ready) */}
        <div className={styles.previewWrapper}>
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
                <span className={styles.receiptNumber}>{invoiceNumber}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                  Date: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className={styles.customerMetaGrid}>
              <div className={styles.metaCol}>
                <span>BILLED TO:</span>
                <strong>{customerName || "Customer Name"}</strong>
                <span>{customerPhone || "Phone Number"}</span>
                <span>{customerEmail || ""}</span>
              </div>
              <div className={styles.metaCol}>
                <span>PAYMENT DETAILS:</span>
                <strong>Mode: {paymentMethod}</strong>
                <span>Status: Paid / Confirmed</span>
              </div>
            </div>

            {/* Items Table */}
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
                {items.map((item) => (
                  <tr key={item.id}>
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

            {/* Totals */}
            <div className={styles.receiptTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal:</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>
              {discountPercentVal > 0 ? (
                <div className={styles.totalRow}>
                  <span style={{ color: "var(--color-brand-pink)" }}>Discount ({discountPercentVal}%):</span>
                  <strong style={{ color: "var(--color-brand-pink)" }}>-₹{discountDeduction.toFixed(2)}</strong>
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
              <p style={{ margin: 0, fontWeight: 600 }}>Thank you for choosing JOHOVO authentic botanical formulations!</p>
              <span>For queries, contact support: {JOHOVO_CONTACT.displayPhone} • {JOHOVO_CONTACT.email}</span>
              <span>This is a computer-generated receipt issued by JOHOVO.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
