import {
  getMigratedPublicPageMetadata,
  MigratedPublicPage,
} from "@/components/content/migrated-public-page";

export const metadata = getMigratedPublicPageMetadata(
  "about-us",
  "About JOHOVO, captured from its public website.",
);

export default function AboutPage() {
  return (
    <MigratedPublicPage
      description="About JOHOVO, captured from its public website."
      slug="about-us"
    />
  );
}
