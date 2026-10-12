import TeachingView from "../../views/TeachingView";
import { pageMetadata } from "../../lib/metadata";

export const metadata = pageMetadata("en", "teaching");

export default function Page() {
  return <TeachingView locale="en" />;
}
