import React from "react";
import nodemailer from "nodemailer";
import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";
import { JOHOVO_CONTACT } from "@/lib/contact";
import { ReceiptDocument, type ReceiptDocumentData } from "@/components/admin/ReceiptDocument/ReceiptDocument";

export type ReceiptMailItem = {
  name?: string;
  quantity?: number | string;
  unitPrice?: number | string;
};

export type ReceiptMailData = {
  invoiceNumber?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
  paymentMethod?: string | null;
  discountPercent?: number | string | null;
  subtotal?: number | string | null;
  discountAmount?: number | string | null;
  totalAmount?: number | string | null;
  items?: ReceiptMailItem[] | null;
  createdAt?: string | null;
};

const normalizeReceiptForTemplate = (data: ReceiptMailData): ReceiptDocumentData => ({
  invoiceNumber: data.invoiceNumber || "N/A",
  customerName: data.customerName || "Customer Name",
  customerPhone: data.customerPhone || "Phone Number",
  customerEmail: data.customerEmail || "",
  paymentMethod: data.paymentMethod || "UPI / Online Transfer",
  discountPercent: typeof data.discountPercent === "number" ? data.discountPercent : 0,
  subtotal: Number(data.subtotal || 0),
  discountAmount: Number(data.discountAmount || 0),
  totalAmount: Number(data.totalAmount || Number(data.subtotal || 0) - Number(data.discountAmount || 0)),
  items: (data.items || []).map((item) => ({
    id: `${item.name || "product"}-${Math.random().toString(36).slice(2, 8)}`,
    name: item.name || "Product",
    quantity: Number(item.quantity || 1),
    unitPrice: Number(item.unitPrice || 0),
  })),
  createdAt: data.createdAt || new Date(),
});

export function generateReceiptFileName(invoiceNumber?: string | null) {
  const safeInvoice = (invoiceNumber || "receipt")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "receipt";

  return `johovo-receipt-${safeInvoice}.pdf`;
}

export async function buildReceiptEmailHtml(data: ReceiptMailData) {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const normalized = normalizeReceiptForTemplate(data);
  const markup = renderToStaticMarkup(React.createElement(ReceiptDocument, { data: normalized }));
  return `<!DOCTYPE html><html><body style="margin:0; background:#f6f3ee; padding:24px;">${markup}</body></html>`;
}

/**
 * Generates an A4 PDF receipt buffer in Node.js runtime using jsPDF vector primitives
 * avoiding browser DOM dependencies (like `document` / `window` / `html2canvas`).
 * Matches the official ReceiptDocument design and uses public/logo.png.
 */
export async function generateReceiptPdfBuffer(data: ReceiptMailData): Promise<Buffer> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  // Outer container border
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 6, 6, "F");
  doc.setDrawColor(228, 224, 216);
  doc.setLineWidth(1);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 6, 6, "S");

  const innerX = margin + 20;
  const innerWidth = contentWidth - 40;
  const rightX = innerX + innerWidth;
  let cursorY = margin + 20;

  // 1. Header: Logo (from public/logo.png or public/images/brand/johovo-logo.png)
  const candidateLogoPaths = [
    path.join(process.cwd(), "public/logo.png"),
    path.join(process.cwd(), "public/images/brand/johovo-logo.png"),
    path.join(process.cwd(), "public/images/brand/logo2.png"),
  ];

  let logoDrawn = false;
  for (const lp of candidateLogoPaths) {
    if (fs.existsSync(lp)) {
      try {
        const logoBuffer = fs.readFileSync(lp);
        // Logo natural ratio ~ 3:1 (2172 x 724)
        doc.addImage(logoBuffer, "PNG", innerX, cursorY, 126, 42);
        logoDrawn = true;
        break;
      } catch {
        // continue to next candidate
      }
    }
  }

  if (!logoDrawn) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(44, 76, 56);
    doc.text("JOHOVO", innerX, cursorY + 28);
  }

  // 1.2 Header: TAX RECEIPT, Invoice #, Date
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(44, 76, 56); // herbal-forest
  doc.text("TAX RECEIPT", rightX, cursorY + 16, { align: "right" });

  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 52, 38);
  doc.text(String(data.invoiceNumber || "N/A"), rightX, cursorY + 32, { align: "right" });

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

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text(`Date: ${formattedDate}`, rightX, cursorY + 46, { align: "right" });

  cursorY += 50;

  // 1.3 Company Details under logo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(115, 115, 115);
  const companyLines = [
    "GST No: 33AKUPA5054C1ZH",
    "JOHOVO",
    "20/3, Natarajapuram West, Nandivaram, Guduvancheri,",
    "Tamil Nadu - 603202",
    "Call & WhatsApp: +91 7845873369",
    "Email: info@johovo.in  |  Website: www.johovo.in",
  ];
  for (const line of companyLines) {
    doc.text(line, innerX, cursorY);
    cursorY += 11.5;
  }

  cursorY += 8;
  // Thick botanical dividing line
  doc.setDrawColor(44, 76, 56);
  doc.setLineWidth(1.8);
  doc.line(innerX, cursorY, rightX, cursorY);
  cursorY += 16;

  // 2. Customer & Payment Details
  const colWidth = innerWidth / 2;

  // Left: BILLED TO
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(130, 130, 130);
  doc.text("BILLED TO:", innerX, cursorY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 52, 38);
  doc.text(String(data.customerName || "Customer Name"), innerX, cursorY + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  let leftOffset = 28;
  if (data.customerPhone) {
    doc.text(String(data.customerPhone), innerX, cursorY + leftOffset);
    leftOffset += 13;
  }
  if (data.customerEmail) {
    doc.text(String(data.customerEmail), innerX, cursorY + leftOffset);
  }

  // Right: PAYMENT DETAILS
  const rightColX = innerX + colWidth;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(130, 130, 130);
  doc.text("PAYMENT DETAILS:", rightColX, cursorY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 52, 38);
  doc.text(`Mode: ${data.paymentMethod || "UPI / Online Transfer"}`, rightColX, cursorY + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 120, 90);
  doc.text("Status: Paid / Confirmed", rightColX, cursorY + 28);

  cursorY += Math.max(leftOffset + 12, 44);

  // Subtle separator line
  doc.setDrawColor(230, 225, 218);
  doc.setLineWidth(0.8);
  doc.line(innerX, cursorY, rightX, cursorY);
  cursorY += 14;

  // 3. Table Header
  const col1X = innerX + 10;
  const col2X = innerX + innerWidth - 210;
  const col3X = innerX + innerWidth - 110;
  const col4X = rightX - 10;

  doc.setFillColor(245, 242, 235); // herbal-cream
  doc.roundedRect(innerX, cursorY, innerWidth, 22, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(44, 76, 56);
  doc.text("ITEM DESCRIPTION", col1X, cursorY + 14);
  doc.text("QTY", col2X, cursorY + 14, { align: "center" });
  doc.text("UNIT PRICE", col3X, cursorY + 14, { align: "right" });
  doc.text("AMOUNT", col4X, cursorY + 14, { align: "right" });

  cursorY += 26;

  // 3.1 Table Items
  const items = Array.isArray(data.items) ? data.items : [];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);

  for (const item of items) {
    const qty = Number(item.quantity) || 1;
    const unitPrice = Number(item.unitPrice) || 0;
    const lineTotal = qty * unitPrice;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(String(item.name || "Product"), col1X, cursorY + 13);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(String(qty), col2X, cursorY + 13, { align: "center" });
    doc.text(`Rs. ${unitPrice.toFixed(2)}`, col3X, cursorY + 13, { align: "right" });
    doc.text(`Rs. ${lineTotal.toFixed(2)}`, col4X, cursorY + 13, { align: "right" });

    cursorY += 22;
    doc.setDrawColor(242, 238, 232);
    doc.line(innerX, cursorY, rightX, cursorY);
    cursorY += 4;
  }

  cursorY += 12;

  // 4. Totals Breakdown
  const totalsLabelX = innerX + innerWidth - 160;
  const totalsValX = col4X;

  const subtotal = Number(data.subtotal || 0);
  const discountAmount = Number(data.discountAmount || 0);
  const discountPercent = Number(data.discountPercent || 0);
  const totalAmount = Number(data.totalAmount || subtotal - discountAmount);

  // Subtotal
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(110, 110, 110);
  doc.text("Subtotal:", totalsLabelX, cursorY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text(`Rs. ${subtotal.toFixed(2)}`, totalsValX, cursorY, { align: "right" });
  cursorY += 15;

  // Discount
  if (discountAmount > 0 || discountPercent > 0) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(190, 50, 80);
    const discLabel = discountPercent > 0 ? `Discount (${discountPercent}%):` : "Discount:";
    doc.text(discLabel, totalsLabelX, cursorY);
    doc.setFont("helvetica", "bold");
    doc.text(`-Rs. ${discountAmount.toFixed(2)}`, totalsValX, cursorY, { align: "right" });
    cursorY += 15;
  }

  // Shipping
  doc.setFont("helvetica", "normal");
  doc.setTextColor(110, 110, 110);
  doc.text("Shipping:", totalsLabelX, cursorY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(46, 125, 50);
  doc.text("FREE", totalsValX, cursorY, { align: "right" });
  cursorY += 16;

  // Grand Total highlight row
  doc.setFillColor(247, 245, 240);
  doc.setDrawColor(220, 215, 205);
  doc.roundedRect(totalsLabelX - 8, cursorY - 4, innerWidth - (totalsLabelX - innerX) + 8, 25, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 52, 38);
  doc.text("Total Amount:", totalsLabelX, cursorY + 13);
  doc.setFontSize(11);
  doc.text(`Rs. ${totalAmount.toFixed(2)}`, totalsValX, cursorY + 13, { align: "right" });

  cursorY += 40;

  // 5. Footer Notes
  const footerY = Math.max(cursorY, pageHeight - margin - 55);
  doc.setDrawColor(230, 225, 218);
  doc.setLineWidth(0.8);
  doc.line(innerX, footerY, rightX, footerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(50, 70, 55);
  doc.text(
    "Thank you for choosing JOHOVO authentic botanical formulations!",
    pageWidth / 2,
    footerY + 15,
    { align: "center" }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `For queries, contact support: ${JOHOVO_CONTACT.displayPhone} • ${JOHOVO_CONTACT.email}`,
    pageWidth / 2,
    footerY + 27,
    { align: "center" }
  );
  doc.text(
    "This is a computer-generated receipt issued by JOHOVO.",
    pageWidth / 2,
    footerY + 38,
    { align: "center" }
  );

  return Buffer.from(doc.output("arraybuffer"));
}

export async function dispatchReceiptByEmail(data: ReceiptMailData) {
  const toEmail = String(data.customerEmail || "").trim();
  if (!toEmail) {
    throw new Error("Customer email is required to dispatch the receipt.");
  }

  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.SMTP_FROM?.trim() || user;

  if (!host || !user || !password || !from) {
    throw new Error("SMTP email configuration is missing. Please define SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  const pdfBuffer = await generateReceiptPdfBuffer(data);
  const html = await buildReceiptEmailHtml(data);
  const info = await transporter.sendMail({
    from,
    to: toEmail,
    replyTo: from,
    subject: `Your JOHOVO receipt - ${data.invoiceNumber || "Purchase"}`,
    text: `Hello ${data.customerName || "Customer"},\n\nYour purchase receipt has been attached. Thank you for shopping with JOHOVO.`,
    html,
    attachments: [
      {
        filename: generateReceiptFileName(data.invoiceNumber),
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted || [],
    rejected: info.rejected || [],
  };
}
