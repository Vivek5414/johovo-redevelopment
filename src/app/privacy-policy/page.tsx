import {
  getMigratedPublicPageMetadata,
  MigratedPublicPage,
} from "@/components/content/migrated-public-page";

export const metadata = getMigratedPublicPageMetadata(
  "privacy-policy",
  "Privacy policy content captured from the public JOHOVO website.",
);

export default function PrivacyPolicyPage() {
  return (
    <MigratedPublicPage
      description="Privacy policy content captured from the public JOHOVO website."
      note="The archived policy describes the original online store. This redevelopment does not process orders or payments."
      slug="privacy-policy"
    />
  );
}
