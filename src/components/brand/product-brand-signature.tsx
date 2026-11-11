import type { ProductBrandIdentity } from "@/lib/brand/identity";
import { BrandLogo } from "./brand-logo";
import styles from "./product-brand-signature.module.css";

type ProductBrandSignatureProps = {
  identity: ProductBrandIdentity;
  logo?: {
    src: string;
    width: number;
    height: number;
  };
  className?: string;
};

export function ProductBrandSignature({
  identity,
  logo,
  className,
}: ProductBrandSignatureProps) {
  const classNames = [
    styles.signature,
    styles[identity],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classNames}>
      {logo ? (
        <BrandLogo identity={identity} {...logo} />
      ) : (
        <BrandLogo identity={identity} />
      )}
    </span>
  );
}
