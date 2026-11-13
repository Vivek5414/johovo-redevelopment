"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import ContactMailRoundedIcon from "@mui/icons-material/ContactMailRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Logo from "@/components/Logo";
import styles from "./AdminSidebar.module.css";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: DashboardRoundedIcon },
  { label: "Products Catalog", href: "/admin/products", icon: Inventory2RoundedIcon },
  { label: "Add Product", href: "/admin/products/new", icon: AddCircleOutlineRoundedIcon },
  { label: "Categories", href: "/admin/categories", icon: CategoryRoundedIcon },
  { label: "Product Enquiries", href: "/admin/product-enquiries", icon: QuestionAnswerRoundedIcon },
  { label: "Contact Enquiries", href: "/admin/contact-enquiries", icon: ContactMailRoundedIcon },
  { label: "Receipts & Invoices", href: "/admin/receipts", icon: ReceiptLongRoundedIcon },
  { label: "Create Receipt", href: "/admin/receipt", icon: ReceiptLongRoundedIcon },
  { label: "WhatsApp Click Logs", href: "/admin/whatsapp-clicks", icon: WhatsAppIcon },
  { label: "Call Click Logs", href: "/admin/call-clicks", icon: CallRoundedIcon },
  // Uploaded Files commented as requested
  // { label: "Uploaded Files", href: "/admin/files", icon: CloudUploadRoundedIcon },
];

type AdminSidebarProps = {
  adminName: string;
  adminEmail: string;
  adminRole: string;
  isOpen?: boolean;
  onClose?: () => void;
};

export function AdminSidebar({
  adminName,
  adminRole,
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/admin/login";
    }
  };

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarCollapsed}`}>
        {/* Brand */}
        <div className={styles.brandArea}>
          <div className={styles.brandLink}>
            <Logo size="header" />
          </div>
          <button
            aria-label="Collapse sidebar"
            className={styles.closeMobileBtn}
            onClick={onClose}
            title="Collapse sidebar"
            type="button"
          >
            <CloseRoundedIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.navSection}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                href={item.href}
                key={item.href}
                onClick={onClose}
              >
                <Icon className={styles.navIcon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className={styles.userFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userMeta}>
              <span className={styles.userName}>{adminName}</span>
              <span className={styles.userRole}>{adminRole}</span>
            </div>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            type="button"
          >
            <LogoutRoundedIcon className={styles.logoutIcon} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
