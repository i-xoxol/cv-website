import { Citation } from "../components/Citation";
import PubFilter from "../components/fx/PubFilter";
import DataRain from "../components/fx/DataRain";
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
      <div className="page-head-band">
        <div className="band__backdrop" aria-hidden="true">
          <DataRain density={0.7} />
        </div>
      <div className="wrap page-head">
        <p className="eyebrow hero-in" aria-hidden="true">
          {"// "}
          {t.fx.eyebrows.publications}
        </p>
        <h1 className="hero-in">{t.pub.pageTitle}</h1>
        <p className="hero-in">{t.pub.pageIntro}</p>
        <PubFilter
          label={t.pub.filterLabel}
          allLabel={t.pub.all}
          options={groups.map((g) => ({ id: g.type, label: t.pub.types[g.type], count: g.items.length }))}
        />
      </div>
      </div>

      {groups.map((g) => (
        <div key={g.type} data-pub-group={g.type}>
          <Section id={g.type} title={t.pub.types[g.type]} intro={t.pub.count(g.items.length)}>
            <ul className="pub-list" data-stagger="">
              {[...g.items]
                .sort((a, b) => b.year - a.year)
                .map((p) => (
                  <li key={p.id} className="pub-card spot">
                    <Citation pub={p} locale={locale} />
                  </li>
                ))}
            </ul>
          </Section>
        </div>
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
