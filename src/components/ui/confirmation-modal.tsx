"use client";

import { useEffect } from "react";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import styles from "./confirmation-modal.module.css";

type ConfirmationModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmationModal({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isConfirming = false,
  errorMessage,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
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

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        aria-modal="true"
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className={styles.iconWrap}>
          <DeleteOutlineRoundedIcon className={styles.icon} />
        </div>

        <p className={styles.eyebrow}>Confirmation</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose} type="button">
            {cancelText}
          </button>
          <button
            className={styles.confirmButton}
            disabled={isConfirming}
            onClick={onConfirm}
            type="button"
          >
            {isConfirming ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
