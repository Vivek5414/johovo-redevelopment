import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient/AdminLayoutClient";

export const metadata: Metadata = {
  title: "JOHOVO Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <AdminLayoutClient admin={admin}>
      {children}
    </AdminLayoutClient>
  );
}
