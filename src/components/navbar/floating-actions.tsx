"use client";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { recordContactClick } from "@/lib/tracking";
import styles from "./floating-actions.module.css";
import navbarData from "./navbar-data.json";

export function FloatingActions() {
  const { contact, floatingActions } = navbarData;

  if (!floatingActions.enabled) return null;

  const whatsappMessage = encodeURIComponent(contact.defaultWhatsAppMessage);
  const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${whatsappMessage}`;
  const callUrl = `tel:${contact.phone}`;

  return (
    <aside aria-label="Quick contact actions" className={styles.floatingActions}>
      {/* WhatsApp Button */}
      <a
        aria-label={`${floatingActions.whatsapp.label} - ${contact.displayWhatsApp}`}
        className={`${styles.actionButton} ${styles.whatsappButton}`}
        href={whatsappUrl}
        onClick={() => recordContactClick("whatsapp")}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WhatsAppIcon className={styles.icon} />
        <span className={styles.labelTooltip}>{floatingActions.whatsapp.tooltip}</span>
      </a>

      {/* Call Button */}
      <a
        aria-label={`${floatingActions.call.label} - ${contact.displayPhone}`}
        className={`${styles.actionButton} ${styles.callButton}`}
        href={callUrl}
        onClick={() => recordContactClick("call")}
      >
        <PhoneRoundedIcon className={styles.icon} />
        <span className={styles.labelTooltip}>{floatingActions.call.tooltip}</span>
      </a>
    </aside>
  );
}
