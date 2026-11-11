import type { HTMLAttributes, ReactNode } from "react";
import { ProductBrandSignature } from "./product-brand-signature";
import styles from "./herbal-botanical-pattern.module.css";

const approvedHerbalLogo = {
  src: "/images/iyalmooligai-logo.png",
  width: 1536,
  height: 1024,
};

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function BotanicalSprig({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 64 64"
    >
      <path
        d="M10 55C28 46 39 31 51 9M20 47c-8 0-13-5-14-12 8-1 14 3 16 10m8-10c-1-8 3-14 10-17 3 8 0 14-7 19m-2 2c-8-3-14-1-18 6 7 5 14 4 20-2m8-15c-1-7 2-12 8-15 3 6 1 12-5 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="55" r="2" fill="var(--color-herbal-gold)" />
      <circle cx="51" cy="9" r="2" fill="var(--color-brand-pink)" />
    </svg>
  );
}

export function HerbalBrandSignature({
  className,
  logo = approvedHerbalLogo,
}: {
  className?: string;
  logo?: {
    src: string;
    width: number;
    height: number;
  };
}) {
  return (
    <span className={[styles.signature, className].filter(Boolean).join(" ")}>
      <BotanicalSprig className={styles.signatureSprig} />
      <ProductBrandSignature identity="iyalmooligai" logo={logo} />
      <BotanicalSprig
        className={`${styles.signatureSprig} ${styles.signatureSprigFlipped}`}
      />
    </span>
  );
}

export function HerbalBotanicalPanel({
  children,
  className,
  ...props
}: PanelProps) {
  return (
    <div
      className={[styles.panel, className].filter(Boolean).join(" ")}
      {...props}
    >
      <BotanicalSprig className={`${styles.panelSprig} ${styles.panelTop}`} />
      <div className={styles.panelContent}>{children}</div>
      <BotanicalSprig
        className={`${styles.panelSprig} ${styles.panelBottom}`}
      />
    </div>
  );
}
