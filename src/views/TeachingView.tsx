import DataRain from "../components/fx/DataRain";
import { PageShell, Section } from "../components/Layout";
import { EMAIL } from "../data/profile";
import { currentCourses, mentoring, teachingMethods, teachingPortfolio, teachingStatement } from "../data/teaching";
import type { Locale } from "../data/types";
import { ui } from "../data/ui";

export default function TeachingView({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <PageShell locale={locale} page="teaching" altHref={locale === "en" ? "/uk/teaching" : "/teaching"}>
      <div className="page-head-band">
        <div className="band__backdrop" aria-hidden="true">
          <DataRain density={0.7} />
        </div>
      <div className="wrap page-head">
        <p className="eyebrow hero-in" aria-hidden="true">
          {"// "}
          {t.fx.eyebrows.teaching}
        </p>
        <h1 className="hero-in">{t.teaching.pageTitle}</h1>
        <p className="hero-in">{t.teaching.pageIntro}</p>
      </div>
      </div>

      <Section id="current" eyebrow="fall-2026" title={t.teaching.current} intro={t.teaching.privateNote}>
        <ul className="course-grid" data-stagger="">
          {currentCourses.map((c) => (
            <li key={c.code} className="card spot" data-tilt="">
              <p className="code-chip">{c.code}</p>
              <h3 className="card__title" lang="en">
                {c.title}
              </h3>
              <p className="card__meta">
                {c.level[locale]}, {c.term[locale]}
              </p>
              <p className="card__body">{c.description[locale]}</p>
              {c.publicMaterials && (
                <p className="course-links">
                  {t.teaching.publicMaterials}:{" "}
                  {c.publicMaterials.map((m) => (
                    <a key={m.href} href={m.href}>
                      {m.label[locale]}
                    </a>
                  ))}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="approach" eyebrow="method" title={t.teaching.approach}>
        <p className="lead" data-reveal="">
          {teachingStatement[locale]}
        </p>
        <ul className="method-grid block" data-stagger="">
          {teachingMethods.map((m) => (
            <li key={m.title.en} className="card spot">
              <h3 className="card__title">{m.title[locale]}</h3>
              <p className="card__body">{m.body[locale]}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="portfolio" eyebrow="portfolio" title={t.teaching.portfolio} intro={t.teaching.portfolioNote}>
        {teachingPortfolio.map((g, i) => (
          <div key={g.id} className={i ? "block" : undefined}>
            <h3 className="subhead">{g.label[locale]}</h3>
            <ul className="portfolio" lang="en" data-stagger="">
              {g.courses.map((c) => (
                <li key={c.title} className={c.code ? undefined : "no-code"}>
                  {c.code && <span className="portfolio__code">{c.code}</span>}
                  <span>{c.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section id="mentoring" eyebrow={t.fx.eyebrows.mentoring} title={t.sections.mentoring}>
        <div className="two-col" data-reveal="">
          <div>
            <h3 className="subhead">{t.teaching.mentoringKinds}</h3>
            <ul className="checklist">
              {mentoring.kinds.map((k) => (
                <li key={k.en}>{k[locale]}</li>
              ))}
            </ul>
          </div>
          <div className="glass quote">
            <p>{mentoring.example[locale]}</p>
            <p className="muted">
              {mentoring.invitation[locale]} <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
