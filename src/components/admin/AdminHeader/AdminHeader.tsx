"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import styles from "./AdminHeader.module.css";

type AdminHeaderProps = {
  adminEmail: string;
  adminName: string;
  onOpenMobileMenu?: () => void;
};

const TITLE_MAP: Record<string, string> = {
  "/admin/dashboard": "Dashboard Overview",
  "/admin/products": "Products Catalog",
  "/admin/categories": "Categories",
  "/admin/product-enquiries": "Product Enquiries",
  "/admin/contact-enquiries": "Contact Form Enquiries",
  "/admin/whatsapp-clicks": "WhatsApp Click Events",
  "/admin/call-clicks": "Call Click Events",
  "/admin/files": "Uploaded Cloud Files",
};

export function AdminHeader({
  adminEmail,
  adminName,
  onOpenMobileMenu,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const title = TITLE_MAP[pathname] || "Admin Control";

  return (
    <header className={styles.header}>
      <div className={styles.leftGroup}>
        <button
          aria-label="Toggle navigation menu"
          className={styles.menuToggleBtn}
          onClick={onOpenMobileMenu}
          type="button"
        >
          <MenuRoundedIcon />
        </button>
        <div className={styles.titleArea}>
          <div className={styles.breadcrumbs}>
            <span>Admin</span>
            <span>/</span>
            <span>{title}</span>
          </div>
          <h1 className={styles.pageTitle}>{title}</h1>
        </div>
      </div>

      <div className={styles.rightGroup}>
        <Link
          aria-label="Open live customer website"
          className={styles.siteLink}
          href="/"
          target="_blank"
        >
          <span>Live Site</span>
          <OpenInNewRoundedIcon className={styles.siteIcon} />
        </Link>

        <div className={styles.adminProfilePill}>
          <div className={styles.avatarMini}>
            {adminName.charAt(0).toUpperCase()}
          </div>
          <span className={styles.adminEmailText}>{adminEmail}</span>
        </div>
      </div>
    </header>
  );
}
