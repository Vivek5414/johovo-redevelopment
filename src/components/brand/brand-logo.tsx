import Image from "next/image";
import type { ProductBrandIdentity } from "@/lib/brand/identity";
import { brandNames } from "@/lib/brand/identity";
import styles from "./brand-logo.module.css";

type BrandLogoProps = {
  identity: ProductBrandIdentity;
  className?: string;
} & (
  | {
      src: string;
      width: number;
      height: number;
    }
  | {
      src?: undefined;
      width?: never;
      height?: never;
    }
);

export function BrandLogo({ identity, className, ...asset }: BrandLogoProps) {
  const classes = [styles.brand, styles[identity], className]
    .filter(Boolean)
    .join(" ");
  const image =
    "src" in asset && asset.src
      ? asset
      : identity === "johovo"
        ? {
            src: "/images/brand/johovo-logo.png",
            width: 2172,
            height: 724,
          }
        : null;

  if (image) {
    return (
      <Image
        alt={brandNames[identity]}
        className={`${classes} ${styles.image}`}
        height={image.height}
        unoptimized
        src={image.src}
        width={image.width}
      />
    );
  }

  return (
    <span className={`${classes} ${styles.textFallback}`}>
      {brandNames[identity]}
    </span>
  );
}
