import type { InputHTMLAttributes } from "react";
import styles from "./primitives.module.css";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({
  "aria-describedby": externalDescription,
  className,
  error,
  hint,
  id,
  label,
  ...inputProps
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [externalDescription, hintId, errorId]
    .filter(Boolean)
    .join(" ");
  const classes = [styles.input, error && styles.inputInvalid, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        {...inputProps}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : inputProps["aria-invalid"]}
        className={classes}
        id={id}
      />
      {hint ? (
        <span className={styles.fieldHint} id={hintId}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className={styles.fieldError} id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
