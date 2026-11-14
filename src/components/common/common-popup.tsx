"use client";

import { useEffect } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import styles from "./common-popup.module.css";

type CommonPopupProps = {
  open: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export function CommonPopup({
  open,
  title,
  message,
  type = "info",
  onClose,
}: CommonPopupProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const Icon =
    type === "success"
      ? CheckCircleRoundedIcon
      : type === "error"
        ? ErrorOutlineRoundedIcon
        : InfoRoundedIcon;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        aria-modal="true"
        className={`${styles.modal} ${styles[type]}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button className={styles.closeButton} onClick={onClose} type="button" aria-label="Close popup">
          <CloseRoundedIcon fontSize="small" />
        </button>

        <div className={styles.iconWrap}>
          <Icon className={styles.icon} />
        </div>

        <p className={styles.eyebrow}>{type === "success" ? "Success" : type === "error" ? "Attention" : "Notice"}</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <button className={styles.actionButton} onClick={onClose} type="button">
          OK
        </button>
      </div>
    </div>
  );
}
