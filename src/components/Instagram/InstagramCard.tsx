"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import InstagramRoundedIcon from "@mui/icons-material/Instagram";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import styles from "./InstagramCard.module.css";

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

export function InstagramCard({ post }: { post: InstagramPost }) {
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(() => {
    const initialValue = post.imageUrl ?? post.thumbnail ?? "";
    if (typeof initialValue === "string" && initialValue.startsWith("http")) {
      return `/api/instagram/proxy?url=${encodeURIComponent(initialValue)}`;
    }
    return "";
  });
  const isReel = post.type === "reel";
  const postUrl = post.postUrl ?? post.url ?? "";

  const resolveProxyUrl = (source?: string) => {
    if (typeof source !== "string" || !source.startsWith("http")) {
      return "";
    }

    return `/api/instagram/proxy?url=${encodeURIComponent(source)}`;
  };

  const loadThumbnail = async () => {
    setIsLoading(true);
    setThumbnailUrl("");

    if (!postUrl) {
      const fallbackUrl = resolveProxyUrl(post.imageUrl ?? post.thumbnail);
      if (fallbackUrl) {
        setThumbnailUrl(fallbackUrl);
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/instagram/thumbnail?url=${encodeURIComponent(postUrl)}`);
      if (!response.ok) {
        const fallbackUrl = resolveProxyUrl(post.imageUrl ?? post.thumbnail);
        if (fallbackUrl) {
          setThumbnailUrl(fallbackUrl);
        }
        setIsLoading(false);
        return;
      }

      const payload = (await response.json()) as { thumbnail?: string };
      const nextUrl = payload.thumbnail ? resolveProxyUrl(payload.thumbnail) : resolveProxyUrl(post.imageUrl ?? post.thumbnail);
      if (nextUrl) {
        setThumbnailUrl(nextUrl);
      } else {
        setThumbnailUrl("");
      }
      setIsLoading(false);
    } catch {
      const fallbackUrl = resolveProxyUrl(post.imageUrl ?? post.thumbnail);
      if (fallbackUrl) {
        setThumbnailUrl(fallbackUrl);
      } else {
        setThumbnailUrl("");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadThumbnail();
  }, [postUrl, post.imageUrl, post.thumbnail]);

  const handleImageError = async () => {
    setIsLoading(false);
    setThumbnailUrl("");
    await loadThumbnail();
  };

  const handleShare = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!postUrl) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: "JOHOVO Instagram post",
          text: "Check out this JOHOVO post.",
          url: postUrl,
        });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(postUrl);
      }
    } catch {
      // Share can be cancelled by the user; ignore it silently.
    }
  };

  return (
    <article className={styles.card}>
      <Link
        aria-label={`Open ${post.type} on Instagram`}
        className={styles.previewLink}
        href={postUrl || "#"}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className={styles.imageWrap}>
          {isLoading ? (
            <span className={styles.skeleton} aria-label="Loading Instagram post preview" />
          ) : thumbnailUrl ? (
            <img
              alt={post.alt ?? "Instagram post preview"}
              className={styles.image}
              loading="lazy"
              onError={handleImageError}
              onLoad={() => setIsLoading(false)}
              referrerPolicy="no-referrer"
              src={thumbnailUrl}
            />
          ) : (
            <span className={styles.placeholder} aria-label="Instagram post preview placeholder">
              <InstagramRoundedIcon fontSize="large" />
            </span>
          )}
          <span className={styles.overlay} aria-hidden="true" />
          <span className={styles.iconBadge} aria-hidden="true">
            {isReel ? <PlayCircleRoundedIcon fontSize="small" /> : <InstagramRoundedIcon fontSize="small" />}
          </span>
          {isReel ? <span className={styles.reelPill}>Reel</span> : null}
        </span>
      </Link>

      <div className={styles.actions}>
        <button
          aria-label={liked ? "Unlike this post" : "Like this post"}
          className={liked ? styles.likeButtonActive : styles.likeButton}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setLiked((current) => !current);
          }}
          type="button"
        >
          {liked ? <FavoriteRoundedIcon fontSize="small" /> : <FavoriteBorderRoundedIcon fontSize="small" />}
          <span>{liked ? "Liked" : "Like"}</span>
        </button>

        <button
          aria-label="Share this post"
          className={styles.shareButton}
          onClick={handleShare}
          type="button"
        >
          <ShareRoundedIcon fontSize="small" />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}
