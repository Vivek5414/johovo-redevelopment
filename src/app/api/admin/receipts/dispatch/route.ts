import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { sql } from "@/lib/db";
import { dispatchReceiptByEmail } from "@/lib/receipt-mailer";

function normalizeReceiptPayload(receipt: any) {
  const items = Array.isArray(receipt?.items) ? receipt.items : [];

  return {
    invoiceNumber: receipt?.invoice_number || receipt?.invoiceNumber || "N/A",
    customerName: receipt?.customer_name || receipt?.customerName || "Customer",
    customerPhone: receipt?.customer_phone || receipt?.customerPhone || "",
    customerEmail: receipt?.customer_email || receipt?.customerEmail || "",
    paymentMethod: receipt?.payment_method || receipt?.paymentMethod || "UPI / Online Transfer",
    discountPercent: receipt?.discount_percent ?? receipt?.discountPercent ?? 0,
    subtotal: receipt?.subtotal ?? 0,
    discountAmount: receipt?.discount_amount ?? receipt?.discountAmount ?? 0,
    totalAmount: receipt?.total_amount ?? receipt?.totalAmount ?? 0,
    items,
    createdAt: receipt?.created_at || receipt?.createdAt || new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const receiptId = body?.receiptId ? Number(body.receiptId) : null;

    let receiptRecord = body?.receiptData || body;

    if (receiptId) {
      const rows = await sql`
        SELECT *
        FROM receipt
        WHERE id = ${receiptId}
        LIMIT 1;
      `;

      if (!rows || rows.length === 0) {
        return NextResponse.json({ error: "Receipt record not found." }, { status: 404 });
      }

      receiptRecord = rows[0];
    }

    const receipt = normalizeReceiptPayload(receiptRecord);

    if (!receipt.customerEmail) {
      return NextResponse.json(
        { error: "Customer email is missing for this receipt." },
        { status: 400 }
      );
    }

    const result = await dispatchReceiptByEmail(receipt);

    return NextResponse.json({
      success: true,
      message: `Receipt email dispatched to ${receipt.customerEmail}`,
      receiptNumber: receipt.invoiceNumber,
      email: receipt.customerEmail,
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error("Failed to dispatch receipt email:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to send receipt email.",
      },
      { status: 500 }
    );
  }
}
