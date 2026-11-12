import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
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
  return <SpaRoundedIcon aria-hidden="true" className={className} />;
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
