import { Citation, ShortRef } from "../components/Citation";
import ContactForm from "../components/ContactForm";
import DecoyTree from "../components/DecoyTree";
import EntropyChart from "../components/EntropyChart";
import { PageShell, Section } from "../components/Layout";
import { featuredPublications, publicationById, doiUrl } from "../data/publications";
import {
  CV_PDF,
  EMAIL,
  education,
  experience,
  grants,
  person,
  personal,
  profileLinks,
  talksAndService,
} from "../data/profile";
import { projects } from "../data/projects";
import { researchThemes } from "../data/research";
import { currentCourses, mentoring } from "../data/teaching";
import type { Locale } from "../data/types";
import { localePath, ui } from "../data/ui";

export const PORTRAIT = "/images/portrait-square.jpg";

export default function HomeView({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const ghost = publicationById("ghost-icissp-2026")!;
  const altHref = locale === "en" ? "/uk" : "/";

  return (
    <PageShell locale={locale} page="home" altHref={altHref}>
      {/* Introduction */}
      <div className="hero">
        <div className="wrap hero__grid">
          <div>
            <h1 className="hero__name">{person.name[locale]}</h1>
            <p className="hero__role">
              {person.title[locale]}
              <span>
                {person.unit}, {person.institution}
              </span>
            </p>
            <p className="hero__intro">{person.intro[locale]}</p>
            <div className="actions">
              <a className="button button--primary" href="#research">
                {t.cta.research}
              </a>
              <a className="button" href={localePath(locale, "/teaching")}>
                {t.cta.teaching}
              </a>
              <a className="button" href={localePath(locale, "/publications")}>
                {t.cta.publications}
              </a>
              <a className="button" href={CV_PDF} download>
                <DownloadIcon />
                {t.cta.cv}
              </a>
            </div>
            <p className="hero__email">
              {t.emailLabel}: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </div>
          <figure className="hero__figure">
            <DecoyTree title={t.hero.figureTitle} portrait={PORTRAIT} />
            <figcaption>{t.hero.figureCaption}</figcaption>
          </figure>
        </div>
      </div>

      {/* Featured publication */}
      <Section id="featured" title={t.featured.heading} tint stacked>
        <div className="featured">
          <div>
            <span className="tag tag--published">{t.research.status.published}</span>
            <h3 className="featured__title" lang="en">
              <a href={doiUrl(ghost.doi!)}>{ghost.title}</a>
            </h3>
            <p className="featured__meta" lang="en">
              Igor Khokhlov, Yuriy Khokhlov and Owen Weissman. <em>ICISSP 2026</em>, {ghost.details}.
            </p>
            <p className="featured__summary">{ghost.summary![locale]}</p>
            <div className="actions">
              <a className="button button--primary" href={ghost.pdfUrl}>
                {locale === "uk" ? "Читати статтю (PDF)" : "Read the paper (PDF)"}
              </a>
              <a className="button" href={ghost.codeUrl}>
                {locale === "uk" ? "Код і дані симуляцій" : "Simulation code and data"}
              </a>
              <a className="button" href={ghost.url}>
                {locale === "uk" ? "Сторінка конференції" : "Conference listing"}
              </a>
            </div>
          </div>
          <EntropyChart
            locale={locale}
            title={t.featured.entropyTitle}
            caption={t.featured.entropyCaption}
            depthLabel={t.featured.depth}
            bitsLabel={t.featured.bits}
            branchingLabel={t.featured.branching}
          />
        </div>
      </Section>

      {/* Teaching */}
      <Section
        id="teaching"
        title={t.sections.teaching}
        intro={t.sections.teachingIntro}
        more={<a href={localePath(locale, "/teaching")}>{t.cta.allTeaching}</a>}
      >
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
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Selected publications */}
      <Section
        id="publications"
        title={t.sections.publications}
        intro={t.sections.publicationsIntro}
        more={<a href={localePath(locale, "/publications")}>{t.cta.allPublications}</a>}
      >
        <ul className="entries">
          {featuredPublications.map((p) => (
            <li key={p.id}>
              <Citation pub={p} locale={locale} showSummary />
            </li>
          ))}
        </ul>
      </Section>

      {/* Research themes */}
      <Section id="research" title={t.sections.research} intro={t.sections.researchIntro}>
        {researchThemes.map((theme) => (
          <article key={theme.id} className="theme" id={`research-${theme.id}`}>
            <div className="theme__head">
              <h3 className="theme__title">{theme.title[locale]}</h3>
              <span className={`tag ${theme.status === "in-progress" ? "tag--in-progress" : "tag--published"}`}>
                {theme.statusNote[locale]}
              </span>
            </div>
            <p className="theme__summary">{theme.summary[locale]}</p>
            <dl className="facts">
              <dt>{t.research.question}</dt>
              <dd>{theme.question[locale]}</dd>
              <dt>{t.research.method}</dt>
              <dd>{theme.method[locale]}</dd>
              <dt>{t.research.output}</dt>
              <dd>{theme.output[locale]}</dd>
            </dl>
            {(theme.publications.length > 0 || theme.links) && (
              <div className="related">
                <p className="related__label">{t.research.related}</p>
                <ul>
                  {theme.publications.map((id) => {
                    const p = publicationById(id);
                    return p ? (
                      <li key={id}>
                        <ShortRef pub={p} />
                      </li>
                    ) : null;
                  })}
                  {theme.links?.map((l) => (
                    <li key={l.href}>
                      <a href={l.href}>{l.label[locale]}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </Section>

      {/* Projects */}
      <Section id="projects" title={t.sections.projects} intro={t.sections.projectsIntro} tint>
        <ul className="entries">
          {projects.map((p) => (
            <li key={p.id}>
              <div className="project__head">
                <h3 className="project__name" lang="en">
                  {p.name}
                </h3>
                <span className={`tag ${p.id === "ghost" ? "tag--published" : ""}`}>{p.kind[locale]}</span>
              </div>
              <p className="project__desc">{p.description[locale]}</p>
              <p className="project__scope">{p.scope[locale]}</p>
              <p className="pub__links">
                {p.links.map((l) => (
                  <a key={l.href} href={l.href}>
                    {l.label[locale]}
                  </a>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Grants and mentoring */}
      <Section id="grants" title={t.sections.grants}>
        <ul className="dated">
          {grants.map((g) => (
            <li key={g.title}>
              <p className="dated__date">{g.dates}</p>
              <div>
                <p className="dated__title" lang="en">
                  {g.title}
                </p>
                <p className="dated__context">
                  {g.sponsor}. {g.role[locale]}. {g.kind[locale]}.
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="mentoring"
        title={t.sections.mentoring}
        more={<a href={`${localePath(locale, "/teaching")}#mentoring`}>{t.cta.allTeaching}</a>}
      >
        <div className="two-col">
          <ul className="checklist">
            {mentoring.kinds.map((k) => (
              <li key={k.en}>{k[locale]}</li>
            ))}
          </ul>
          <div className="prose">
            <p>{mentoring.example[locale]}</p>
            <p className="muted">{mentoring.invitation[locale]}</p>
          </div>
        </div>
      </Section>

      {/* Talks and service */}
      <Section id="talks" title={t.sections.talks}>
        <ul className="dated">
          {talksAndService.map((s) => (
            <li key={s.title.en}>
              <p className="dated__date">{s.date[locale]}</p>
              <div>
                <p className="dated__title">{s.href ? <a href={s.href}>{s.title[locale]}</a> : s.title[locale]}</p>
                <p className="dated__context">{s.context[locale]}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* About */}
      <Section id="about" title={t.nav.about} tint>
        <div className="prose">
          {person.bio.map((p) => (
            <p key={p.en}>{p[locale]}</p>
          ))}
        </div>
        <div className="block">
          <h3 className="subhead">{t.sections.experience}</h3>
          <ul className="dated">
            {experience.map((e) => (
              <li key={e.role.en}>
                <p className="dated__date">{e.dates[locale]}</p>
                <div>
                  <p className="dated__title">{e.role[locale]}</p>
                  <p className="dated__context">
                    {e.place}
                    {e.note ? `. ${e.note[locale]}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="block">
          <h3 className="subhead">{t.sections.education}</h3>
          <ul className="dated">
            {education.map((e) => (
              <li key={e.year}>
                <p className="dated__date">{e.year}</p>
                <div>
                  <p className="dated__title">{e.degree[locale]}</p>
                  <p className="dated__context">{e.place}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="block">
          <h3 className="subhead">{t.sections.personal}</h3>
          <p className="prose muted">{personal[locale]}</p>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title={t.sections.contact}>
        <p className="prose muted">{t.contact.intro}</p>
        <p className="contact-email" style={{ marginTop: 16 }}>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
        <ContactForm locale={locale} />
        <div className="block">
          <h3 className="subhead">{t.sections.profiles}</h3>
          <ul className="link-list">
            {profileLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.legacy ? `${l.label} (${locale === "uk" ? "архів" : "archived"})` : l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </PageShell>
  );
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M9 2.5v9M5.2 7.8 9 11.6l3.8-3.8M3 14.5h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
