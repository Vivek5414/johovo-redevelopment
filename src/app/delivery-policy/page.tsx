import {
  getMigratedPublicPageMetadata,
  MigratedPublicPage,
} from "@/components/content/migrated-public-page";

export const metadata = getMigratedPublicPageMetadata(
  "delivery-policy",
  "Delivery policy content captured from the public JOHOVO website.",
);

export default function DeliveryPolicyPage() {
  return (
    <MigratedPublicPage
      description="Delivery policy content captured from the public JOHOVO website."
      note="The archived delivery details may not reflect current services or rates."
      slug="delivery-policy"
    />
  );
}
