import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { AdminCallClicksClient } from "./call-client";

export const dynamic = "force-dynamic";

export default async function AdminCallClicksPage() {
  await requireAdmin();

  let logs: any[] = [];
  try {
    logs = await sql`
      SELECT id, page_url, ip_address, browser, machine, created_at
      FROM call_clicks
      ORDER BY created_at DESC;
    `;
  } catch (error) {
    console.error("Failed to load call clicks:", error);
  }

  return <AdminCallClicksClient logs={logs} />;
}
