import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import Link from "next/link";
import styles from "./page-navigation.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

type PageNavigationProps = {
  items: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
};

export function BackButton({ href = "/", label = "Back" }: { href?: string; label?: string }) {
  return (
    <Link className={styles.backButton} href={href}>
      <ArrowBackRoundedIcon fontSize="small" />
      <span>{label}</span>
    </Link>
  );
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const safeItems = items.filter((item) => item.label);

  if (safeItems.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.breadcrumbList}>
        {safeItems.map((item, index) => {
          const isLast = index === safeItems.length - 1;
          const content = item.href && !item.current ? (
            <Link className={styles.breadcrumbLink} href={item.href}>
              {item.label}
            </Link>
          ) : (
            <span aria-current={item.current ? "page" : undefined} className={styles.breadcrumbCurrent}>
              {item.label}
            </span>
          );

          return (
            <li className={styles.breadcrumbItem} key={`${item.label}-${index}`}>
              {content}
              {!isLast ? <NavigateNextRoundedIcon className={styles.separator} fontSize="inherit" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageNavigation({ items, backHref = "/", backLabel = "Back" }: PageNavigationProps) {
  return (
    <div className={styles.wrapper}>
      <BackButton href={backHref} label={backLabel} />
      <Breadcrumbs items={items} />
    </div>
  );
}
