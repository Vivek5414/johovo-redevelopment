import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./primitives.module.css";

type LinkButtonProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
    href: string;
    variant?: "primary" | "secondary" | "quiet";
    size?: "regular" | "compact";
  };

export function LinkButton({
  children,
  className,
  size = "regular",
  variant = "primary",
  ...props
}: LinkButtonProps) {
  const classes = [
    styles.button,
    styles[`button${variant[0].toUpperCase()}${variant.slice(1)}`],
    styles[`button${size[0].toUpperCase()}${size.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link className={classes} {...props}>
      {children}
    </Link>
  );
}
