import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS receipt (
      id SERIAL PRIMARY KEY,
      invoice_number VARCHAR(120) NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50),
      customer_email VARCHAR(255),
      payment_method VARCHAR(120),
      discount_percent NUMERIC(5,2) DEFAULT 0,
      subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
      discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
      total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function GET() {
  try {
    await ensureTable();

    const rows = await sql`
      SELECT
        id,
        invoice_number,
        customer_name,
        customer_phone,
        customer_email,
        payment_method,
        discount_percent,
        subtotal,
        discount_amount,
        total_amount,
        items,
        created_at
      FROM receipt
      ORDER BY created_at DESC
      LIMIT 20;
    `;

    return NextResponse.json({
      success: true,
      receipts: rows.map((row: any) => ({
        id: row.id,
        invoice_number: row.invoice_number,
        customer_name: row.customer_name,
        customer_phone: row.customer_phone,
        customer_email: row.customer_email,
        payment_method: row.payment_method,
        discount_percent: Number(row.discount_percent ?? 0),
        subtotal: Number(row.subtotal ?? 0),
        discount_amount: Number(row.discount_amount ?? 0),
        total_amount: Number(row.total_amount ?? 0),
        items: Array.isArray(row.items) ? row.items : [],
        created_at: row.created_at,
      })),
    });
  } catch (error) {
    console.error("Error retrieving receipts from Neon:", error);
    return NextResponse.json(
      { error: "Failed to load receipt records." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const invoiceNumber = typeof body.invoiceNumber === "string" ? body.invoiceNumber.trim() : "";
    const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
    const customerPhone = typeof body.customerPhone === "string" ? body.customerPhone.trim() : null;
    const customerEmail = typeof body.customerEmail === "string" ? body.customerEmail.trim() : null;
    const paymentMethod = typeof body.paymentMethod === "string" ? body.paymentMethod.trim() : null;
    const discountPercent = Number(body.discountPercent ?? 0);
    const subtotal = Number(body.subtotal ?? 0);
    const discountAmount = Number(body.discountAmount ?? 0);
    const totalAmount = Number(body.totalAmount ?? 0);
    const items = Array.isArray(body.items) ? body.items : [];

    if (!invoiceNumber) {
      return NextResponse.json({ error: "Invoice number is required." }, { status: 400 });
    }

    if (!customerName) {
      return NextResponse.json({ error: "Customer name is required." }, { status: 400 });
    }

    await ensureTable();

    const result = await sql`
      INSERT INTO receipt (
        invoice_number,
        customer_name,
        customer_phone,
        customer_email,
        payment_method,
        discount_percent,
        subtotal,
        discount_amount,
        total_amount,
        items
      )
      VALUES (
        ${invoiceNumber},
        ${customerName},
        ${customerPhone},
        ${customerEmail},
        ${paymentMethod},
        ${discountPercent},
        ${subtotal},
        ${discountAmount},
        ${totalAmount},
        ${JSON.stringify(items)}::jsonb
      )
      RETURNING id, invoice_number, created_at;
    `;

    return NextResponse.json(
      {
        success: true,
        message: "Receipt saved successfully.",
        receiptId: result[0]?.id,
        invoiceNumber: result[0]?.invoice_number,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving receipt to Neon:", error);
    return NextResponse.json(
      { error: "Failed to save receipt. Please try again later." },
      { status: 500 }
    );
  }
}
