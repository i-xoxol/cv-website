import type { Localized } from "./types";

export type ResearchStatus = "published" | "ongoing" | "in-progress";

export interface ResearchTheme {
  id: string;
  title: Localized;
  summary: Localized;
  question: Localized;
  method: Localized;
  output: Localized;
  status: ResearchStatus;
  statusNote: Localized;
  /** Publication ids from publications.ts. */
  publications: string[];
  links?: { label: Localized; href: string }[];
}

export const researchThemes: ResearchTheme[] = [
  {
    id: "metadata-privacy",
    title: { en: "Privacy and metadata-resistant communication", uk: "Приватність і зв'язок, стійкий до аналізу метаданих" },
    summary: {
      en: "G.H.O.S.T. studies how graph-based routing and decoy traffic can obscure message recipients. The research models privacy through entropy and examines the communication overhead and token incentives associated with different routing choices. The public repository contains simulation code and results accompanying the ICISSP 2026 paper.",
      uk: "G.H.O.S.T. досліджує, як маршрутизація на основі графів і маскувальний трафік можуть приховати отримувачів повідомлень. Дослідження моделює приватність через ентропію та вивчає комунікаційні витрати й токенні стимули для різних варіантів маршрутизації. Публічний репозиторій містить код симуляцій і результати до статті на ICISSP 2026.",
    },
    question: {
      en: "How well can decoy traffic keep an observer of the network from learning who a message was for, and what does that cost in bandwidth and incentives?",
      uk: "Наскільки добре маскувальний трафік заважає спостерігачеві мережі дізнатися, кому адресоване повідомлення, і скільки це коштує в пропускній здатності та стимулах?",
    },
    method: {
      en: "Simulations of decoy routing trees with varying depth and branching; Shannon entropy of the apparent recipient set; an intersection-attack experiment; modeled latency, saturation and token balances.",
      uk: "Симуляції дерев маскувальної маршрутизації з різною глибиною та розгалуженням; ентропія Шеннона для множини ймовірних отримувачів; експеримент з атакою перетину; змодельовані затримки, насичення та баланси токенів.",
    },
    output: {
      en: "Peer-reviewed conference paper (ICISSP 2026) and public simulation code with CSV results. Latency figures come from models, not from a deployed network.",
      uk: "Рецензована конференційна стаття (ICISSP 2026) та публічний код симуляцій з результатами у CSV. Показники затримки отримано з моделей, а не з розгорнутої мережі.",
    },
    status: "published",
    statusNote: { en: "Published 2026, with simulation artifacts", uk: "Опубліковано 2026, з артефактами симуляцій" },
    publications: ["ghost-icissp-2026"],
    links: [
      {
        label: { en: "Simulation code and data", uk: "Код і дані симуляцій" },
        href: "https://github.com/i-xoxol/GHOST-paper-data",
      },
    ],
  },
  {
    id: "ai-security",
    title: { en: "AI and machine learning for cybersecurity", uk: "ШІ та машинне навчання для кібербезпеки" },
    summary: {
      en: "This work runs in two directions: using machine learning to detect and characterize threats, and studying the threats that AI-enabled systems themselves face.",
      uk: "Ця робота має два напрями: використання машинного навчання для виявлення та характеристики загроз і дослідження загроз, яким піддаються самі системи зі штучним інтелектом.",
    },
    question: {
      en: "How far can automated analysis take over vulnerability curation from human analysts, and how robust are ML systems when their data or models are attacked or degraded?",
      uk: "Наскільки автоматизований аналіз може перебрати на себе курування вразливостей від аналітиків і наскільки стійкі ML-системи, коли їхні дані чи моделі атакують або вони деградують?",
    },
    method: {
      en: "LSTM models combined with expert systems for extracting software names from vulnerability reports; empirical validation against curated data; anomaly detection; a framework cataloguing attacks, defenses and tools for AI/ML systems.",
      uk: "Моделі LSTM у поєднанні з експертними системами для виділення назв ПЗ зі звітів про вразливості; емпірична перевірка на курованих даних; виявлення аномалій; фреймворк, що систематизує атаки, захист та інструменти для систем AI/ML.",
    },
    output: {
      en: "Journal article in IEEE Transactions on Software Engineering (2023), conference papers, and an arXiv preprint (2022). LLM and agent security is currently part of the CY-424 curriculum rather than a separate research project.",
      uk: "Стаття в IEEE Transactions on Software Engineering (2023), конференційні статті та препринт arXiv (2022). Безпека LLM та агентів наразі є частиною курсу CY-424, а не окремим дослідницьким проєктом.",
    },
    status: "ongoing",
    statusNote: { en: "Published 2022–2023; ongoing", uk: "Опубліковано 2022–2023; триває" },
    publications: ["tse-2023", "stc-2022", "arxiv-2022", "ijcnn-2022"],
  },
  {
    id: "data-quality",
    title: { en: "Data quality and security in mobile and IoT systems", uk: "Якість і безпека даних у мобільних та IoT-системах" },
    summary: {
      en: "I investigate how data quality and security can be evaluated together in mobile and IoT systems. This work develops evaluation frameworks and sensor-selection methods that account for both the usefulness of data and the security of the systems that produce it.",
      uk: "Я досліджую, як оцінювати якість і безпеку даних разом у мобільних та IoT-системах. Ця робота розвиває методики оцінювання та методи вибору сенсорів, що враховують і корисність даних, і безпеку систем, які їх створюють.",
    },
    question: {
      en: "When a system selects or combines sensor data, how should accuracy, reliability and the security of each source be weighed against each other?",
      uk: "Як системі, що обирає або поєднує дані сенсорів, зважувати точність, надійність і безпеку кожного джерела?",
    },
    method: {
      en: "Integral evaluation frameworks for smartphones, a knowledge base and knowledge graph of mobile sensors, genetic algorithms for sensor selection, and adaptive data fusion.",
      uk: "Інтегральні методики оцінювання для смартфонів, база знань і граф знань мобільних сенсорів, генетичні алгоритми для вибору сенсорів та адаптивне злиття даних.",
    },
    output: {
      en: "Journal articles in ACM JDIQ (2024), IEEE Systems Journal (2021) and IEEE Sensors Letters (2020), the doctoral dissertation, and a series of IEEE Sensors and WF-IoT papers.",
      uk: "Статті в ACM JDIQ (2024), IEEE Systems Journal (2021) та IEEE Sensors Letters (2020), докторська дисертація та низка статей на IEEE Sensors і WF-IoT.",
    },
    status: "published",
    statusNote: { en: "Published 2017–2024", uk: "Опубліковано 2017–2024" },
    publications: ["jdiq-2024", "sysj-2021", "sensl-2020", "wfiot-2020-kg", "sensors-2022-fusion", "sensors-2019"],
  },
  {
    id: "android-security",
    title: { en: "Mobile and Android security", uk: "Безпека мобільних пристроїв та Android" },
    summary: {
      en: "Collusion attacks happen when two or more apps coordinate, each staying within its own permissions, so that together they get around the boundaries that are supposed to keep them apart. This work detects that coordination and evaluates the security of Android devices.",
      uk: "Атаки змови відбуваються, коли два чи більше застосунків координують дії, кожен у межах власних дозволів, і разом обходять межі, які мали б їх ізолювати. Ця робота виявляє таку координацію та оцінює безпеку Android-пристроїв.",
    },
    question: {
      en: "Can coordinated behavior between apps be recognized from what the operating system observes while they run?",
      uk: "Чи можна розпізнати скоординовану поведінку застосунків за тим, що спостерігає операційна система під час їхньої роботи?",
    },
    method: {
      en: "Monitoring and processing of system signals, anomaly detection with machine learning, recurrent neural networks, and D.I.F.E.N.S.E., a distributed framework for Android security evaluation.",
      uk: "Моніторинг і обробка системних сигналів, виявлення аномалій методами машинного навчання, рекурентні нейронні мережі та D.I.F.E.N.S.E., розподілений фреймворк для оцінювання безпеки Android.",
    },
    output: {
      en: "Conference papers at IJCNN, ICMLA, the IEEE DASC/CyberSciTech congress and FRUCT, among others.",
      uk: "Конференційні статті на IJCNN, ICMLA, конгресі IEEE DASC/CyberSciTech, FRUCT та інших.",
    },
    status: "published",
    statusNote: { en: "Published 2017–2020", uk: "Опубліковано 2017–2020" },
    publications: ["ijcnn-2020", "icmla-2019-collusion", "wnyispw-2019", "asia-2019", "dasc-2017"],
  },
  {
    id: "bec",
    title: { en: "Business email compromise and explainable AI", uk: "Компрометація ділової пошти та пояснюваний ШІ" },
    summary: {
      en: "Ongoing work explores hybrid and explainable AI approaches to business email compromise detection, with attention to social engineering, message context, and explanations that help people evaluate alerts.",
      uk: "Поточна робота досліджує гібридні та пояснювані підходи ШІ до виявлення компрометації ділової пошти (BEC) з увагою до соціальної інженерії, контексту повідомлень і пояснень, які допомагають людям оцінювати сповіщення.",
    },
    question: {
      en: "Can a detector catch business email compromise and also explain its reasoning well enough for a person to decide what to do with the alert?",
      uk: "Чи може детектор виявляти компрометацію ділової пошти й водночас пояснювати своє рішення достатньо добре, щоб людина могла вирішити, що робити зі сповіщенням?",
    },
    method: {
      en: "A hybrid of natural language processing, machine learning and rules, with explainable AI techniques.",
      uk: "Поєднання обробки природної мови, машинного навчання та правил із методами пояснюваного ШІ.",
    },
    output: {
      en: "Manuscript in preparation; no publication yet.",
      uk: "Рукопис у підготовці; публікації поки немає.",
    },
    status: "in-progress",
    statusNote: { en: "Work in progress", uk: "Робота триває" },
    publications: [],
  },
];
