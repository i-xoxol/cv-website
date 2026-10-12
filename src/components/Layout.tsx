import type { ReactNode } from "react";
import type { Locale } from "../data/types";
import { EMAIL, profileLinks } from "../data/profile";
import { ui } from "../data/ui";
import Effects from "./fx/Effects";
import SiteHeader, { type PageKey } from "./SiteHeader";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  more,
  tint = false,
  stacked = false,
  backdrop,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  more?: ReactNode;
  tint?: boolean;
  stacked?: boolean;
  backdrop?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className={tint ? "band band--tint" : "band"} aria-labelledby={`${id}-title`}>
      {backdrop && (
        <div className="band__backdrop" aria-hidden="true">
          {backdrop}
        </div>
      )}
      <div className={stacked ? "wrap section section--stacked" : "wrap section"}>
        <div className="section__head" data-reveal>
          {eyebrow && (
            <p className="eyebrow" aria-hidden="true">
              {"// "}
              {eyebrow}
            </p>
          )}
          <h2 className="section__title" id={`${id}-title`}>
            <span data-scramble="" data-scramble-ms="900">
              {title}
            </span>
          </h2>
          {intro && <p className="section__intro">{intro}</p>}
          {more && <p className="section__more">{more}</p>}
        </div>
        <div className="section__body">{children}</div>
      </div>
    </section>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = ui[locale];
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__row">
        <p>
          © {new Date().getFullYear()} {locale === "uk" ? "Ігор Хохлов" : "Igor Khokhlov"}, Sacred Heart University.{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
        <ul className="link-list" aria-label={t.sections.profiles}>
          {profileLinks
            .filter((l) => !l.legacy)
            .map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
        </ul>
      </div>
    </footer>
  );
}

export function PageShell({
  locale,
  page,
  altHref,
  children,
}: {
  locale: Locale;
  page: PageKey;
  altHref: string;
  children: ReactNode;
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        {ui[locale].skip}
      </a>
      <div className="backdrop" aria-hidden="true">
        <div className="backdrop__grid" />
        <div className="backdrop__orb backdrop__orb--a" />
        <div className="backdrop__orb backdrop__orb--b" />
        <div className="backdrop__noise" />
      </div>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader locale={locale} page={page} altHref={altHref} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter locale={locale} />
      <Effects />
    </>
  );
}
