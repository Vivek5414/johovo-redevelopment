import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import styles from "./QuickActions.module.css";

type QuickActionsProps = {
  phone?: string | null;
  email?: string | null;
  customerName?: string;
  productName?: string;
};

export function LeadQuickActions({
  phone,
  email,
  customerName = "Customer",
  productName,
}: QuickActionsProps) {
  const cleanPhone = phone ? phone.replace(/\D/g, "") : "";
  const whatsappNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsappText = encodeURIComponent(
    `Hello ${customerName}, thank you for enquiring with JOHOVO${productName ? ` regarding "${productName}"` : ""}. How can we assist you today?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  return (
    <div className={styles.actionsGroup}>
      {phone ? (
        <>
          <a
            aria-label={`Call ${customerName}`}
            className={`${styles.actionBtn} ${styles.callBtn}`}
            href={`tel:${phone}`}
            title={`Call ${phone}`}
          >
            <PhoneRoundedIcon className={styles.icon} />
          </a>
          <a
            aria-label={`WhatsApp ${customerName}`}
            className={`${styles.actionBtn} ${styles.whatsappBtn}`}
            href={whatsappUrl}
            rel="noopener noreferrer"
            target="_blank"
            title={`Chat on WhatsApp (${phone})`}
          >
            <WhatsAppIcon className={styles.icon} />
          </a>
        </>
      ) : null}

      {email ? (
        <a
          aria-label={`Email ${customerName}`}
          className={`${styles.actionBtn} ${styles.mailBtn}`}
          href={`mailto:${email}?subject=${encodeURIComponent(`JOHOVO Enquiry Follow-up${productName ? ` - ${productName}` : ""}`)}`}
          title={`Email ${email}`}
        >
          <EmailRoundedIcon className={styles.icon} />
        </a>
      ) : null}
    </div>
  );
}
