import { PageShell, Section } from "../components/Layout";
import { EMAIL } from "../data/profile";
import { currentCourses, mentoring, teachingMethods, teachingPortfolio, teachingStatement } from "../data/teaching";
import type { Locale } from "../data/types";
import { ui } from "../data/ui";

export default function TeachingView({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <PageShell locale={locale} page="teaching" altHref={locale === "en" ? "/uk/teaching" : "/teaching"}>
      <div className="wrap page-head">
        <h1>{t.teaching.pageTitle}</h1>
        <p>{t.teaching.pageIntro}</p>
      </div>

      <Section id="current" title={t.teaching.current} intro={t.teaching.privateNote} tint>
        <ul className="entries">
          {currentCourses.map((c) => (
            <li key={c.code} className="course">
              <p className="course__code">{c.code}</p>
              <div>
                <h3 className="course__title" lang="en">
                  {c.title}
                </h3>
                <p className="course__meta">
                  {c.level[locale]}, {c.term[locale]}
                </p>
                <p className="course__desc">{c.description[locale]}</p>
                {c.publicMaterials && (
                  <p className="course__links">
                    {t.teaching.publicMaterials}:{" "}
                    {c.publicMaterials.map((m) => (
                      <a key={m.href} href={m.href}>
                        {m.label[locale]}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="approach" title={t.teaching.approach}>
        <p className="prose" style={{ fontSize: "1.08rem" }}>
          {teachingStatement[locale]}
        </p>
        <ul className="dated block">
          {teachingMethods.map((m) => (
            <li key={m.title.en}>
              <p className="dated__title">{m.title[locale]}</p>
              <p className="dated__context">{m.body[locale]}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="portfolio" title={t.teaching.portfolio} intro={t.teaching.portfolioNote} tint>
        {teachingPortfolio.map((g, i) => (
          <div key={g.id} className={i ? "block" : undefined}>
            <h3 className="subhead">{g.label[locale]}</h3>
            <ul className="portfolio" lang="en">
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

      <Section id="mentoring" title={t.sections.mentoring}>
        <div className="two-col">
          <div>
            <h3 className="subhead">{t.teaching.mentoringKinds}</h3>
            <ul className="checklist">
              {mentoring.kinds.map((k) => (
                <li key={k.en}>{k[locale]}</li>
              ))}
            </ul>
          </div>
          <div className="prose">
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
