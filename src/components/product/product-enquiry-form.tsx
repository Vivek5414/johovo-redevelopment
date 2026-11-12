"use client";

import { useState, type FormEvent } from "react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import styles from "./product-enquiry-form.module.css";

type ProductEnquiryFormProps = {
  productName: string;
};

export function ProductEnquiryForm({ productName }: ProductEnquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setStatus("error");
      setFeedbackMessage("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      setStatus("error");
      setFeedbackMessage("Please enter your phone number.");
      return;
    }

    if (!message.trim()) {
      setStatus("error");
      setFeedbackMessage("Please enter your question or message.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setFeedbackMessage("");

    try {
      const response = await fetch("/api/product-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit enquiry. Please try again.");
      }

      setStatus("success");
      setFeedbackMessage(
        `Thank you, ${name.trim()}! Your enquiry for "${productName}" has been received. Our Ayurvedic specialist will contact you soon.`
      );
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setFeedbackMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.enquiryFormWrapper}>
      {/* Product Highlight Badge */}
      <div className={styles.selectedProductPill}>
        <SpaRoundedIcon className={styles.productPillIcon} />
        <span className={styles.productPillLabel}>Enquiring About:</span>
        <span className={styles.productPillName}>{productName}</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Status Messages */}
        {status === "success" && (
          <div aria-live="polite" className={styles.alertSuccess}>
            <CheckCircleRoundedIcon className={styles.alertIcon} />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {status === "error" && (
          <div aria-live="assertive" className={styles.alertError}>
            <ErrorOutlineRoundedIcon className={styles.alertIcon} />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* 3-Column Field Grid */}
        <div className={styles.fieldsGrid}>
          {/* Name */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="enquiry-name">
              <span>Full Name</span>
            </label>
            <div className={styles.inputWrapper}>
              <PersonRoundedIcon className={styles.fieldIcon} />
              <input
                autoComplete="name"
                className={styles.input}
                id="enquiry-name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                type="text"
                value={name}
              />
            </div>
          </div>

          {/* Phone */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="enquiry-phone">
              <span>Phone Number</span>
            </label>
            <div className={styles.inputWrapper}>
              <PhoneRoundedIcon className={styles.fieldIcon} />
              <input
                autoComplete="tel"
                className={styles.input}
                id="enquiry-phone"
                name="phone"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                type="tel"
                value={phone}
              />
            </div>
          </div>

          {/* Email (Optional) */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="enquiry-email">
              <span>Email Address</span>
              <span className={styles.optionalBadge}>(Optional)</span>
            </label>
            <div className={styles.inputWrapper}>
              <EmailRoundedIcon className={styles.fieldIcon} />
              <input
                autoComplete="email"
                className={styles.input}
                id="enquiry-email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                value={email}
              />
            </div>
          </div>
        </div>

        {/* Message / Question */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="enquiry-message">
            <span>Your Question or Message</span>
          </label>
          <div className={styles.inputWrapper}>
            <ChatBubbleOutlineRoundedIcon
              className={`${styles.fieldIcon} ${styles.textareaIcon}`}
            />
            <textarea
              className={styles.textarea}
              id="enquiry-message"
              name="message"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about ingredients, skin suitability, routine usage, or order assistance..."
              required
              rows={4}
              value={message}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className={styles.formActions}>
          <button
            className={styles.submitBtn}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <span className={styles.btnSpinner} />
                <span>Submitting Enquiry...</span>
              </>
            ) : (
              <>
                <SendRoundedIcon />
                <span>Submit Product Enquiry</span>
              </>
            )}
          </button>
          <span className={styles.privacyGuarantee}>
            <span className={styles.guaranteeDot} />
            Saved securely in JOHOVO database. We respect your privacy.
          </span>
        </div>
      </form>
    </div>
  );
}
