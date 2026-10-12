import type { Metadata } from "next";
import { SITE_URL, person } from "../data/profile";
import type { Locale } from "../data/types";
import { localePath, ui } from "../data/ui";

type PageKey = "home" | "publications" | "teaching" | "cv";

const paths: Record<PageKey, string> = {
  home: "/",
  publications: "/publications",
  teaching: "/teaching",
  cv: "/cv",
};

export function pageMetadata(locale: Locale, page: PageKey): Metadata {
  const t = ui[locale];
  const titles: Record<PageKey, string> = {
    home: t.meta.homeTitle,
    publications: `${t.pub.pageTitle} | ${person.honorific[locale]}`,
    teaching: `${t.teaching.pageTitle} | ${person.honorific[locale]}`,
    cv: `${t.cv.pageTitle} | ${person.honorific[locale]}`,
  };
  const descriptions: Record<PageKey, string> = {
    home: t.meta.homeDescription,
    publications: t.pub.pageIntro,
    teaching: t.teaching.pageIntro,
    cv: `${person.title[locale]}, ${person.institution}. ${t.cv.updated}.`,
  };
  const path = localePath(locale, paths[page]);
  const title = titles[page];
  const description = descriptions[page];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: localePath("en", paths[page]),
        uk: localePath("uk", paths[page]),
        "x-default": localePath("en", paths[page]),
      },
    },
    openGraph: {
      type: page === "home" ? "profile" : "website",
      url: path,
      title,
      description,
      siteName: person.name[locale],
      locale: locale === "uk" ? "uk_UA" : "en_US",
      images: [{ url: "/images/og-card.png", width: 1200, height: 630, alt: person.name[locale] }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-card.png"],
    },
  };
}

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Igor Khokhlov",
    alternateName: "Ігор Хохлов",
    honorificPrefix: "Dr.",
    jobTitle: "Assistant Professor of Cybersecurity",
    url: SITE_URL,
    email: "mailto:khokhlovi@sacredheart.edu",
    image: `${SITE_URL}/images/igor-khokhlov-portrait.jpg`,
    description: person.intro[locale],
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: "Sacred Heart University",
      department: { "@type": "Organization", name: "School of Computing & Engineering" },
    },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Rochester Institute of Technology" },
      { "@type": "CollegeOrUniversity", name: "Igor Sikorsky Kyiv Polytechnic Institute" },
    ],
    knowsAbout: [
      "Cybersecurity",
      "Machine learning for security",
      "Data quality",
      "Mobile and IoT security",
      "Privacy-preserving communication",
    ],
    sameAs: [
      "https://scholar.google.com/citations?user=NrrJOskAAAAJ",
      "https://www.sacredheart.edu/phonebook/igor-khokhlov.php",
      "https://sacredheart.elsevierpure.com/en/persons/igor-khokhlov/",
      "https://github.com/i-xoxol",
      "https://www.linkedin.com/in/igor-khokhlov-19415852",
    ],
  };
}
