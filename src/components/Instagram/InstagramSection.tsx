import Link from "next/link";
import InstagramRoundedIcon from "@mui/icons-material/Instagram";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { ContentSection } from "@/components/layout/content-section";
import { PageContainer } from "@/components/layout/page-container";
import { InstagramGrid } from "./InstagramGrid";
import styles from "./InstagramSection.module.css";
import instagramData from "@/data/instagram.json";

type InstagramAccount = {
  username: string;
  profileUrl: string;
  title: string;
  description: string;
};

type InstagramPost = {
  id: string;
  url?: string;
  postUrl?: string;
  type: "post" | "reel";
  thumbnail?: string;
  imageUrl?: string;
  alt?: string;
  enabled: boolean;
};

export function getEnabledInstagramPosts(posts: InstagramPost[] = []) {
  return posts.filter((post) => post.enabled && (post.url || post.postUrl));
}

export function isValidInstagramUrl(url: string) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("instagram.com");
  } catch {
    return false;
  }
}

export function getInstagramEmbedUrl(url: string) {
  if (!isValidInstagramUrl(url)) {
    return "";
  }

  return `https://www.instagram.com/p/${url.split("/p/")[1]?.split("/")[0] ?? ""}/embed`;
}

export function InstagramSection() {
  const account = (instagramData as { account: InstagramAccount }).account;
  const posts = getEnabledInstagramPosts((instagramData as { posts: InstagramPost[] }).posts ?? []);

  return (
    <ContentSection className={styles.section} id="instagram">
      <PageContainer className={styles.wrapper}>
        <div className={styles.headingRow}>
          <p className={styles.eyebrow}>Instagram</p>
          <h2 id="instagram-showcase-title">Follow us for fresh herbal inspiration</h2>
        </div>

        <div className={styles.metaRow}>
          <Link className={styles.profilePill} href={account.profileUrl} rel="noopener noreferrer" target="_blank">
            <span className={styles.profileIcon} aria-hidden="true">
              <InstagramRoundedIcon fontSize="small" />
            </span>
            @{account.username}
          </Link>

          <Link className={styles.viewAllLink} href="/johovoinsta" prefetch>
            View all posts
            <ArrowForwardRoundedIcon fontSize="small" />
          </Link>
        </div>

        <p className={styles.description}>{account.description}</p>

        <InstagramGrid posts={posts.slice(0, 5)} />
      </PageContainer>
    </ContentSection>
  );
}
