import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { InstagramGrid } from "@/components/Instagram/InstagramGrid";
import { InstagramHeader } from "@/components/Instagram/InstagramHeader";
import { getEnabledInstagramPosts } from "@/components/Instagram/InstagramSection";
import { SiteHeader } from "@/components/site-header";
import instagramData from "@/data/instagram.json";
import styles from "./page.module.css";

type AccountInfo = {
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

export const metadata: Metadata = {
  title: "JOHOVO Instagram | Follow Us",
  description: "Follow JOHOVO on Instagram for herbal beauty inspiration, botanical rituals and everyday skincare ideas.",
};

export default function JohovoInstaPage() {
  const account = (instagramData as { account: AccountInfo }).account;
  const posts = getEnabledInstagramPosts((instagramData as { posts: InstagramPost[] }).posts ?? []);

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <PageContainer className={styles.container}>
          <InstagramHeader account={account} />
          <section className={styles.gallerySection} aria-labelledby="johovo-instagram-grid-title">
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Community moments</p>
              <h2 id="johovo-instagram-grid-title">Fresh from our feed</h2>
            </div>
            <InstagramGrid posts={posts} />
          </section>
        </PageContainer>
      </main>
      <SiteFooter />
    </>
  );
}
