import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.css";

type LogoProps = {
  className?: string;
  size?: "header" | "footer" | "hero";
};

export default function Logo({
  className,
  size = "header",
}: LogoProps) {
  const imageClassName = [
    styles.image,
    size === "footer" ? styles.footerImage : null,
    size === "hero" ? styles.heroImage : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href="/"
      className={[styles.logo, className].filter(Boolean).join(" ")}
      aria-label="JOHOVO home"
    >
      <Image
        alt="JOHOVO"
        className={imageClassName}
        height={724}
        preload={size === "header"}
        sizes={
          size === "footer"
            ? "(max-width: 480px) 120px, (max-width: 940px) 135px, 150px"
            : size === "hero"
              ? "(max-width: 480px) 70px, (max-width: 940px) 112px, 210px"
              : "(max-width: 480px) 125px, (max-width: 940px) 145px, 170px"
        }
        src="/images/brand/johovo-logo.png"
        unoptimized
        width={2172}
      />
    </Link>
  );
}
