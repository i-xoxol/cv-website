/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { Citation, ShortRef } from "../components/Citation";
import ContactForm from "../components/ContactForm";
import EntropyChart from "../components/EntropyChart";
import HeroCanvas from "../components/fx/HeroCanvas";
import Typewriter from "../components/fx/Typewriter";
import { ArrowIcon, ThemeIcon } from "../components/Icons";
import { PageShell, Section } from "../components/Layout";
import { countByType, doiUrl, featuredPublications, publicationById, publications } from "../data/publications";
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

export const PORTRAIT = "/images/portrait-badge.jpg";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function HomeView({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const fx = t.fx;
  const ghost = publicationById("ghost-icissp-2026")!;
  const altHref = locale === "en" ? "/uk" : "/";
  const stats = [
    { n: publications.length, label: fx.stats.pubs },
    { n: countByType("conference"), label: fx.stats.conference },
    { n: countByType("journal"), label: fx.stats.journal },
    { n: currentCourses.length, label: fx.stats.courses },
  ];

  return (
    <PageShell locale={locale} page="home" altHref={altHref}>
      {/* Introduction */}
      <section className="hero" aria-labelledby="hero-name">
        <div className="hero__bg" aria-hidden="true">
          <HeroCanvas />
          <div className="hero__floor" />
        </div>
        <div className="wrap hero__inner">
          <div className="hero__text">
            <p className="prompt hero-in" style={delay(0)}>
              <span className="prompt__path">~/sacred-heart/cybersecurity</span>
              <span className="prompt__sign">$</span>
              <span className="prompt__cmd">{fx.prompt}</span>
            </p>
            <h1 className="hero__name hero-in" id="hero-name" style={delay(120)}>
              <span data-scramble="" data-scramble-ms="1300">
                {person.name[locale]}
              </span>
            </h1>
            <p className="hero__role hero-in" style={delay(320)}>
              {person.title[locale]}
              <span>
                {person.unit}, {person.institution}
              </span>
            </p>
            <p className="hero__typed hero-in" style={delay(460)}>
              <span className="hero__typed-label">{fx.researching}</span>
              <Typewriter words={fx.words} label={fx.researching} />
            </p>
            <p className="hero__intro hero-in" style={delay(580)}>
              {person.intro[locale]}
            </p>
            <div className="actions hero-in" style={delay(700)}>
              <a className="button button--primary" href="#research">
                {t.cta.research}
                <ArrowIcon />
              </a>
              <a className="button" href={localePath(locale, "/teaching")}>
                {t.cta.teaching}
              </a>
              <a className="button" href={localePath(locale, "/publications")}>
                {t.cta.publications}
              </a>
              <a className="button button--ghost" href={CV_PDF} download>
                <DownloadIcon />
                {t.cta.cv}
              </a>
            </div>
            <p className="hero__email hero-in" style={delay(820)}>
              <span className="hero__email-label">{t.emailLabel}</span>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </div>

          <figure className="badge hero-in" data-tilt="" style={delay(400)}>
            <div className="badge__frame">
              <img
                className="badge__photo"
                src={PORTRAIT}
                alt={person.name[locale]}
                width={480}
                height={600}
                fetchPriority="high"
              />
              <span className="badge__scan" aria-hidden="true" />
              <span className="badge__corner badge__corner--tl" aria-hidden="true" />
              <span className="badge__corner badge__corner--tr" aria-hidden="true" />
              <span className="badge__corner badge__corner--bl" aria-hidden="true" />
              <span className="badge__corner badge__corner--br" aria-hidden="true" />
            </div>
            <figcaption className="badge__meta">
              <span className="badge__name">{person.honorific[locale]}</span>
              <span className="badge__role">{fx.badgeRole}</span>
              <span className="badge__org">Sacred Heart University</span>
            </figcaption>
          </figure>
        </div>

        <div className="wrap">
          <ul className="stats" data-stagger="">
            {stats.map((s) => (
              <li key={s.label} className="stat">
                <span className="stat__n" data-count={s.n}>
                  {s.n}
                </span>
                <span className="stat__label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...fx.marquee, ...fx.marquee].map((m, i) => (
            <span key={i} className="marquee__item">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Featured publication */}
      <Section id="featured" eyebrow={fx.eyebrows.featured} title={t.featured.heading} stacked>
        <div className="featured glass glass--glow spot" data-reveal="">
          <div className="featured__text">
            <span className="tag tag--published">
              <span className="dot" aria-hidden="true" />
              {t.research.status.published}
            </span>
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
              <a className="button button--ghost" href={ghost.url}>
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
        eyebrow={fx.eyebrows.teaching}
        title={t.sections.teaching}
        intro={t.sections.teachingIntro}
        more={<a href={localePath(locale, "/teaching")}>{t.cta.allTeaching}</a>}
      >
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
            </li>
          ))}
        </ul>
      </Section>

      {/* Selected publications */}
      <Section
        id="publications"
        eyebrow={fx.eyebrows.publications}
        title={t.sections.publications}
        intro={t.sections.publicationsIntro}
        more={<a href={localePath(locale, "/publications")}>{t.cta.allPublications}</a>}
      >
        <ul className="pub-list" data-stagger="">
          {featuredPublications.map((p) => (
            <li key={p.id} className="pub-card spot">
              <Citation pub={p} locale={locale} showSummary />
            </li>
          ))}
        </ul>
      </Section>

      {/* Research themes */}
      <Section id="research" eyebrow={fx.eyebrows.research} title={t.sections.research} intro={t.sections.researchIntro}>
        <div className="bento" data-stagger="">
          {researchThemes.map((theme, i) => (
            <article key={theme.id} className={`theme card spot${i === 0 ? " theme--wide" : ""}`} id={`research-${theme.id}`}>
              <div className="theme__top">
                <span className="theme__icon">
                  <ThemeIcon id={theme.id} />
                </span>
                <span className={`tag ${theme.status === "in-progress" ? "tag--in-progress" : "tag--published"}`}>
                  <span className="dot" aria-hidden="true" />
                  {theme.statusNote[locale]}
                </span>
              </div>
              <h3 className="theme__title">{theme.title[locale]}</h3>
              <p className="theme__summary">{theme.summary[locale]}</p>
              <details className="theme__details">
                <summary>{fx.details}</summary>
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
              </details>
            </article>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" eyebrow={fx.eyebrows.projects} title={t.sections.projects} intro={t.sections.projectsIntro}>
        <ul className="term-grid" data-stagger="">
          {projects.map((p) => {
            const repo = p.links.find((l) => l.href.includes("github.com"));
            return (
              <li key={p.id} className="terminal-card spot">
                <div className="terminal-card__bar" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <em>{repo ? repo.href.replace("https://github.com/", "") : p.id}</em>
                </div>
                <div className="terminal-card__body">
                  <p className="terminal-card__cmd" aria-hidden="true">
                    <span className="prompt__sign">$</span> git clone {repo?.href.replace("https://", "")}
                  </p>
                  <div className="project__head">
                    <h3 className="project__name" lang="en">
                      {p.name}
                    </h3>
                    <span className={`tag ${p.id === "ghost" ? "tag--published" : "tag--neutral"}`}>{p.kind[locale]}</span>
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
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Grants */}
      <Section id="grants" eyebrow={fx.eyebrows.grants} title={t.sections.grants}>
        <ol className="timeline" data-stagger="">
          {grants.map((g) => (
            <li key={g.title} className="timeline__item">
              <p className="timeline__date">{g.dates}</p>
              <p className="timeline__title" lang="en">
                {g.title}
              </p>
              <p className="timeline__context">
                {g.sponsor}. {g.role[locale]}. {g.kind[locale]}.
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Mentoring */}
      <Section
        id="mentoring"
        eyebrow={fx.eyebrows.mentoring}
        title={t.sections.mentoring}
        more={<a href={`${localePath(locale, "/teaching")}#mentoring`}>{t.cta.allTeaching}</a>}
      >
        <div className="two-col" data-reveal="">
          <ul className="checklist">
            {mentoring.kinds.map((k) => (
              <li key={k.en}>{k[locale]}</li>
            ))}
          </ul>
          <div className="glass quote">
            <p>{mentoring.example[locale]}</p>
            <p className="muted">{mentoring.invitation[locale]}</p>
          </div>
        </div>
      </Section>

      {/* Talks and service */}
      <Section id="talks" eyebrow={fx.eyebrows.talks} title={t.sections.talks}>
        <ol className="timeline" data-stagger="">
          {talksAndService.map((s) => (
            <li key={s.title.en} className="timeline__item">
              <p className="timeline__date">{s.date[locale]}</p>
              <p className="timeline__title">{s.href ? <a href={s.href}>{s.title[locale]}</a> : s.title[locale]}</p>
              <p className="timeline__context">{s.context[locale]}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* About */}
      <Section id="about" eyebrow={fx.eyebrows.about} title={t.nav.about}>
        <div className="prose" data-reveal="">
          {person.bio.map((p) => (
            <p key={p.en}>{p[locale]}</p>
          ))}
        </div>
        <div className="block two-col">
          <div data-reveal="">
            <h3 className="subhead">{t.sections.experience}</h3>
            <ol className="timeline timeline--compact">
              {experience.map((e) => (
                <li key={e.role.en} className="timeline__item">
                  <p className="timeline__date">{e.dates[locale]}</p>
                  <p className="timeline__title">{e.role[locale]}</p>
                  <p className="timeline__context">
                    {e.place}
                    {e.note ? `. ${e.note[locale]}` : ""}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal="">
            <h3 className="subhead">{t.sections.education}</h3>
            <ol className="timeline timeline--compact">
              {education.map((e) => (
                <li key={e.year} className="timeline__item">
                  <p className="timeline__date">{e.year}</p>
                  <p className="timeline__title">{e.degree[locale]}</p>
                  <p className="timeline__context">{e.place}</p>
                </li>
              ))}
            </ol>
            <h3 className="subhead block">{t.sections.personal}</h3>
            <p className="muted">{personal[locale]}</p>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" eyebrow={fx.eyebrows.contact} title={t.sections.contact}>
        <div className="contact-grid">
          <div data-reveal="">
            <p className="muted prose">{t.contact.intro}</p>
            <p className="contact-email">
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <h3 className="subhead block">{t.sections.profiles}</h3>
            <ul className="link-list">
              {profileLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.legacy ? `${l.label} (${locale === "uk" ? "архів" : "archived"})` : l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="terminal-card terminal-card--form" data-reveal="">
            <div className="terminal-card__bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <em>{fx.terminalTitle}</em>
            </div>
            <div className="terminal-card__body">
              <ContactForm locale={locale} />
            </div>
          </div>
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
