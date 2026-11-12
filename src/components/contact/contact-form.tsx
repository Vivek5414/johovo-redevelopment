"use client";

import { useState } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import styles from "./contact-form.module.css";

type ContactFormProps = {
  products?: string[];
  initialProduct?: string;
};

const DEFAULT_PRODUCTS = [
  "IyalMooligai Herbal Face Pack",
  "IyalMooligai Herbal Hair Oil",
  "Premium Rose Body Scrub",
  "Premium Rose Body Lotion",
  "Premium Rose Body Wash",
  "General Skincare & Haircare Enquiry",
];

export function ContactForm({
  products = DEFAULT_PRODUCTS,
  initialProduct = "",
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState(initialProduct);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Please enter your name.");
      setStatus("error");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      setStatus("error");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: email.trim() || null,
          phone,
          product: product || null,
          message: message.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setProduct("");
      setMessage("");
    } catch (err: unknown) {
      console.error("Submission error:", err);
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <div className={styles.formCard}>
        <div className={styles.successCard}>
          <div className={styles.successIconWrapper}>
            <CheckCircleRoundedIcon className={styles.successIcon} />
          </div>
          <h3 className={styles.successTitle}>Enquiry Received!</h3>
          <p className={styles.successMessage}>
            Thank you for reaching out. Your enquiry has been securely saved to our database, and our herbal wellness team will get back to you shortly.
          </p>
          <button
            className={styles.resetButton}
            onClick={() => setStatus("idle")}
            type="button"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formCard}>
        <form className={styles.formGrid} onSubmit={handleSubmit}>
          {status === "error" ? (
            <div className={styles.errorAlert} role="alert">
              <ErrorOutlineRoundedIcon className={styles.errorIcon} />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          {/* Row 1: Name and Phone */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="contact-name">
                Your Name <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <PersonRoundedIcon className={styles.fieldIcon} />
                <input
                  autoComplete="name"
                  className={styles.input}
                  id="contact-name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  type="text"
                  value={name}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="contact-phone">
                Phone Number <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <PhoneRoundedIcon className={styles.fieldIcon} />
                <input
                  autoComplete="tel"
                  className={styles.input}
                  id="contact-phone"
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  required
                  type="tel"
                  value={phone}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Gmail (Optional) and Product Dropdown */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="contact-email">
                Gmail / Email <span className={styles.optionalTag}>(Optional)</span>
              </label>
              <div className={styles.inputWrapper}>
                <EmailRoundedIcon className={styles.fieldIcon} />
                <input
                  autoComplete="email"
                  className={styles.input}
                  id="contact-email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  type="email"
                  value={email}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="contact-product">
                Select Product <span className={styles.optionalTag}>(Optional)</span>
              </label>
              <div className={styles.inputWrapper}>
                <SpaRoundedIcon className={styles.fieldIcon} />
                <select
                  className={styles.select}
                  id="contact-product"
                  name="product"
                  onChange={(e) => setProduct(e.target.value)}
                  value={product}
                >
                  <option value="">-- Choose a product or category --</option>
                  {products.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Message */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="contact-message">
              Your Message <span className={styles.optionalTag}>(Optional)</span>
            </label>
            <div className={styles.inputWrapper}>
              <ChatBubbleOutlineRoundedIcon className={styles.fieldIconTop} />
              <textarea
                className={styles.textarea}
                id="contact-message"
                name="message"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist your herbal care routine today?"
                rows={4}
                value={message}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            className={styles.submitButton}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <span>Submit Enquiry</span>
                <SendRoundedIcon className={styles.submitIcon} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
