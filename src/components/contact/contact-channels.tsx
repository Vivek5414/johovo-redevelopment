"use client";

import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { JOHOVO_CONTACT } from "@/lib/contact";
import { recordContactClick } from "@/lib/tracking";
import styles from "./contact-channels.module.css";

export function ContactChannels() {
  return (
    <div className={styles.channelsList}>
      {/* Phone */}
      <a
        className={styles.channelItem}
        href={`tel:${JOHOVO_CONTACT.phone}`}
        onClick={() => recordContactClick("call")}
      >
        <div className={styles.channelIconBox}>
          <PhoneRoundedIcon />
        </div>
        <div className={styles.channelMeta}>
          <span className={styles.channelLabel}>Customer Support</span>
          <strong className={styles.channelValue}>{JOHOVO_CONTACT.displayPhone}</strong>
        </div>
      </a>

      {/* WhatsApp */}
      <a
        className={styles.channelItem}
        href={`https://wa.me/${JOHOVO_CONTACT.whatsapp}`}
        onClick={() => recordContactClick("whatsapp")}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.channelIconBox} style={{ color: "#25d366" }}>
          <WhatsAppIcon />
        </div>
        <div className={styles.channelMeta}>
          <span className={styles.channelLabel}>Chat on WhatsApp</span>
          <strong className={styles.channelValue}>{JOHOVO_CONTACT.displayWhatsApp}</strong>
        </div>
      </a>
    </div>
  );
}
