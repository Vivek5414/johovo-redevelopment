import type { HTMLAttributes } from "react";
import styles from "./primitives.module.css";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  elevation?: "flat" | "raised";
};

export function Card({
  children,
  className,
  elevation = "flat",
  ...props
}: CardProps) {
  const classes = [
    styles.card,
    styles[`card${elevation[0].toUpperCase()}${elevation.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
