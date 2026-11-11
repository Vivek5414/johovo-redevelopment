import { signOut } from "@/app/admin/actions";
import { BrandLogo } from "@/components/brand/brand-logo";
import styles from "./page.module.css";

export const metadata = {
  title: "Admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            <BrandLogo identity="johovo" />
          </p>
          <h1>Admin dashboard</h1>
        </div>
        <form action={signOut}>
          <button className={styles.signOut} type="submit">
            Sign out
          </button>
        </form>
      </header>
      <section aria-labelledby="setup-heading" className={styles.panel}>
        <p className={styles.status}>Foundation in progress</p>
        <h2 id="setup-heading">Your workspace is ready to be configured.</h2>
        <p>
          Catalogue and operational tools will be added in the next approved
          implementation phases.
        </p>
      </section>
    </main>
  );
}
