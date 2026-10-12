import { PageShell } from "../components/Layout";

export default function NotFound() {
  return (
    <PageShell locale="en" page="other" altHref="/uk">
      <div className="wrap page-head">
        <h1>Page not found</h1>
        <p>
          This address does not match a page on this site. Go to the <a href="/">home page</a>, or see{" "}
          <a href="/publications">publications</a> and <a href="/teaching">teaching</a>.
        </p>
      </div>
    </PageShell>
  );
}
