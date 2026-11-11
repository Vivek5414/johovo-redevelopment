import {
  getMigratedPublicPageMetadata,
  MigratedPublicPage,
} from "@/components/content/migrated-public-page";

export const metadata = getMigratedPublicPageMetadata(
  "refund-policy",
  "Refund policy content captured from the public JOHOVO website.",
);

export default function RefundPolicyPage() {
  return (
    <MigratedPublicPage
      description="Refund policy content captured from the public JOHOVO website."
      note="Confirm current refund eligibility and contact details with JOHOVO before relying on this archived policy."
      slug="refund-policy"
    />
  );
}
