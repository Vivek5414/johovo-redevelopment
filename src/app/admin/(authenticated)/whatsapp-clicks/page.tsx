import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { AdminWhatsAppClicksClient } from "./whatsapp-client";

export const dynamic = "force-dynamic";

export default async function AdminWhatsAppClicksPage() {
  await requireAdmin();

  let logs: any[] = [];
  try {
    logs = await sql`
      SELECT id, page_url, ip_address, browser, machine, created_at
      FROM whatsapp_clicks
      ORDER BY created_at DESC;
    `;
  } catch (error) {
    console.error("Failed to load whatsapp clicks:", error);
  }

  return <AdminWhatsAppClicksClient logs={logs} />;
}
