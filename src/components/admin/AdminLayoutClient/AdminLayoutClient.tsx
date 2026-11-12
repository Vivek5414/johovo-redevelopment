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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar
        adminEmail={admin.email}
        adminName={admin.name}
        adminRole={admin.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`${styles.mainContent} ${!sidebarOpen ? styles.mainContentExpanded : ""}`}>
        <AdminHeader
          adminEmail={admin.email}
          adminName={admin.name}
          onOpenMobileMenu={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />
        <main className={styles.pageBody}>{children}</main>
      </div>
    </div>
  );
}
