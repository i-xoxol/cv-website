import type { Localized } from "./types";

export interface Project {
  id: string;
  name: string;
  kind: Localized;
  description: Localized;
  scope: Localized;
  links: { label: Localized; href: string }[];
}

export const projects: Project[] = [
  {
    id: "ghost",
    name: "G.H.O.S.T. simulation code and data",
    kind: { en: "Research artifact", uk: "Дослідницький артефакт" },
    description: {
      en: "Python simulations and CSV results accompanying the ICISSP 2026 paper: entropy measurements, an intersection-attack experiment, modeled latency and saturation, communication overhead, and token economics.",
      uk: "Симуляції на Python і результати у CSV до статті ICISSP 2026: вимірювання ентропії, експеримент з атакою перетину, змодельовані затримка й насичення, комунікаційні витрати та економіка токенів.",
    },
    scope: {
      en: "Simulation artifacts only. The repository does not contain a deployed messaging network or an Ethereum smart-contract implementation.",
      uk: "Лише артефакти симуляцій. Репозиторій не містить розгорнутої мережі обміну повідомленнями чи реалізації смарт-контракту Ethereum.",
    },
    links: [
      { label: { en: "Repository", uk: "Репозиторій" }, href: "https://github.com/i-xoxol/GHOST-paper-data" },
      { label: { en: "Paper (DOI)", uk: "Стаття (DOI)" }, href: "https://doi.org/10.5220/0014610100004061" },
    ],
  },
  {
    id: "authmodulelab",
    name: "Authentication Module Lab",
    kind: { en: "Teaching example", uk: "Навчальний приклад" },
    description: {
      en: "Educational authentication examples in Python and Java: registration, salted password hashing, login, logout and session handling, with a small Flask API, browser pages and unit test examples.",
      uk: "Навчальні приклади автентифікації на Python і Java: реєстрація, хешування паролів із сіллю, вхід, вихід і керування сесіями, а також невеликий Flask API, вебсторінки та приклади модульних тестів.",
    },
    scope: {
      en: "Built for studying authentication design, not for production use. It hashes passwords with salted SHA-256, stores users in a local JSON file and keeps sessions in memory without expiry.",
      uk: "Створено для вивчення архітектури автентифікації, а не для промислового використання. Паролі хешуються SHA-256 із сіллю, користувачі зберігаються в локальному JSON-файлі, а сесії тримаються в пам'яті без терміну дії.",
    },
    links: [{ label: { en: "Repository", uk: "Репозиторій" }, href: "https://github.com/i-xoxol/AuthModuleLab" }],
  },
];
