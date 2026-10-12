import type { Localized } from "./types";

export const SITE_URL = "https://igor.khokhlov.org";
export const EMAIL = "khokhlovi@sacredheart.edu";
export const CV_PDF = "/Igor_Khokhlov_CV.pdf";

export const person = {
  name: { en: "Igor Khokhlov", uk: "Ігор Хохлов" } as Localized,
  honorific: { en: "Dr. Igor Khokhlov", uk: "Д-р Ігор Хохлов" } as Localized,
  title: {
    en: "Assistant Professor of Cybersecurity",
    uk: "Асистент-професор з кібербезпеки (Assistant Professor)",
  } as Localized,
  unit: "School of Computing & Engineering",
  institution: "Sacred Heart University",
  location: { en: "Fairfield, Connecticut", uk: "Ферфілд, Коннектикут" } as Localized,
  intro: {
    en: "I am an Assistant Professor of Cybersecurity at Sacred Heart University. My research connects artificial intelligence, data quality, mobile and IoT security, and privacy-preserving communication. I teach undergraduate and graduate computing and cybersecurity courses, with an emphasis on practical exercises, secure system design, and evidence-based security decisions.",
    uk: "Я асистент-професор з кібербезпеки в Sacred Heart University. Мої дослідження поєднують штучний інтелект, якість даних, безпеку мобільних та IoT-систем і зв'язок зі збереженням приватності. Я викладаю бакалаврські та магістерські курси з комп'ютерних наук і кібербезпеки з акцентом на практичні вправи, безпечне проєктування систем і рішення з безпеки, що ґрунтуються на доказах.",
  } as Localized,
  bio: [
    {
      en: "I joined the School of Computing & Engineering at Sacred Heart University in 2021. I received my Ph.D. in Computing and Information Sciences from Rochester Institute of Technology in 2020, where my dissertation developed an integrated framework for evaluating data quality and security on mobile devices.",
      uk: "Я працюю в School of Computing & Engineering у Sacred Heart University з 2021 року. Ступінь Ph.D. з комп'ютерних та інформаційних наук (Computing and Information Sciences) я здобув у Rochester Institute of Technology у 2020 році; моя дисертація розробила інтегровану методику оцінювання якості та безпеки даних на мобільних пристроях.",
    },
    {
      en: "As a postdoctoral research scientist at RIT, I worked on automated vulnerability intelligence: using machine learning and expert systems to curate and characterize vulnerability reports. Before my doctoral studies I built software for Android, Windows and embedded systems, including leading an embedded development team.",
      uk: "Як постдокторський науковий співробітник RIT я працював над автоматизованою аналітикою вразливостей: застосуванням машинного навчання та експертних систем для курування й характеристики звітів про вразливості. До докторантури я розробляв програмне забезпечення для Android, Windows і вбудованих систем, зокрема керував командою розробки вбудованих систем.",
    },
  ] as Localized[],
};

export interface ExperienceItem {
  dates: Localized;
  role: Localized;
  place: string;
  note?: Localized;
}

export const experience: ExperienceItem[] = [
  {
    dates: { en: "2021 – present", uk: "2021 – дотепер" },
    role: { en: "Assistant Professor of Cybersecurity", uk: "Асистент-професор з кібербезпеки" },
    place: "Sacred Heart University, School of Computing & Engineering",
  },
  {
    dates: { en: "2020 – 2021", uk: "2020 – 2021" },
    role: { en: "Postdoctoral Research Scientist", uk: "Постдокторський науковий співробітник" },
    place: "Rochester Institute of Technology",
    note: { en: "Automated vulnerability intelligence", uk: "Автоматизована аналітика вразливостей" },
  },
  {
    dates: { en: "2016 – 2020", uk: "2016 – 2020" },
    role: { en: "Ph.D. student and research assistant", uk: "Аспірант і науковий асистент" },
    place: "Rochester Institute of Technology",
    note: { en: "Advisor: Dr. Leon Reznik", uk: "Науковий керівник: д-р Леон Резнік" },
  },
  {
    dates: { en: "2013 – 2015", uk: "2013 – 2015" },
    role: { en: "Embedded team leader", uk: "Керівник команди вбудованих систем" },
    place: "Dynamo Development",
    note: { en: "Android, Windows and embedded software", uk: "ПЗ для Android, Windows і вбудованих систем" },
  },
];

export const education: { degree: Localized; place: string; year: string }[] = [
  {
    degree: { en: "Ph.D., Computing and Information Sciences", uk: "Ph.D., Computing and Information Sciences" },
    place: "Rochester Institute of Technology",
    year: "2020",
  },
  {
    degree: { en: "Master's degree, Electronic Systems", uk: "Магістр, електронні системи" },
    place: "National Technical University of Ukraine “Igor Sikorsky Kyiv Polytechnic Institute”",
    year: "2007",
  },
  {
    degree: { en: "Bachelor's degree, Electronic Systems", uk: "Бакалавр, електронні системи" },
    place: "National Technical University of Ukraine “Igor Sikorsky Kyiv Polytechnic Institute”",
    year: "2005",
  },
];

export interface Grant {
  title: string;
  sponsor: string;
  role: Localized;
  dates: string;
  kind: Localized;
}

const coPI: Localized = { en: "Co-Principal Investigator", uk: "Співкерівник проєкту (Co-PI)" };

export const grants: Grant[] = [
  {
    title: "Increasing Perseverance and Retention of Computing and Engineering Students Through Service",
    sponsor: "National Science Foundation",
    role: coPI,
    dates: "2022 – 2027",
    kind: { en: "Education and student retention", uk: "Освіта та утримання студентів" },
  },
  {
    title: "Security Evaluation and Improvement of the Personal Cyberinfrastructure with New Tools and Education Development",
    sponsor: "CRDF Global",
    role: coPI,
    dates: "2021 – 2022",
    kind: { en: "Security research and education", uk: "Дослідження безпеки та освіта" },
  },
  {
    title: "Self-Learning Capabilities for Mission-Oriented Data Quality and Security Assurance in Military IoT Systems",
    sponsor: "U.S. Military Academy / Department of Defense",
    role: coPI,
    dates: "2020 – 2021",
    kind: { en: "Data quality and IoT security research", uk: "Дослідження якості даних і безпеки IoT" },
  },
];

export interface ServiceItem {
  date: Localized;
  title: Localized;
  context: Localized;
  href?: string;
}

export const talksAndService: ServiceItem[] = [
  {
    date: { en: "March 2026", uk: "Березень 2026" },
    title: { en: "Session chair, Security Testing", uk: "Голова секції Security Testing" },
    context: { en: "ICISSP 2026", uk: "ICISSP 2026" },
  },
  {
    date: { en: "January 2025", uk: "Січень 2025" },
    title: { en: "How AI Can Be Used to Enhance Your Cybersecurity", uk: "How AI Can Be Used to Enhance Your Cybersecurity" },
    context: { en: "BrightTALK webinar", uk: "Вебінар BrightTALK" },
    href: "https://www.sacredheart.edu/news-room/faculty--staff-in-the-news/",
  },
  {
    date: { en: "2024 – 2025", uk: "2024 – 2025" },
    title: { en: "Faculty Presidential Seminar participant", uk: "Учасник Президентського семінару для викладачів" },
    context: { en: "Sacred Heart University", uk: "Sacred Heart University" },
    href: "https://www.sacredheart.edu/offices--departments-directory/mission-and-culture/seminars-conversations--series/annual-presidential-seminars/faculty-presidential-seminar/",
  },
  {
    date: { en: "Ongoing", uk: "Постійно" },
    title: { en: "Artificial Intelligence Committee", uk: "Комітет зі штучного інтелекту" },
    context: {
      en: "Sacred Heart University, with curriculum and accreditation work",
      uk: "Sacred Heart University, а також робота над навчальними програмами й акредитацією",
    },
  },
  {
    date: { en: "Ongoing", uk: "Постійно" },
    title: { en: "Public talks on cybersecurity and privacy", uk: "Публічні лекції про кібербезпеку та приватність" },
    context: { en: "Local libraries and media appearances", uk: "Місцеві бібліотеки та виступи в медіа" },
  },
  {
    date: { en: "March 2018", uk: "Березень 2018" },
    title: { en: "Data Quality and Security Evaluation Framework, with Leon Reznik", uk: "Data Quality and Security Evaluation Framework, разом із Леоном Резніком" },
    context: { en: "Trusted CI webinar", uk: "Вебінар Trusted CI" },
    href: "https://sciencegateways.org/networking-community/community-news/n/trusted-ci-webinar-mar-26th-data-quality-and-security-evaluation-framework",
  },
];

export const profileLinks: { label: string; href: string; legacy?: boolean }[] = [
  { label: "Google Scholar", href: "https://scholar.google.com/citations?user=NrrJOskAAAAJ&hl=en" },
  { label: "Sacred Heart faculty profile", href: "https://www.sacredheart.edu/phonebook/igor-khokhlov.php" },
  { label: "Pure research portal", href: "https://sacredheart.elsevierpure.com/en/persons/igor-khokhlov/" },
  { label: "GitHub", href: "https://github.com/i-xoxol" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/igor-khokhlov-19415852" },
  { label: "Earlier personal site", href: "https://sites.google.com/view/igor-khokhlov/index", legacy: true },
];

export const personal: Localized = {
  en: "Outside work I repair and build electronics, operate as a licensed GMRS radio user, bake pizza and cook over an open fire, and spend weekends hiking and camping around New England.",
  uk: "Поза роботою я ремонтую та збираю електроніку, маю ліцензію радіооператора GMRS, печу піцу й готую на відкритому вогні, а вихідні проводжу в походах і кемпінгах Нової Англії.",
};
