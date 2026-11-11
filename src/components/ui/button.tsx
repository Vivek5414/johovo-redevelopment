import type { ButtonHTMLAttributes } from "react";
import styles from "./primitives.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
  size?: "regular" | "compact";
};

export function Button({
  children,
  className,
  size = "regular",
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[`button${variant[0].toUpperCase()}${variant.slice(1)}`],
    styles[`button${size[0].toUpperCase()}${size.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
