import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth/admin-auth";

export async function GET() {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in as an administrator." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    admin,
  });
}
