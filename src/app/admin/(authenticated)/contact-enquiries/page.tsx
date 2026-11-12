import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { AdminContactEnquiriesClient } from "./contact-client";

export const dynamic = "force-dynamic";

export default async function AdminContactEnquiriesPage() {
  await requireAdmin();

  let enquiries: any[] = [];
  try {
    enquiries = await sql`
      SELECT id, name, email, phone, product, message, created_at
      FROM contact_enquiries
      ORDER BY created_at DESC;
    `;
  } catch (error) {
    console.error("Failed to load contact enquiries:", error);
  }

  return <AdminContactEnquiriesClient enquiries={enquiries} />;
}
