import { doiUrl } from "../data/publications";
import type { Locale, Publication } from "../data/types";
import { ui } from "../data/ui";

const SELF = "I. Khokhlov";

export function Authors({ authors }: { authors: string[] }) {
  return (
    <>
      {authors.map((a, i) => (
        <span key={a + i}>
          {i > 0 && (i === authors.length - 1 ? (authors.length > 2 ? ", and " : " and ") : ", ")}
          {a === SELF ? <strong>{a}</strong> : a}
        </span>
      ))}
    </>
  );
}

export function primaryLink(p: Publication) {
  return p.doi ? doiUrl(p.doi) : p.url;
}

export function Citation({
  pub,
  locale,
  showSummary = false,
  headingLevel = "h3",
}: {
  pub: Publication;
  locale: Locale;
  showSummary?: boolean;
  headingLevel?: "h3" | "h4";
}) {
  const t = ui[locale].pub;
  const href = primaryLink(pub);
  const Heading = headingLevel;
  const extraLinks: { label: string; href: string }[] = [];
  if (pub.pdfUrl) extraLinks.push({ label: t.pdf, href: pub.pdfUrl });
  if (pub.url && pub.doi) extraLinks.push({ label: t.publisher, href: pub.url });
  if (pub.codeUrl) extraLinks.push({ label: t.code, href: pub.codeUrl });
  if (pub.dataUrl) extraLinks.push({ label: t.code, href: pub.dataUrl });

  return (
    <article className="pub" lang="en">
      <p className="pub__year">{pub.year}</p>
      <div>
        <Heading className="pub__title">{href ? <a href={href}>{pub.title}</a> : pub.title}</Heading>
        <p className="pub__authors">
          <Authors authors={pub.authors} />
        </p>
        <p className="pub__venue">
          <em>{pub.venue}</em>
          {pub.details ? `, ${pub.details}` : ""}
        </p>
        {showSummary && pub.summary && (
          <p className="pub__summary" lang={locale}>
            {pub.summary[locale]}
          </p>
        )}
        {(pub.doi || extraLinks.length > 0 || pub.award || pub.status === "preprint") && (
          <p className="pub__links" lang={locale}>
            {pub.award && <span className="tag tag--award">{pub.award[locale]}</span>}
            {pub.status === "preprint" && <span className="tag">{t.preprint}</span>}
            {pub.doi && (
              <span>
                {t.doi}: <a href={doiUrl(pub.doi)} lang="en">{pub.doi}</a>
              </span>
            )}
            {extraLinks.map((l) => (
              <a key={l.label + l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}

/** Short reference used inside research themes: title, venue and year. */
export function ShortRef({ pub }: { pub: Publication }) {
  const href = primaryLink(pub);
  return (
    <span lang="en">
      {href ? <a href={href}>{pub.title}</a> : pub.title}. <em>{shortVenue(pub)}</em>, {pub.year}.
    </span>
  );
}

function shortVenue(p: Publication) {
  const m = p.venue.match(/\(([^)]+)\)\s*$/);
  if (m) return m[1].replace(/\s*\d{4}$/, "").trim();
  return p.venue.replace(/^\d{4}\s+/, "");
}
