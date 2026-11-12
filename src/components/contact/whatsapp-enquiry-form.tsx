"use client";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useState, type FormEvent } from "react";
import { JOHOVO_CONTACT } from "@/lib/contact";
import styles from "./whatsapp-enquiry-form.module.css";

type Props = {
  products?: string[];
  initialProduct?: string;
  formId?: string;
  variant?: "default" | "premium";
};

export function WhatsAppEnquiryForm({
  products = [],
  initialProduct = "",
  formId,
  variant = "default",
}: Props) {
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const isPremium = variant === "premium";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const product = String(formData.get("product") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const lines = [
      "JOHOVO product enquiry",
      `Name: ${name}`,
      email ? `Email: ${email}` : "",
      isPremium
        ? `Product: ${product || "General Enquiry"}`
        : product
          ? `Product: ${product}`
          : "",
      `Message: ${message}`,
    ].filter(Boolean);

    setWhatsappUrl(
      `https://wa.me/${JOHOVO_CONTACT.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
    );
  }

  return (
    <form
      className={`${styles.form} ${isPremium ? styles.premium : ""}`}
      id={formId}
      onSubmit={handleSubmit}
    >
      {products.length ? (
        <label>
          Product
          <select
            defaultValue={
              isPremium && !initialProduct ? "General Enquiry" : initialProduct
            }
            name="product"
          >
            <option value={isPremium ? "General Enquiry" : ""}>
              General Enquiry
            </option>
            {products.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
        </label>
      ) : initialProduct ? (
        <>
          <input name="product" type="hidden" value={initialProduct} />
          <p className={styles.selectedProduct}>
            Product: <strong>{initialProduct}</strong>
          </p>
        </>
      ) : null}
      <div className={styles.fieldGrid}>
        <label>
          Name
          <input autoComplete="name" maxLength={100} name="name" required />
        </label>
        <label>
          <span>
            Email <span>(optional)</span>
          </span>
          <input
            autoComplete="email"
            maxLength={254}
            name="email"
            type="email"
          />
        </label>
      </div>
      <label>
        Message
        <textarea maxLength={2000} name="message" required rows={5} />
      </label>
      <button className={styles.submit} type="submit">
        {isPremium ? <WhatsAppIcon /> : null}
        {isPremium ? "Prepare WhatsApp Message" : "Prepare WhatsApp message"}
      </button>
      <p className={styles.disclaimer}>
        Prepare a message to open in WhatsApp. This website does not store form
        details.
      </p>
      {whatsappUrl ? (
        <p aria-live="polite" className={styles.status} role="status">
          Your message is ready.{" "}
          <a href={whatsappUrl} rel="noopener noreferrer" target="_blank">
            Open WhatsApp to send it
          </a>
        </p>
      ) : null}
    </form>
  );
}
