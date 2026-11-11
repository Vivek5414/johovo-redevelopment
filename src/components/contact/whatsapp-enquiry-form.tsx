"use client";

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
        {isPremium ? (
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M20.2 11.6a8.2 8.2 0 0 1-12.1 7.2l-4.1 1.1 1.1-4a8.2 8.2 0 1 1 15.1-4.3Z" />
            <path d="M8.2 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.6.7c-.2.2-.1.4 0 .6.5.9 1.3 1.7 2.2 2.2.2.1.4.2.6 0l.7-.8c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .3-.1 1-.7 1.4-.5.4-1.2.6-2 .4-1-.2-2.3-.8-3.6-2-1.1-1-2-2.4-2.2-3.3-.3-.9 0-1.8.4-2.5Z" />
          </svg>
        ) : null}
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
