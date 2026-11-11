import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/app/admin/actions";
import { BrandLogo } from "@/components/brand/brand-logo";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Administrator sign in",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const message =
    error === "unauthorized"
      ? "This account does not have administrator access."
      : error === "invalid"
        ? "The email or password could not be verified."
        : null;

  return (
    <main className={styles.main}>
      <Link aria-label="JOHOVO home" className={styles.brand} href="/">
        <BrandLogo identity="johovo" />
      </Link>
      <section aria-labelledby="login-heading" className={styles.panel}>
        <p className={styles.eyebrow}>Secure workspace</p>
        <h1 id="login-heading">Administrator sign in</h1>
        <p className={styles.description}>
          Sign in with an account that has been granted administrator access.
        </p>
        {message ? (
          <p aria-live="polite" className={styles.error}>
            {message}
          </p>
        ) : null}
        <form action={signIn} className={styles.form}>
          <label htmlFor="email">Email</label>
          <input
            autoComplete="username"
            id="email"
            name="email"
            required
            type="email"
          />
          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            required
            type="password"
          />
          <button type="submit">Sign in</button>
        </form>
        <p className={styles.notice}>
          Administrator accounts are created by an authorized owner. Public
          sign-up is not available.
        </p>
      </section>
    </main>
  );
}
