import type { HTMLAttributes } from "react";
import styles from "./primitives.module.css";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "johovo" | "herbal";
};

export function Badge({
  children,
  className,
  tone = "neutral",
  ...props
}: BadgeProps) {
  const classes = [styles.badge, styles[`badge${tone[0].toUpperCase()}${tone.slice(1)}`], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
