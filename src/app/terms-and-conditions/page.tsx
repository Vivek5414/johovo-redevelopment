import {
  getMigratedPublicPageMetadata,
  MigratedPublicPage,
} from "@/components/content/migrated-public-page";

export const metadata = getMigratedPublicPageMetadata(
  "terms-and-conditions",
  "Terms and conditions captured from the public JOHOVO website.",
);

export default function TermsAndConditionsPage() {
  return (
    <MigratedPublicPage
      description="Terms and conditions captured from the public JOHOVO website."
      note="The archived terms describe the original online store. This redevelopment does not process orders or payments."
      slug="terms-and-conditions"
    />
  );
}
