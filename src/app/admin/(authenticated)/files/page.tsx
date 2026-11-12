import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { AdminFilesClient } from "./files-client";

export const dynamic = "force-dynamic";

export default async function AdminFilesPage() {
  await requireAdmin();

  let files: any[] = [];
  try {
    files = await sql`
      SELECT id, product_name, file_name, file_id, mime_type, file_size, preview_url, download_url, created_at
      FROM product_files
      ORDER BY created_at DESC;
    `;
  } catch (error) {
    console.error("Failed to load product files:", error);
  }

  return <AdminFilesClient files={files} />;
}
