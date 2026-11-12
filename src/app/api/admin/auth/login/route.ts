import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query admin from Neon
    const admins = await sql`
      SELECT id, name, email, password_hash, role, is_active
      FROM admins
      WHERE email = ${cleanEmail}
      LIMIT 1;
    `;

    if (!admins || admins.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const admin = admins[0];

    if (!admin.is_active) {
      return NextResponse.json(
        { error: "This administrator account is currently deactivated." },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, admin.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Update last_login_at in Neon
    await sql`
      UPDATE admins
      SET last_login_at = NOW(), updated_at = NOW()
      WHERE id = ${admin.id};
    `;

    // Sign JWT Token
    const token = signAdminToken({
      id: String(admin.id),
      email: String(admin.email),
      name: String(admin.name),
      role: String(admin.role),
    });

    const isProduction = process.env.NODE_ENV === "production";
    const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days vs 1 day

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during sign in. Please try again." },
      { status: 500 }
    );
  }
}
