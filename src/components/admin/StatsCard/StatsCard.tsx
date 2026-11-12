import Link from "next/link";
import type { ElementType } from "react";
import styles from "./StatsCard.module.css";

type StatsCardProps = {
  title: string;
  value: number | string;
  subtext?: string;
  icon: ElementType;
  href?: string;
};

export function StatsCard({
  title,
  value,
  subtext,
  icon: Icon,
  href,
}: StatsCardProps) {
  const content = (
    <>
      <div className={styles.iconBox}>
        <Icon className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.value}>{value}</h3>
        <p className={styles.label}>{title}</p>
        {subtext ? <span className={styles.subtext}>{subtext}</span> : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link className={styles.card} href={href}>
        {content}
      </Link>
    );
  }

  return <div className={styles.card}>{content}</div>;
}
