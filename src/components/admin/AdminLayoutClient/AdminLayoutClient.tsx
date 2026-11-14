"use client";

import { useState, useEffect, type ReactNode } from "react";
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
  // Check localStorage if user explicitly closed the sidebar on desktop/laptop
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Only restore preference on desktop/laptop (width > 1024)
    if (typeof window !== "undefined" && window.innerWidth > 1024) {
      const saved = localStorage.getItem("admin_sidebar_open");
      if (saved !== null) {
        setSidebarOpen(saved === "true");
      } else {
        setSidebarOpen(true);
      }
    }
  }, []);

  const handleToggle = (open: boolean) => {
    setSidebarOpen(open);
    if (typeof window !== "undefined" && window.innerWidth > 1024) {
      localStorage.setItem("admin_sidebar_open", String(open));
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar
        adminEmail={admin.email}
        adminName={admin.name}
        adminRole={admin.role}
        isOpen={sidebarOpen}
        onClose={() => handleToggle(false)}
      />

      <div className={`${styles.mainContent} ${!sidebarOpen ? styles.mainContentExpanded : ""}`}>
        <AdminHeader
          adminEmail={admin.email}
          adminName={admin.name}
          onOpenMobileMenu={() => handleToggle(true)}
          sidebarOpen={sidebarOpen}
        />
        <main className={styles.pageBody}>{children}</main>
      </div>
    </div>
  );
}
