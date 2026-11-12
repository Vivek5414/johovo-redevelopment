"use client";

import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { JOHOVO_CONTACT } from "@/lib/contact";
import { recordContactClick } from "@/lib/tracking";
import styles from "./home-sections.module.css";

export function HomeContactDetails() {
  return (
    <address className={styles.contactDetails}>
      <a
        href={`tel:${JOHOVO_CONTACT.phone}`}
        onClick={() => recordContactClick("call")}
      >
        <span aria-hidden="true" className={styles.contactIcon}>
          <PhoneRoundedIcon fontSize="small" />
        </span>
        <span>
          <small>Call our team</small>
          <strong>{JOHOVO_CONTACT.displayPhone}</strong>
        </span>
      </a>
      <a href={`mailto:${JOHOVO_CONTACT.email}`}>
        <span aria-hidden="true" className={styles.contactIcon}>
          <EmailRoundedIcon fontSize="small" />
        </span>
        <span>
          <small>Email support</small>
          <strong>{JOHOVO_CONTACT.email}</strong>
        </span>
      </a>
      <a
        href={`https://wa.me/${JOHOVO_CONTACT.whatsapp}`}
        onClick={() => recordContactClick("whatsapp")}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span aria-hidden="true" className={styles.contactIcon}>
          <WhatsAppIcon fontSize="small" />
        </span>
        <span>
          <small>WhatsApp support</small>
          <strong>{JOHOVO_CONTACT.displayWhatsApp}</strong>
        </span>
      </a>
    </address>
  );
}
