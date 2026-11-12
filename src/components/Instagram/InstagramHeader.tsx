import Link from "next/link";
import InstagramRoundedIcon from "@mui/icons-material/Instagram";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import styles from "./InstagramHeader.module.css";

type AccountInfo = {
  username: string;
  profileUrl: string;
  title: string;
  description: string;
};

export function InstagramHeader({ account }: { account: AccountInfo }) {
  return (
    <div className={styles.header}>
      <div className={styles.profileChip}>
        <span className={styles.profileIcon} aria-hidden="true">
          <InstagramRoundedIcon fontSize="small" />
        </span>
        @{account.username}
      </div>

      <h1 className={styles.title}>{account.title}</h1>
      <p className={styles.description}>{account.description}</p>

      <div className={styles.actions}>
        <Link className={styles.primaryButton} href={account.profileUrl} rel="noopener noreferrer" target="_blank">
          Follow on Instagram
        </Link>
        <Link className={styles.secondaryButton} href="/" prefetch>
          Back to Home
          <ArrowForwardRoundedIcon fontSize="small" />
        </Link>
      </div>
    </div>
  );
}
