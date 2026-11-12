"use client";

import { useState, type ReactNode } from "react";
import { AdminSidebar } from "../AdminSidebar/AdminSidebar";
import { AdminHeader } from "../AdminHeader/AdminHeader";
import styles from "./AdminLayoutClient.module.css";

type AdminLayoutClientProps = {
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  children: ReactNode;
};

export function AdminLayoutClient({ admin, children }: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar
        adminEmail={admin.email}
        adminName={admin.name}
        adminRole={admin.role}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className={styles.mainContent}>
        <AdminHeader
          adminEmail={admin.email}
          adminName={admin.name}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className={styles.pageBody}>{children}</main>
      </div>
    </div>
  );
}
