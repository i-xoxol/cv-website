import { Authors } from "../components/Citation";
import { PageShell } from "../components/Layout";
import {
  CV_PDF,
  EMAIL,
  SITE_URL,
  education,
  experience,
  grants,
  person,
  profileLinks,
  talksAndService,
} from "../data/profile";
import { doiUrl, publications, publicationTypeOrder } from "../data/publications";
import { researchThemes } from "../data/research";
import { currentCourses, teachingPortfolio } from "../data/teaching";
import type { Locale, Publication } from "../data/types";
import { ui } from "../data/ui";
import { DownloadIcon } from "./HomeView";

function CvCitation({ p }: { p: Publication }) {
  return (
    <li lang="en">
      <Authors authors={p.authors} /> ({p.year}). {p.title}
      {/[.?!]$/.test(p.title) ? " " : ". "}
      <em>{p.venue}</em>
      {p.details ? `, ${p.details}` : ""}.
      {p.doi ? (
        <>
          {" "}
          <a href={doiUrl(p.doi)}>doi:{p.doi}</a>
        </>
      ) : p.url ? (
        <>
          {" "}
          <a href={p.url}>{p.url.replace(/^https?:\/\//, "")}</a>
        </>
      ) : null}
    </li>
  );
}

export default function CvView({ locale, print = false }: { locale: Locale; print?: boolean }) {
  const t = ui[locale];
  const body = (
    <article className="cv">
      {!print && (
        <div className="cv__toolbar">
          <a className="button button--primary" href={CV_PDF} download>
            <DownloadIcon />
            {t.cv.download}
          </a>
        </div>
      )}
      <header className="cv__head">
        <div>
          <h1 className="cv__name">{person.honorific.en}</h1>
          <p className="cv__role">
            {person.title.en}
            <br />
            {person.unit}, {person.institution}
          </p>
        </div>
        <p className="cv__contact">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <br />
          <a href={SITE_URL}>{SITE_URL.replace("https://", "")}</a>
          <br />
          {person.location.en}
          <br />
          {t.cv.updated}
        </p>
      </header>

      <section className="cv__section">
        <h2>{t.sections.experience}</h2>
        {experience.map((e) => (
          <div className="cv-row" key={e.role.en}>
            <span className="cv-row__when">{e.dates[locale]}</span>
            <span>
              <strong>{e.role[locale]}</strong>, {e.place}
              {e.note ? `. ${e.note[locale]}` : ""}
            </span>
          </div>
        ))}
      </section>

      <section className="cv__section">
        <h2>{t.sections.education}</h2>
        {education.map((e) => (
          <div className="cv-row" key={e.year}>
            <span className="cv-row__when">{e.year}</span>
            <span>
              <strong>{e.degree[locale]}</strong>, {e.place}
            </span>
          </div>
        ))}
      </section>

      <section className="cv__section">
        <h2>{t.sections.research}</h2>
        {researchThemes.map((r) => (
          <div className="cv-row" key={r.id}>
            <span className="cv-row__when">{r.statusNote[locale]}</span>
            <span>
              <strong>{r.title[locale]}.</strong> {r.question[locale]}
            </span>
          </div>
        ))}
      </section>

      <section className="cv__section">
        <h2>{t.sections.grants}</h2>
        {grants.map((g) => (
          <div className="cv-row" key={g.title}>
            <span className="cv-row__when">{g.dates}</span>
            <span>
              <strong lang="en">{g.title}</strong>. {g.sponsor}. {g.role[locale]}.
            </span>
          </div>
        ))}
      </section>

      <section className="cv__section">
        <h2>{t.sections.teaching}</h2>
        <h3>{t.teaching.current}</h3>
        {currentCourses.map((c) => (
          <div className="cv-row" key={c.code}>
            <span className="cv-row__when">{c.code}</span>
            <span lang="en">{c.title}</span>
          </div>
        ))}
        {teachingPortfolio.map((g) => (
          <div key={g.id}>
            <h3>{g.label[locale]}</h3>
            <p lang="en" style={{ fontSize: "0.95rem" }}>
              {g.courses.map((c) => (c.code ? `${c.code} ${c.title}` : c.title)).join("; ")}.
            </p>
          </div>
        ))}
      </section>

      <section className="cv__section">
        <h2>{t.cv.selectedPubs}</h2>
        {publicationTypeOrder.map((type) => {
          const items = publications.filter((p) => p.type === type);
          if (!items.length) return null;
          return (
            <div key={type}>
              <h3>{t.pub.types[type]}</h3>
              <ol className="cv-pubs">
                {items.map((p) => (
                  <CvCitation key={p.id} p={p} />
                ))}
              </ol>
            </div>
          );
        })}
      </section>

      <section className="cv__section">
        <h2>{t.sections.talks}</h2>
        {talksAndService.map((s) => (
          <div className="cv-row" key={s.title.en}>
            <span className="cv-row__when">{s.date[locale]}</span>
            <span>
              <strong>{s.title[locale]}</strong>. {s.context[locale]}.
            </span>
          </div>
        ))}
      </section>

      <section className="cv__section">
        <h2>{t.sections.profiles}</h2>
        {profileLinks
          .filter((l) => !l.legacy)
          .map((l) => (
            <div className="cv-row" key={l.href}>
              <span className="cv-row__when">{l.label}</span>
              <a href={l.href}>{l.href.replace(/^https?:\/\/(www\.)?/, "")}</a>
            </div>
          ))}
      </section>
    </article>
  );

  if (print) return body;
  return (
    <PageShell locale={locale} page="cv" altHref={locale === "en" ? "/uk/cv" : "/cv"}>
      {body}
    </PageShell>
  );
}
