"use client";

import Image from "next/image";
import { useState } from "react";
import type { CatalogImage } from "@/lib/catalog/migrated-catalog";
import styles from "./product-gallery.module.css";

export function ProductGallery({
  images,
  productName,
}: {
  images: CatalogImage[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (!selectedImage) {
    return (
      <div className={styles.emptyGallery}>
        Product photographs are unavailable.
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <Image
          key={selectedImage.src}
          alt={selectedImage.alt || productName}
          className={styles.mainAsset}
          fill
          loading="eager"
          sizes="(max-width: 800px) 100vw, 50vw"
          src={selectedImage.src}
        />
      </div>
      {images.length > 1 ? (
        <div aria-label={`${productName} product images`} className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-pressed={selectedIndex === index}
              className={`${styles.thumbnail} ${selectedIndex === index ? styles.selected : ""}`}
              key={image.src}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              <Image
                alt=""
                fill
                sizes="80px"
                src={image.src}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
