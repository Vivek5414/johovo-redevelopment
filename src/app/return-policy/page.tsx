import {
  getMigratedPublicPageMetadata,
  MigratedPublicPage,
} from "@/components/content/migrated-public-page";

export const metadata = getMigratedPublicPageMetadata(
  "return-policy",
  "Return policy content captured from the public JOHOVO website.",
);

export default function ReturnPolicyPage() {
  return (
    <MigratedPublicPage
      description="Return policy content captured from the public JOHOVO website."
      note="Confirm current return eligibility and contact details with JOHOVO before relying on this archived policy."
      slug="return-policy"
    />
  );
}
