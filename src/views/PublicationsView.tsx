import { Citation } from "../components/Citation";
import { PageShell, Section } from "../components/Layout";
import { profileLinks } from "../data/profile";
import { publications, publicationTypeOrder } from "../data/publications";
import type { Locale } from "../data/types";
import { ui } from "../data/ui";

export default function PublicationsView({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const groups = publicationTypeOrder
    .map((type) => ({ type, items: publications.filter((p) => p.type === type) }))
    .filter((g) => g.items.length > 0);

  return (
    <PageShell locale={locale} page="publications" altHref={locale === "en" ? "/uk/publications" : "/publications"}>
      <div className="wrap page-head">
        <h1>{t.pub.pageTitle}</h1>
        <p>{t.pub.pageIntro}</p>
        <nav className="jump" aria-label={t.pub.filterLabel}>
          {groups.map((g) => (
            <a key={g.type} href={`#${g.type}`}>
              {t.pub.types[g.type]} ({g.items.length})
            </a>
          ))}
        </nav>
      </div>

      {groups.map((g, i) => (
        <Section key={g.type} id={g.type} title={t.pub.types[g.type]} tint={i % 2 === 1}>
          <ul className="entries">
            {[...g.items]
              .sort((a, b) => b.year - a.year)
              .map((p) => (
                <li key={p.id}>
                  <Citation pub={p} locale={locale} />
                </li>
              ))}
          </ul>
        </Section>
      ))}

      <Section id="profiles" title={t.sections.profiles} intro={t.pub.source}>
        <ul className="link-list">
          {profileLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.legacy ? `${l.label} (${locale === "uk" ? "архів" : "archived"})` : l.label}</a>
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  );
}
