"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Logo from "@/components/Logo";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your admin email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please verify credentials.");
      }

      // Successful login -> Navigate to Admin Dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        {/* Brand & Title */}
        <div className={styles.brandHeader}>
          <div className={styles.logoLink}>
            <Logo size="hero" />
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeText}>Admin Portal</span>
          </div>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to manage your website database &amp; catalog</p>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div aria-live="assertive" className={styles.errorBanner}>
            <ErrorOutlineRoundedIcon className={styles.errorIcon} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Email */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="admin-email">
              Admin Email
            </label>
            <div className={styles.inputWrapper}>
              <EmailRoundedIcon className={styles.fieldIcon} />
              <input
                autoComplete="email"
                className={styles.input}
                id="admin-email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@johovo.in"
                required
                type="email"
                value={email}
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="admin-password">
              Password
            </label>
            <div className={styles.inputWrapper}>
              <LockRoundedIcon className={styles.fieldIcon} />
              <input
                autoComplete="current-password"
                className={styles.input}
                id="admin-password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className={styles.togglePasswordBtn}
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? (
                  <VisibilityOffRoundedIcon className={styles.toggleIcon} />
                ) : (
                  <VisibilityRoundedIcon className={styles.toggleIcon} />
                )}
              </button>
            </div>
          </div>

          {/* Options: Remember Me */}
          <div className={styles.optionsRow}>
            <label className={styles.rememberMeLabel}>
              <input
                checked={rememberMe}
                className={styles.checkbox}
                name="rememberMe"
                onChange={(e) => setRememberMe(e.target.checked)}
                type="checkbox"
              />
              <span>Remember session (7 days)</span>
            </label>
          </div>

          {/* Submit */}
          <button
            className={styles.submitBtn}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <span className={styles.btnSpinner} />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LoginRoundedIcon />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <Link className={styles.backLink} href="/">
            ← Back to public website
          </Link>
        </div>
      </div>
    </main>
  );
}
