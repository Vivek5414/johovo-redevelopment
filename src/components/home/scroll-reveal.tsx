"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./home-sections.module.css";

export function ScrollReveal({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -24px 0px", threshold: 0.12 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`${styles.showcaseReveal} ${entered ? styles.showcaseRevealEntered : ""}`}
      ref={elementRef}
      style={{ "--showcase-order": index } as CSSProperties}
    >
      {children}
    </div>
  );
}