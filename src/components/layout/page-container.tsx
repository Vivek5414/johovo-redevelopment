import type { HTMLAttributes, ReactNode } from "react";
import styles from "./page-container.module.css";

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  width?: "content" | "reading";
};

export function PageContainer({
  children,
  className,
  width = "content",
  ...props
}: PageContainerProps) {
  const classes = [styles.container, styles[width], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
