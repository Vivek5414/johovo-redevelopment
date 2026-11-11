import Image from "next/image";
import Link from "next/link";
import { getShowcaseProduct } from "@/lib/catalog/showcase-products";
import styles from "./reference-homepage.module.css";

const featuredHairOil = getShowcaseProduct(
  "johovo-iyalmooligai-herbal-hair-oil",
);

export function ReferenceHomepage() {
  return (
    <main aria-label="JOHOVO homepage promotion" className={styles.referenceBody}>
      <div className={styles.bannerViewport}>
        <Image
          alt="JOHOVO skincare promotion with a model, product features, and featured IyalMooligai Herbal Hair Oil"
          className={styles.referenceImage}
          height={941}
          preload
          sizes="100vw"
          src="/images/reference-homepage-featured.png"
          unoptimized
          width={1672}
        />
      </div>
      <nav aria-label="Featured products" className={styles.productLinks}>
        <Link
          aria-label="View IyalMooligai Herbal Hair Oil, currently ₹720, originally ₹840"
          className={`${styles.productLink} ${styles.hairOilLink}`}
          href="/products/johovo-iyalmooligai-herbal-hair-oil"
        >
          <span className={styles.featuredProductCopy}>
            <span className={styles.featuredProductName}>
              IyalMooligai
              <br />
              Herbal Hair Oil
            </span>
            <span className={styles.featuredProductPrices}>
              <span>₹720</span>
              <del>₹840</del>
            </span>
          </span>
        </Link>
        <Link
          aria-label="View Orange Face Pack"
          className={`${styles.productLink} ${styles.orangeFacePackLink}`}
          href="/products/johovo-premium-orange-face-pack-brighten-and-nourish-your-skin"
        />
      </nav>
      <Link
        aria-label="View IyalMooligai Herbal Hair Oil, currently ₹720, originally ₹840"
        className={styles.mobileHairOilCard}
        href="/products/johovo-iyalmooligai-herbal-hair-oil"
      >
        {featuredHairOil ? (
          <span className={styles.mobileHairOilImageFrame}>
            <Image
              alt=""
              className={styles.mobileHairOilImage}
              fill
              loading="eager"
              sizes="(max-width: 430px) calc(100vw - 32px), 360px"
              src={featuredHairOil.imageSrc}
            />
          </span>
        ) : null}
        <span className={styles.mobileHairOilCopy}>
          <span className={styles.featuredProductName}>
            IyalMooligai
            <br />
            Herbal Hair Oil
          </span>
          <span className={styles.featuredProductPrices}>
            <span>₹720</span>
            <del>₹840</del>
          </span>
        </span>
      </Link>
    </main>
  );
}
