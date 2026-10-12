import PublicationsView from "../../../views/PublicationsView";
import { pageMetadata } from "../../../lib/metadata";

export const metadata = pageMetadata("uk", "publications");

export default function Page() {
  return <PublicationsView locale="uk" />;
}
