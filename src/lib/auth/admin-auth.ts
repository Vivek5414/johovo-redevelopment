import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { ADMIN_COOKIE_NAME, verifyAdminToken, type AdminJwtPayload } from "./jwt";

export type CurrentAdmin = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
};

/**
 * Returns the currently authenticated admin if valid and active in Neon DB, otherwise null.
 */
export async function getAuthenticatedAdmin(): Promise<CurrentAdmin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) return null;

  const payload: AdminJwtPayload | null = verifyAdminToken(token);
  if (!payload || !payload.sub) return null;

  try {
    const records = await sql`
      SELECT id, name, email, role, is_active, last_login_at
      FROM admins
      WHERE id = ${payload.sub} AND is_active = TRUE
      LIMIT 1;
    `;

    if (!records || records.length === 0) {
      return null;
    }

    const admin = records[0];
    return {
      id: String(admin.id),
      name: String(admin.name),
      email: String(admin.email),
      role: String(admin.role),
      isActive: Boolean(admin.is_active),
      lastLoginAt: admin.last_login_at ? String(admin.last_login_at) : null,
    };
  } catch (error) {
    console.error("Failed to fetch admin from database:", error);
    return null;
  }
}

/**
 * Ensures the admin is authenticated. If not, redirects to /admin/login.
 */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}
