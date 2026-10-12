import HomeView from "../../views/HomeView";
import { pageMetadata, personJsonLd } from "../../lib/metadata";

export const metadata = pageMetadata("uk", "home");

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd("uk")) }} />
      <HomeView locale="uk" />
    </>
  );
}
