import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      invoiceNumber,
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      discountPercent,
      subtotal,
      discountAmount,
      totalAmount,
      items,
    } = body;

    if (!invoiceNumber || !customerName) {
      return NextResponse.json(
        { error: "Invoice number and customer name are required" },
        { status: 400 }
      );
    }

    const inserted = await sql`
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
      ) VALUES (
        ${invoiceNumber},
        ${customerName},
        ${customerPhone || null},
        ${customerEmail || null},
        ${paymentMethod || "UPI / Online Transfer"},
        ${discountPercent ? Number(discountPercent) : 0},
        ${subtotal ? Number(subtotal) : 0},
        ${discountAmount ? Number(discountAmount) : 0},
        ${totalAmount ? Number(totalAmount) : 0},
        ${JSON.stringify(items || [])}::jsonb
      )
      RETURNING *;
    `;

    return NextResponse.json({ success: true, receipt: inserted[0] });
  } catch (error) {
    console.error("Error creating receipt record:", error);
    return NextResponse.json(
      { error: "Failed to save receipt to database" },
      { status: 500 }
    );
  }
}
