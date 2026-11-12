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
  className?: string;
};

export function BackButton({
  href = "/",
  label = "Back to Home",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link className={styles.backButton} href={href}>
      <span className={styles.backButtonIconWrapper}>
        <ArrowBackRoundedIcon className={styles.backIcon} />
      </span>
      <span className={styles.backButtonLabel}>{label}</span>
    </Link>
  );
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const safeItems = items.filter((item) => item.label);

  if (safeItems.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb navigation" className={styles.breadcrumbs}>
      <ol className={styles.breadcrumbList}>
        {safeItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === safeItems.length - 1;
          const isCurrent = item.current || isLast;

          return (
            <li className={styles.breadcrumbItem} key={`${item.label}-${index}`}>
              {item.href && !isCurrent ? (
                <Link className={styles.breadcrumbLink} href={item.href}>
                  {isFirst ? (
                    <HomeRoundedIcon className={styles.homeIcon} />
                  ) : null}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={styles.breadcrumbCurrent}
                >
                  {isFirst ? (
                    <HomeRoundedIcon className={styles.homeIcon} />
                  ) : null}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLast ? (
                <NavigateNextRoundedIcon
                  aria-hidden="true"
                  className={styles.separator}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageNavigation({
  items,
  backHref = "/",
  backLabel = "Back to Home",
  className,
}: PageNavigationProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
      <BackButton href={backHref} label={backLabel} />
      <Breadcrumbs items={items} />
    </div>
  );
}
