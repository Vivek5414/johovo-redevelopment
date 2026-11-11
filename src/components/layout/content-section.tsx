import type { ComponentPropsWithoutRef } from "react";
import styles from "./content-section.module.css";

type ContentSectionProps = ComponentPropsWithoutRef<"section"> & {
  tone?: "default" | "neutral" | "herbal";
};

export function ContentSection({
  children,
  className,
  tone = "default",
  ...props
}: ContentSectionProps) {
  const toneClass = tone === "default" ? undefined : styles[tone];
  const classes = [styles.section, toneClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} {...props}>
      {children}
    </section>
  );
}
