"use client";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { recordContactClick } from "@/lib/tracking";
import styles from "./product-details.module.css";

type WhatsAppDirectBuyLinkProps = {
  url: string;
  productName: string;
};

export function WhatsAppDirectBuyLink({ url, productName }: WhatsAppDirectBuyLinkProps) {
  return (
    <a
      aria-label={`Order ${productName} directly via WhatsApp`}
      className={`${styles.marketplaceCard} ${styles.whatsappCard}`}
      href={url}
      onClick={() => recordContactClick("whatsapp")}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className={styles.whatsappLogo}>
        <WhatsAppIcon className={styles.whatsappIcon} />
        <span>WhatsApp</span>
      </div>
      <span className={styles.fastTag}>Direct Chat</span>
      <span className={styles.marketplaceAction}>
        <span>Order Now</span>
        <OpenInNewRoundedIcon className={styles.marketplaceIcon} />
      </span>
    </a>
  );
}
