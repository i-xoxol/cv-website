import type { Localized } from "./types";

export interface CurrentCourse {
  code: string;
  title: string;
  level: Localized;
  term: Localized;
  description: Localized;
  publicMaterials?: { label: Localized; href: string }[];
}

const undergraduate: Localized = { en: "Undergraduate", uk: "Бакалаврат" };
const fall2026: Localized = { en: "Fall 2026", uk: "Осінь 2026" };

/** Courses assigned for Fall 2026. Full course repositories are private. */
export const currentCourses: CurrentCourse[] = [
  {
    code: "CY-212 / ITI-212",
    title: "Web Development in UNIX",
    level: undergraduate,
    term: fall2026,
    description: {
      en: "Students build accessible, responsive web applications with HTML, CSS, JavaScript, server-side code, SQL, Git and UNIX workflows. Security is part of the build from the start: forms, authentication, sessions, database access and deployment are all done with secure practices.",
      uk: "Студенти створюють доступні адаптивні вебзастосунки з HTML, CSS, JavaScript, серверним кодом, SQL, Git і робочими процесами UNIX. Безпека закладається від початку: форми, автентифікація, сесії, доступ до бази даних і розгортання виконуються з дотриманням безпечних практик.",
    },
  },
  {
    code: "CY-221",
    title: "Foundations of Cybersecurity",
    level: undergraduate,
    term: fall2026,
    description: {
      en: "An introduction to security principles, assets, threats, risk, human factors, identity and incident response. Practical cases train students to explain security decisions to both technical and nontechnical audiences.",
      uk: "Вступ до принципів безпеки, активів, загроз, ризиків, людського чинника, ідентичності та реагування на інциденти. На практичних кейсах студенти вчаться пояснювати рішення з безпеки як технічній, так і нетехнічній аудиторії.",
    },
  },
  {
    code: "CY-410",
    title: "Software and System Security",
    level: undergraduate,
    term: fall2026,
    description: {
      en: "Brings together threat modeling, secure architecture, identity and access control, vulnerability management, cryptography, monitoring, incident response, and software and mobile security. Students apply them in hands-on labs and a final project.",
      uk: "Поєднує моделювання загроз, безпечну архітектуру, керування ідентичністю та доступом, керування вразливостями, криптографію, моніторинг, реагування на інциденти, а також безпеку програмного забезпечення та мобільних систем. Студенти застосовують це в практичних лабораторних і фінальному проєкті.",
    },
    publicMaterials: [
      {
        label: { en: "Authentication lab (educational example)", uk: "Лабораторна з автентифікації (навчальний приклад)" },
        href: "https://github.com/i-xoxol/AuthModuleLab",
      },
    ],
  },
  {
    code: "CY-424",
    title: "Emerging Trends in Cybersecurity",
    level: undergraduate,
    term: fall2026,
    description: {
      en: "Examines AI both as a defensive tool and as an attack surface. Topics include adversarial machine learning, security of LLM applications, risks of retrieval-augmented generation and agents, software supply chains, cloud identity, post-quantum migration and critical infrastructure.",
      uk: "Розглядає ШІ і як інструмент захисту, і як поверхню атаки. Теми: змагальне машинне навчання, безпека застосунків на основі LLM, ризики RAG та агентів, ланцюги постачання ПЗ, хмарна ідентичність, перехід на постквантову криптографію та критична інфраструктура.",
    },
  },
];

export interface PortfolioCourse {
  code?: string;
  title: string;
}

export interface PortfolioGroup {
  id: string;
  label: Localized;
  note?: Localized;
  courses: PortfolioCourse[];
}

export const teachingPortfolio: PortfolioGroup[] = [
  {
    id: "graduate",
    label: { en: "Graduate courses at Sacred Heart University", uk: "Магістерські курси в Sacred Heart University" },
    courses: [
      { code: "CS/CY 626", title: "Introduction to Cybersecurity" },
      { code: "CS 627", title: "System Security" },
      { code: "CS/CY 660", title: "Special Topics in Cybersecurity" },
      { code: "CY 680", title: "Cybersecurity Practicum" },
      { code: "CS 690", title: "Thesis I" },
      { code: "CY 691", title: "Thesis II" },
    ],
  },
  {
    id: "undergraduate",
    label: {
      en: "Undergraduate courses and supervision at Sacred Heart University",
      uk: "Бакалаврські курси та керівництво в Sacred Heart University",
    },
    courses: [
      { code: "CS 241", title: "C Programming Concepts" },
      { code: "CSE/CY 125", title: "Explorations" },
      { code: "CY 413", title: "Internship in Cybersecurity" },
      { code: "CY 414", title: "Directed Research" },
      { code: "CY 417/418", title: "Cybersecurity Capstone I and II" },
      { code: "CY 419", title: "Cooperative Studies" },
    ],
  },
  {
    id: "earlier",
    label: { en: "Earlier teaching", uk: "Попередній викладацький досвід" },
    courses: [
      { title: "Foundations of Intelligent Systems (Rochester Institute of Technology)" },
      { title: "Computer Systems (Rochester Institute of Technology)" },
      { title: "Object-Oriented Programming (Igor Sikorsky Kyiv Polytechnic Institute)" },
    ],
  },
];

export const teachingStatement: Localized = {
  en: "My courses connect security concepts with practical work. Students build and analyze systems, evaluate evidence, explain tradeoffs and communicate recommendations. Assignments include guided cases, programming, controlled security labs, research briefs, demonstrations and capstone projects.",
  uk: "Мої курси поєднують концепції безпеки з практичною роботою. Студенти створюють та аналізують системи, оцінюють докази, пояснюють компроміси та формулюють рекомендації. Завдання включають кейси з супроводом, програмування, контрольовані лабораторні з безпеки, дослідницькі огляди, демонстрації та капстоун-проєкти.",
};

export const teachingMethods: { title: Localized; body: Localized }[] = [
  {
    title: { en: "Build and analyze", uk: "Створити та проаналізувати" },
    body: {
      en: "Students write working software and then examine its design for weaknesses, as in the authentication lab, so secure design is something they practice rather than memorize.",
      uk: "Студенти пишуть робоче програмне забезпечення, а потім шукають слабкі місця в його архітектурі, як у лабораторній з автентифікації, тож безпечне проєктування вони практикують, а не завчають.",
    },
  },
  {
    title: { en: "Controlled labs", uk: "Контрольовані лабораторні" },
    body: {
      en: "Security exercises run in isolated environments with fictional data, which lets students try real techniques without touching real systems.",
      uk: "Вправи з безпеки виконуються в ізольованих середовищах з вигаданими даними, тож студенти пробують реальні техніки, не зачіпаючи реальних систем.",
    },
  },
  {
    title: { en: "Evidence and explanation", uk: "Докази та пояснення" },
    body: {
      en: "Research briefs and presentations ask students to support a security recommendation with evidence and explain it to the audience that has to act on it.",
      uk: "Дослідницькі огляди та презентації вимагають підкріпити рекомендацію з безпеки доказами й пояснити її тим, хто має діяти відповідно до неї.",
    },
  },
];

export const mentoring = {
  kinds: [
    { en: "Undergraduate capstone projects", uk: "Бакалаврські капстоун-проєкти" },
    { en: "Independent and directed research", uk: "Самостійні та кероване дослідження" },
    { en: "Graduate theses", uk: "Магістерські дипломні роботи" },
    { en: "Internships and cooperative studies", uk: "Стажування та кооперативне навчання" },
    { en: "Cybersecurity practicum", uk: "Практикум з кібербезпеки" },
  ] as Localized[],
  example: {
    en: "Owen Weissman presented a privacy-messenger project at Sacred Heart's 2025 Academic Festival. That work fed into G.H.O.S.T., which was published at ICISSP 2026 with Owen as a coauthor.",
    uk: "Овен Вайсман представив проєкт приватного месенджера на Академічному фестивалі Sacred Heart 2025 року. Ця робота стала частиною G.H.O.S.T., опублікованої на ICISSP 2026, де Овен є співавтором.",
  } as Localized,
  invitation: {
    en: "Students interested in research in these areas are welcome to email me to talk about their interests.",
    uk: "Студенти, яких цікавлять дослідження в цих напрямах, можуть написати мені, щоб обговорити свої інтереси.",
  } as Localized,
};
