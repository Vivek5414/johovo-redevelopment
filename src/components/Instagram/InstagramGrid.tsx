import { InstagramCard } from "./InstagramCard";
import styles from "./InstagramGrid.module.css";

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

export function InstagramGrid({ posts }: { posts: InstagramPost[] }) {
  if (!posts.length) {
    return (
      <div className={styles.emptyState}>
        <p>Instagram posts will appear here once the community feed is added.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {posts.map((post) => (
        <InstagramCard key={post.id} post={post} />
      ))}
    </div>
  );
}
