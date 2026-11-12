import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { ReceiptsListClient } from "./receipts-client";

export const dynamic = "force-dynamic";

export default async function AdminReceiptsListPage() {
  await requireAdmin();

  let receipts: any[] = [];
  try {
    receipts = await sql`
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
      ORDER BY created_at DESC;
    `;
  } catch (error) {
    console.error("Failed to load receipts list:", error);
  }

  return <ReceiptsListClient receipts={receipts} />;
}
