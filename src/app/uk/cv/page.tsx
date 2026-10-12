import CvView from "../../../views/CvView";
import { pageMetadata } from "../../../lib/metadata";

export const metadata = pageMetadata("uk", "cv");

export default function Page() {
  return <CvView locale="uk" />;
}
