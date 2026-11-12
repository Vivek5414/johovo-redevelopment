import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { AdminProductEnquiriesClient } from "./enquiries-client";

export const dynamic = "force-dynamic";

export default async function AdminProductEnquiriesPage() {
  await requireAdmin();

  let enquiries: any[] = [];
  try {
    enquiries = await sql`
      SELECT id, product_name, name, email, phone, message, created_at
      FROM product_enquiries
      ORDER BY created_at DESC;
    `;
  } catch (error) {
    console.error("Failed to load product enquiries:", error);
  }

  return <AdminProductEnquiriesClient enquiries={enquiries} />;
}
