"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "../data/types";
import { localePath, ui } from "../data/ui";
import ThemeToggle from "./ThemeToggle";

export type PageKey = "home" | "publications" | "teaching" | "cv" | "other";

export default function SiteHeader({ locale, page, altHref }: { locale: Locale; page: PageKey; altHref: string }) {
  const t = ui[locale];
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!navRef.current?.contains(target) && !buttonRef.current?.contains(target)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, close]);

  const home = localePath(locale, "/");
  const onHome = page === "home";
  const anchor = (id: string) => (onHome ? `#${id}` : `${home === "/" ? "" : home}/#${id}`);

  const links: { key: string; href: string; label: string; current?: boolean }[] = [
    { key: "about", href: anchor("about"), label: t.nav.about },
    { key: "research", href: anchor("research"), label: t.nav.research },
    { key: "teaching", href: localePath(locale, "/teaching"), label: t.nav.teaching, current: page === "teaching" },
    {
      key: "publications",
      href: localePath(locale, "/publications"),
      label: t.nav.publications,
      current: page === "publications",
    },
    { key: "projects", href: anchor("projects"), label: t.nav.projects },
    { key: "cv", href: localePath(locale, "/cv"), label: t.nav.cv, current: page === "cv" },
    { key: "contact", href: anchor("contact"), label: t.nav.contact },
  ];

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <div className="wrap site-header__bar">
        <a className="wordmark" href={home} aria-current={onHome ? "page" : undefined}>
          {locale === "uk" ? "Ігор Хохлов" : "Igor Khokhlov"}
        </a>
        <nav id="site-nav" ref={navRef} className="site-nav" aria-label={t.mainNav} data-open={open ? "true" : "false"}>
          <ul className="nav-list">
            {links.map((l) => (
              <li key={l.key}>
                <a href={l.href} aria-current={l.current ? "page" : undefined} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-tools">
          <a className="lang-link" href={altHref} hrefLang={locale === "en" ? "uk" : "en"} lang={locale === "en" ? "uk" : "en"} aria-label={t.switchLanguageLabel}>
            {locale === "en" ? "УК" : "EN"}
          </a>
          <ThemeToggle toDark={t.themeToDark} toLight={t.themeToLight} />
          <button
            ref={buttonRef}
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {open ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M2.5 5h13M2.5 9h13M2.5 13h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
            {open ? t.closeMenu : t.menu}
          </button>
        </div>
      </div>
    </header>
  );
}
