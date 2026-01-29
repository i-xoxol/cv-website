"use client";

import { useMemo, useState, useEffect, useRef } from "react";

const content = {
  en: {
    nav: {
      whoami: "Whoami",
      research: "Research",
      git: "Neural Repos",
      expertise: "Expertise",
      timeline: "Academic Timeline",
      publications: "Publications",
      hobbies: "Beyond the Lab",
      contact: "Contact",
    },
    hero: {
      name: "Dr. Igor Khokhlov",
      title: "Assistant Professor of Cybersecurity",
      subtitle: "Sacred Heart University | Fairfield, CT",
      cta: "Download CV",
    },
    whoami: {
      title: "whoami",
      lines: [
        "Assistant Professor of Cybersecurity at Sacred Heart University (SHU).",
        "Expert in Computer Security, Data & Information Management, AI/ML, and Android Development.",
        "PhD in Computing and Information Sciences from Rochester Institute of Technology (2020).",
        "Passionate about building resilient, intelligent systems for a secure digital future.",
      ],
    },
    research: {
      title: "Active Research",
      expandText: "Access Kernel Data",
      sections: [
        {
          id: "dq-ai",
          label: "Data Quality & AI",
          detail: "Bridging computer security, privacy, and ML to create novel evaluation frameworks.",
          img: "/cyber-shield.png",
          fullInfo: "Developing a comprehensive framework that merges conventional data quality metrics with cybersecurity considerations. The research initially focuses on Android devices, aiming to provide invaluable security estimates that empower data consumers to make informed decisions about their privacy and data integrity."
        },
        {
          id: "mobile-sec",
          label: "Mobile Security",
          detail: "Investigating cutting-edge techniques to detect 'colluded applications' attacks.",
          img: "/android-sec.png",
          fullInfo: "My research investigates the detection and mitigation of collusion attacks, where multiple malicious applications coordinate to bypass system security and exfiltrate user data. By leveraging AI/ML models, we can identify these sophisticated patterns and significantly enhance mobile privacy protection."
        },
        {
          id: "ukraine",
          label: "The 'UKRAINE' Project",
          detail: "Focused on the security of microgrids and critical infrastructure resilience.",
          img: "/ai-lab.png",
          fullInfo: "This pivotal research focused on ensuring the cyber-physical resilience of microgrids—autonomous energy systems that can operate independently of the main grid. The project investigated threat modeling and defensive strategies for critical infrastructure (currently paused due to international conflict)."
        },
      ],
    },
    git: {
      title: "Neural Repositories",
      blurb: "A technical deep-dive into my active development and research kernels.",
      expandText: "Expand Kernel",
      projects: [
        {
          id: "ghost",
          name: "G.H.O.S.T. Framework",
          repo: "GHOST-paper-data",
          tag: "Research",
          detail: "A scalable architecture for Metadata-Resistant Messaging (Private Messenger).",
          fullInfo: "Formerly 'Private Messenger', the G.H.O.S.T. framework implements Token-Based Incentives and rigorous entropy analysis to ensure secure, asynchronous communication. This core research focuses on minimizing metadata leakage and ensuring end-to-end user anonymity in high-threat environments, backed by extensive simulation data."
        },
        {
          id: "cy-lab",
          name: "Secure Development Lab",
          repo: "AuthModuleLab",
          tag: "Academic",
          detail: "Comprehensive instructional environment for CY-410 (Software and System Security).",
          fullInfo: "A production-grade educational lab environment designed to teach the fundamentals of the CIA triad. Students engage with real-world scenarios involving cryptographic salting, SHA-256 hashing, and automated security verification pipelines."
        }
      ]
    },
    expertise: {
      title: "Expertise Matrix",
      items: [
        {
          label: "Cybersecurity",
          detail: "Threat modeling, intrusion detection, and cyber-physical resilience.",
        },
        {
          label: "AI/ML",
          detail: "Applied ML for security, anomaly detection, and intelligent sensors.",
        },
        {
          label: "Mobile Development",
          detail: "Advanced Android development (JNI/JNA), security evaluation, and Play Store delivery.",
        },
        {
          label: "Data Governance",
          detail: "Information management, data quality metrics, and secure sensor fusion.",
        },
      ],
    },
    timeline: {
      title: "Transmission History",
      items: [
        {
          date: "2021–Present",
          role: "Assistant Professor",
          place: "Sacred Heart University (SHU), Fairfield, CT",
          img: "/academic-node.png"
        },
        {
          date: "2020–2021",
          role: "Postdoctoral Research Scientist",
          place: "Rochester Institute of Technology (RIT), NY",
        },
        {
          date: "2016–2020",
          role: "PhD Candidate / Research Assistant",
          place: "RIT (Advisors: Dr. Leon Reznik)",
        },
        {
          date: "2013–2015",
          role: "Embedded Team Leader",
          place: "Dynamo Development (Android/Windows App Dev)",
        },
        {
          date: "2001–2007",
          role: "MS / BS in Electronic Systems",
          place: "National Technical University of Ukraine 'KPI'",
        },
      ],
    },
    publications: {
      title: "Selected Nodes",
      blurb:
        "Over 30 publications (2017-2024) with focus on Sensors, Data Quality, and Mobile Security. Full repository available via:",
      links: [
        { label: "Google Scholar", href: "https://scholar.google.com/citations?user=NrrJOskAAAAJ&hl=en" },
        { label: "SHU Faculty Page", href: "https://www.sacredheart.edu/phonebook/igor-khokhlov.php" },
        { label: "Pure Portal (Elsevier)", href: "https://sacredheart.elsevierpure.com/en/persons/igor-khokhlov/" },
        { label: "Personal Site", href: "https://sites.google.com/view/igor-khokhlov/index" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/igor-khokhlov-19415852" },
      ],
    },
    hobbies: {
      title: "Beyond the Lab",
      items: [
        {
          label: "Tech & Gaming",
          detail: "AI/ML foundations, VR fitness on Meta Quest 3 (FitXR), and hands-on electronics repair.",
          img: "/ai-lab.png"
        },
        {
          label: "DIY & Radio",
          detail: "Licensed GMRS operator (North Haven Repeater), home improvement with RYOBI power tools.",
          img: "/radio-tower.png"
        },
        {
          label: "Culinary Arts",
          detail: "Avid baker (pizza dough, specialty sauces) and master of traditional outdoor shashlik.",
          img: "/cyber-cooking.png"
        },
        {
          label: "Outdoors",
          detail: "Camping at Lake Waramaug, hiking New England waterfalls, and New Haven local explorer.",
          img: "/cyber-nature.png"
        },
      ],
    },
    contact: {
      title: "Secure Uplink",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Transmit Message",
      success: "Transmission Successful",
      error: "Transmission Failed",
    },
  },
  uk: {
    nav: {
      whoami: "Whoami",
      research: "Дослідження",
      git: "Neural Repos",
      expertise: "Експертиза",
      timeline: "Академічний шлях",
      publications: "Публікації",
      hobbies: "Поза лабораторією",
      contact: "Контакт",
    },
    hero: {
      name: "Д-р Ігор Хохлов",
      title: "Доцент з кібербезпеки",
      subtitle: "Sacred Heart University | Ферфілд, Коннектикут",
      cta: "Завантажити CV",
    },
    whoami: {
      title: "whoami",
      lines: [
        "Доцент з кібербезпеки в Sacred Heart University (SHU).",
        "Експерт з комп'ютерної безпеки, управління даними, AI/ML та розробки під Android.",
        "Ступінь PhD з Computing and Information Sciences (Rochester Institute of Technology, 2020).",
        "Прагну створювати стійкі інтелектуальні системи для безпечного цифрового майбутнього.",
      ],
    },
    research: {
      title: "Активні дослідження",
      expandText: "Деталі ядра",
      sections: [
        {
          id: "dq-ai",
          label: "Якість даних та ШІ",
          detail: "Поєднання кібербезпеки, приватності та ML для створення нових методик оцінки.",
          img: "/cyber-shield.png",
          fullInfo: "Розробка комплексної структури, що поєднує традиційні метрики якості даних із міркуваннями кібербезпеки. Дослідження спочатку зосереджується на пристроях Android, маючи на меті надати безцінні оцінки безпеки, які дозволять споживачам даних приймати обґрунтовані рішення щодо своєї приватності та цілісності даних."
        },
        {
          id: "mobile-sec",
          label: "Мобільна безпека",
          detail: "Дослідження передових методів виявлення атак 'корумпованих додатків'.",
          img: "/android-sec.png",
          fullInfo: "Моє дослідження вивчає виявлення та пом'якшення наслідків атак за змовою, де кілька шкідливих програм координують дії для обходу безпеки системи та викрадення даних користувачів. Використовуючи моделі AI/ML, ми можемо ідентифікувати ці складні патерни та значно покращити захист приватності в мобільних мережах."
        },
        {
          id: "ukraine",
          label: "Проєкт 'UKRAINE'",
          detail: "Робота над безпекою мікромереж та стійкістю критичної інфраструктури.",
          img: "/ai-lab.png",
          fullInfo: "Це ключове дослідження було зосереджено на забезпеченні кібер-фізичної стійкості мікромереж — автономних енергетичних систем, які можуть працювати незалежно від основної мережі. Проект досліджував моделювання загроз і стратегії захисту для критичної інфраструктури (наразі призупинено через війну)."
        },
      ],
    },
    git: {
      title: "Neural Repositories",
      blurb: "Технічний огляд моїх активних розробок та дослідницьких проектів.",
      expandText: "Розгорнути ядро",
      projects: [
        {
          id: "ghost",
          name: "Фреймворк G.H.O.S.T.",
          repo: "GHOST-paper-data",
          tag: "Research",
          detail: "Масштабована архітектура для месенджерів (Private Messenger), стійких до аналізу метаданих.",
          fullInfo: "Раніше відомий як 'Private Messenger', фреймворк G.H.O.S.T. реалізує систему винагород на основі токенів та суворий аналіз ентропії для забезпечення безпечного асинхронного зв'язку. Це основне дослідження зосереджено на мінімізації витоку метаданих та забезпеченні анонімності користувачів у середовищах з високим рівнем загроз."
        },
        {
          id: "cy-lab",
          name: "Лабораторія безпечної розробки",
          repo: "AuthModuleLab",
          tag: "Academic",
          detail: "Комплексне середовище для курсу CY-410 (Software and System Security).",
          fullInfo: "Навчальне середовище промислового рівня, розроблене для викладання основ тріади CIA. Студенти працюють з реальними сценаріями, що включають криптографічне сольтування, хешування SHA-256 та автоматизовані конвеєри перевірки безпеки."
        }
      ]
    },
    expertise: {
      title: "Матриця експертизи",
      items: [
        {
          label: "Кібербезпека",
          detail: "Моделювання загроз, виявлення вторгнень та кібер-фізична стійкість.",
        },
        {
          label: "AI/ML",
          detail: "Прикладний ML для безпеки, виявлення аномалій та інтелектуальні сенсори.",
        },
        {
          label: "Розробка ПЗ",
          detail: "Просунута Android-розробка (JNI/JNA), оцінка безпеки та публікація в Play Store.",
        },
        {
          label: "Дані",
          detail: "Управління інформацією, метрики якості даних та безпечне об'єднання сенсорів.",
        },
      ],
    },
    timeline: {
      title: "Історія трансляцій",
      items: [
        {
          date: "2021–дотепер",
          role: "Доцент",
          place: "Sacred Heart University (SHU), Ферфілд, Коннектикут",
          img: "/academic-node.png"
        },
        {
          date: "2020–2021",
          role: "Postdoctoral Research Scientist",
          place: "Rochester Institute of Technology (RIT), Нью-Йорк",
        },
        {
          date: "2016–2020",
          role: "PhD Кандидат / Науковий співробітник",
          place: "RIT (керівник: д-р Леон Резнік)",
        },
        {
          date: "2013–2015",
          role: "Embedded Team Leader",
          place: "Dynamo Development (Android/Windows розробка)",
        },
        {
          date: "2001–2007",
          role: "MS / BS з електроніки",
          place: "Національний технічний університет України 'КПІ'",
        },
      ],
    },
    publications: {
      title: "Вибрані вузли",
      blurb:
        "Понад 30 публікацій (2017-2024) у сферах сенсорів, якості даних та мобільної безпеки. Повні репозиторії доступні за посиланнями:",
      links: [
        { label: "Google Scholar", href: "https://scholar.google.com/citations?user=NrrJOskAAAAJ&hl=en" },
        { label: "Сторінка SHU", href: "https://www.sacredheart.edu/phonebook/igor-khokhlov.php" },
        { label: "Pure Portal (Elsevier)", href: "https://sacredheart.elsevierpure.com/en/persons/igor-khokhlov/" },
        { label: "Персональний сайт", href: "https://sites.google.com/view/igor-khokhlov/index" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/igor-khokhlov-19415852" },
      ],
    },
    hobbies: {
      title: "Поза лабораторією",
      items: [
        {
          label: "Технології",
          detail: "Основи AI/ML, VR-фітнес на Meta Quest 3 (FitXR) та ремонт електроніки.",
          img: "/ai-lab.png"
        },
        {
          label: "DIY та Радіо",
          detail: "Ліцензований GMRS оператор, ремонт дому інструментами RYOBI.",
          img: "/radio-tower.png"
        },
        {
          label: "Кулінарія",
          detail: "Завзятий пекар (тісто для піци, фірмові соуси) та майстер традиційного шашлика.",
          img: "/cyber-cooking.png"
        },
        {
          label: "Природа",
          detail: "Кемпінг на Lake Waramaug, хайкінг водоспадами Нової Англії та дослідження Нью-Гейвена.",
          img: "/cyber-nature.png"
        },
      ],
    },
    contact: {
      title: "Безпечний зв'язок",
      name: "Ім'я",
      email: "Email",
      message: "Повідомлення",
      send: "Надіслати",
      success: "Повідомлення надіслано",
      error: "Помилка надсилання",
    },
  },
};

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const columns = Math.floor(width / 20);
    const drops: number[] = new Array(columns).fill(1);

    const charList = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ마미ムメモ야유요ラリルレロワヲン";

    const draw = () => {
      ctx.fillStyle = "rgba(5, 7, 10, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00f5a0";
      ctx.font = "15px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = charList.charAt(Math.floor(Math.random() * charList.length));
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-20" />;
}

function Modal({ isOpen, onClose, title, content, img }: { isOpen: boolean, onClose: () => void, title: string, content: string, img?: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-night/60 backdrop-blur-xl animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative terminal rounded-3xl max-w-2xl w-full overflow-hidden shadow-[0_0_50px_rgba(0,245,160,0.2)]">
        {img && (
          <div className="h-64 overflow-hidden border-b border-cyan/20">
            <img src={img} alt={title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
        )}
        <div className="p-10">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-orbitron text-2xl text-neon">{title}</h3>
            <button onClick={onClose} className="text-cyan hover:text-neon transition-colors font-mono text-xl">✕</button>
          </div>
          <p className="text-slate-300 leading-relaxed text-lg">
            {content}
          </p>
          <div className="mt-8 pt-6 border-t border-cyan/10">
            <button onClick={onClose} className="text-[10px] uppercase tracking-[0.4em] text-cyan hover:text-neon transition-colors">
              Close Encryption Layer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to track if an element is in focus (scrolled into center of view)
 */
function useInFocus(threshold = 0.5) {
  const [isInFocus, setIsInFocus] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInFocus(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return { ref, isInFocus };
}

function RevealCard({ children, onClick, img, expandText, title, detail, className }: { 
  children?: React.ReactNode, 
  onClick?: () => void, 
  img?: string, 
  expandText?: string, 
  title?: string, 
  detail?: string,
  className?: string
}) {
  const { ref, isInFocus } = useInFocus(0.6);
  
  return (
    <div 
      ref={ref}
      onClick={onClick}
      className={`terminal rounded-2xl overflow-hidden border border-neon/20 hover:border-neon transition-all group cursor-pointer ${isInFocus ? 'reveal-active' : ''} ${className || ''}`}
    >
      {img && (
        <div className="h-48 overflow-hidden border-b border-cyan/20 relative">
          <img 
            src={img} 
            alt={title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-[.reveal-active]:grayscale-0 transition-all duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-night/40 group-hover:bg-transparent group-[.reveal-active]:bg-transparent transition-colors flex items-center justify-center">
             <span className="text-[10px] uppercase tracking-[0.4em] text-white opacity-0 group-hover:opacity-100 group-[.reveal-active]:opacity-100 transition-opacity bg-night/60 px-4 py-2 rounded-full border border-neon/40">
               {expandText}
             </span>
          </div>
        </div>
      )}
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-orbitron text-xl text-cyan group-hover:text-neon group-[.reveal-active]:text-neon transition-colors">{title}</h3>
          <span className="text-neon text-xl group-hover:translate-x-1 group-[.reveal-active]:translate-x-1 transition-transform">→</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

function ProfilePhoto() {
  const { ref, isInFocus } = useInFocus(0.5);
  
  return (
    <div ref={ref} className={`relative group max-w-[240px] mx-auto md:max-w-none md:w-full ${isInFocus ? 'reveal-active' : ''}`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-neon to-cyan rounded-2xl blur opacity-25 group-hover:opacity-50 group-[.reveal-active]:opacity-50 transition duration-1000"></div>
      <img 
        src="/igor-profile.jpg" 
        alt="Dr. Igor Khokhlov" 
        className="relative rounded-2xl grayscale hover:grayscale-0 group-[.reveal-active]:grayscale-0 transition-all duration-500 border border-cyan/20 w-full shadow-2xl"
      />
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<"en" | "uk">("en");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [activeModal, setActiveModal] = useState<{title: string, content: string, img?: string} | null>(null);
  
  const data = useMemo(() => content[lang], [lang]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormState("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setFormState("error");
      }
    } catch (err) {
      setFormState("error");
    }
  };

  return (
    <div className="min-h-screen bg-night text-slate-100 font-mono scroll-smooth">
      <MatrixRain />
      
      <Modal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)}
        title={activeModal?.title || ""}
        content={activeModal?.content || ""}
        img={activeModal?.img}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-night/80 backdrop-blur-md border-b border-cyan/10 hidden md:block">
        <div className="max-w-7xl mx-auto px-12 py-4 flex justify-between items-center">
           <div className="font-orbitron text-neon text-xs tracking-[0.4em] uppercase">I.Khokhlov</div>
           <div className="flex gap-8 text-[10px] uppercase tracking-widest text-slate-400">
             <a href="#whoami" className="hover:text-neon transition-colors">{data.nav.whoami}</a>
             <a href="#research" className="hover:text-neon transition-colors">{data.nav.research}</a>
             <a href="#git" className="hover:text-neon transition-colors">{data.nav.git}</a>
             <a href="#expertise" className="hover:text-neon transition-colors">{data.nav.expertise}</a>
             <a href="#timeline" className="hover:text-neon transition-colors">{data.nav.timeline}</a>
             <a href="#publications" className="hover:text-neon transition-colors">{data.nav.publications}</a>
             <a href="#hobbies" className="hover:text-neon transition-colors">{data.nav.hobbies}</a>
             <a href="#contact" className="hover:text-neon transition-colors font-bold text-cyan">{data.nav.contact}</a>
           </div>
        </div>
      </nav>

      <div className="relative overflow-hidden border-b border-neon/20 pt-8 md:pt-24">
        <div className="absolute inset-0 bg-[url('/hero-cyber.png')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/20 via-night/60 to-night" />
        
        <header className="relative z-10 flex items-center justify-between px-6 py-8 md:px-12">
          <div className="font-orbitron text-xs uppercase tracking-[0.4em] text-neon animate-pulse">
             System Status: Online
          </div>
          <button
            className="rounded-full border border-cyan/40 bg-night/60 px-5 py-2 text-xs uppercase tracking-widest text-cyan hover:border-neon hover:text-neon transition-all"
            onClick={() => setLang(lang === "en" ? "uk" : "en")}
          >
            {lang === "en" ? "UA" : "EN"}
          </button>
        </header>

        <main className="relative z-10 px-6 pb-24 md:px-12">
          <section className="relative max-w-5xl py-12 md:py-20">
            <div className="grid gap-12 md:grid-cols-[2fr_1fr] items-center">
              <div>
                <p className="font-orbitron text-xs uppercase tracking-[0.5em] text-cyan mb-4">
                  {data.hero.subtitle}
                </p>
                <h1
                  className="glitch font-orbitron text-5xl font-bold text-neon md:text-7xl lg:text-8xl"
                  data-text={data.hero.name}
                >
                  {data.hero.name}
                </h1>
                <p className="mt-8 text-xl text-slate-200 md:text-3xl font-light">
                  {data.hero.title}
                </p>
                <div className="mt-12 flex flex-wrap gap-6">
                  <a
                    className="group relative overflow-hidden rounded-full border border-neon/70 bg-night/70 px-8 py-4 text-sm uppercase tracking-[0.25em] text-neon shadow-[0_0_15px_rgba(0,245,160,0.3)] hover:shadow-[0_0_25px_rgba(0,245,160,0.5)] transition-all"
                    href="/Igor_Khokhlov_CV.pdf"
                  >
                    <span className="relative z-10">{data.hero.cta}</span>
                    <div className="absolute inset-0 translate-y-full bg-neon/10 group-hover:translate-y-0 transition-transform" />
                  </a>
                </div>
              </div>
              
              <div className="block">
                <ProfilePhoto />
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className="relative z-10">
        <section id="whoami" className="relative px-6 py-24 md:px-12 border-b border-cyan/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-orbitron text-3xl text-neon mb-12 flex items-center gap-4">
              <span className="text-cyan text-sm tracking-widest">01.</span> {data.whoami.title}
            </h2>
            <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr]">
              <div className="terminal rounded-2xl p-8 backdrop-blur-md">
                <p className="mb-6 text-neon font-mono">$ cat about_me.txt</p>
                <ul className="space-y-4 text-slate-200 text-lg leading-relaxed">
                  {data.whoami.lines.map((line) => (
                    <li key={line} className="flex gap-4">
                      <span className="text-neon opacity-50">&gt;</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="terminal rounded-2xl p-8 backdrop-blur-md border-neon/10">
                <h3 className="font-orbitron text-xl text-cyan mb-6">System Parameters</h3>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex justify-between border-b border-cyan/10 pb-2">
                    <span className="text-neon/80 uppercase text-[10px] tracking-tighter">HQ</span>
                    <span className="text-sm">Fairfield, CT</span>
                  </li>
                  <li className="flex justify-between border-b border-cyan/10 pb-2">
                    <span className="text-neon/80 uppercase text-[10px] tracking-tighter">Clock</span>
                    <span className="text-sm">America/New_York</span>
                  </li>
                  <li className="flex justify-between border-b border-cyan/10 pb-2">
                    <span className="text-neon/80 uppercase text-[10px] tracking-tighter">Affiliation</span>
                    <span className="text-sm">Sacred Heart University</span>
                  </li>
                  <li className="flex justify-between border-b border-cyan/10 pb-2">
                    <span className="text-neon/80 uppercase text-[10px] tracking-tighter">Stack</span>
                    <span className="text-xs text-right max-w-[150px]">Cybersecurity, AI/ML, Android</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="research" className="px-6 py-24 md:px-12 border-b border-cyan/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-orbitron text-3xl text-neon mb-12 flex items-center gap-4">
              <span className="text-cyan text-sm tracking-widest">02.</span> {data.research.title}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {data.research.sections.map((section) => (
                <RevealCard
                  key={section.id}
                  title={section.label}
                  detail={section.detail}
                  img={section.img}
                  expandText={data.research.expandText}
                  onClick={() => setActiveModal({title: section.label, content: section.fullInfo, img: section.img})}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="git" className="px-6 py-24 md:px-12 border-b border-cyan/10 bg-night/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-orbitron text-3xl text-neon mb-4 flex items-center gap-4">
              <span className="text-cyan text-sm tracking-widest">03.</span> {data.git.title}
            </h2>
            <p className="text-slate-400 mb-12 max-w-2xl">{data.git.blurb}</p>
            <div className="grid gap-6 md:grid-cols-2">
              {data.git.projects.map((project) => (
                <RevealCard
                  key={project.id}
                  title={project.name}
                  detail={project.detail}
                  className="p-0" // Reset terminal padding for internal styling
                  onClick={() => setActiveModal({title: project.name, content: project.fullInfo})}
                >
                  {/* Custom inner layout for Git projects if needed, or just use the generic RevealCard */}
                </RevealCard>
              ))}
            </div>
          </div>
        </section>

        <section id="expertise" className="px-6 py-24 md:px-12 border-b border-cyan/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-orbitron text-3xl text-neon mb-12 flex items-center gap-4">
              <span className="text-cyan text-sm tracking-widest">04.</span> {data.expertise.title}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {data.expertise.items.map((item) => (
                <div
                  key={item.label}
                  className="terminal rounded-2xl p-8 hover:bg-neon/5 transition-colors border border-cyan/20"
                >
                  <h3 className="font-orbitron text-xl text-cyan mb-4">{item.label}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="timeline" className="px-6 py-24 md:px-12 border-b border-cyan/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-orbitron text-3xl text-neon mb-12 flex items-center gap-4">
              <span className="text-cyan text-sm tracking-widest">05.</span> {data.timeline.title}
            </h2>
            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-cyan/20">
              {data.timeline.items.map((item) => (
                <div key={item.role + item.date} className="relative pl-12">
                  <div className="absolute left-3 top-2 w-2 h-2 rounded-full bg-neon shadow-[0_0_10px_#00f5a0]" />
                  <div className="terminal rounded-2xl overflow-hidden hover:bg-night/80 transition-all group">
                    {item.img && (
                      <div className="h-32 overflow-hidden border-b border-cyan/20">
                        <img src={item.img} alt={item.role} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="text-xs uppercase tracking-[0.3em] text-cyan block mb-2">{item.date}</span>
                      <h3 className="font-orbitron text-xl text-neon mb-2">{item.role}</h3>
                      <p className="text-slate-400">{item.place}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="publications" className="px-6 py-24 md:px-12 border-b border-cyan/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-orbitron text-3xl text-neon mb-4 flex items-center gap-4">
              <span className="text-cyan text-sm tracking-widest">06.</span> {data.publications.title}
            </h2>
            <p className="text-slate-400 mb-12 max-w-2xl">{data.publications.blurb}</p>
            <div className="grid gap-6 md:grid-cols-2">
              {data.publications.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="terminal group flex items-center justify-between rounded-2xl px-8 py-6 text-sm text-cyan hover:border-neon transition-all"
                >
                  <span className="font-orbitron text-slate-100 text-lg group-hover:text-neon transition-colors">{link.label}</span>
                  <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="hobbies" className="px-6 py-24 md:px-12 border-b border-cyan/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-orbitron text-3xl text-neon mb-12 flex items-center gap-4">
              <span className="text-cyan text-sm tracking-widest">07.</span> {data.hobbies.title}
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {data.hobbies.items.map((hobby) => (
                <div key={hobby.label} className="terminal rounded-2xl overflow-hidden border border-cyan/20 group">
                  {hobby.img && (
                    <div className="h-48 overflow-hidden border-b border-cyan/20">
                      <img src={hobby.img} alt={hobby.label} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-8 flex gap-6 items-start">
                    <div className="w-10 h-10 rounded border border-cyan/40 flex items-center justify-center shrink-0">
                      <span className="text-xs text-neon font-bold">{hobby.label.substring(0, 1)}</span>
                    </div>
                    <div>
                      <h3 className="font-orbitron text-xl text-cyan mb-2">{hobby.label}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{hobby.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-6 py-24 md:px-12 bg-night/50">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-orbitron text-3xl text-neon mb-4 flex items-center gap-4 justify-center">
              <span className="text-cyan text-sm tracking-widest">08.</span> {data.contact.title}
            </h2>
            
            <form onSubmit={handleSubmit} className="terminal rounded-2xl p-8 space-y-6 mt-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-cyan px-1">{data.contact.name}</label>
                <input 
                  required
                  name="name"
                  type="text" 
                  className="w-full bg-night/50 border border-cyan/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-cyan px-1">{data.contact.email}</label>
                <input 
                  required
                  name="email"
                  type="email" 
                  className="w-full bg-night/50 border border-cyan/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-cyan px-1">{data.contact.message}</label>
                <textarea 
                  required
                  name="message"
                  rows={4}
                  className="w-full bg-night/50 border border-cyan/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon transition-colors resize-none"
                />
              </div>
              
              <button 
                disabled={formState === "loading"}
                className="w-full rounded-xl bg-neon/20 border border-neon/50 py-4 text-xs uppercase tracking-[0.4em] text-neon hover:bg-neon/30 transition-all disabled:opacity-50"
              >
                {formState === "loading" ? "Processing..." : data.contact.send}
              </button>

              {formState === "success" && <p className="text-center text-xs text-neon animate-pulse">{data.contact.success}</p>}
              {formState === "error" && <p className="text-center text-xs text-red-400">{data.contact.error}</p>}
            </form>
          </div>
        </section>
      </div>

      <footer className="border-t border-cyan/20 px-6 py-12 text-center text-[10px] uppercase tracking-[0.4em] text-slate-500 md:px-12">
        <div className="mb-4 text-neon/40">Secure Connection: Fairfield-HAM-Node_Primary</div>
        © {new Date().getFullYear()} Dr. Igor Khokhlov • Sacred Heart University • USA
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Space+Grotesk:wght@300;400;700&display=swap');
        
        :root {
          --font-orbitron: 'Orbitron', sans-serif;
        }

        .bg-night { background-color: #05070a; }
        .text-neon { color: #00f5a0; }
        .border-neon { border-color: #00f5a0; }
        .bg-neon { background-color: #00f5a0; }
        .text-cyan { color: #00d9ff; }
        .border-cyan { border-color: #00d9ff; }
        
        .shadow-glow { box-shadow: 0 0 15px rgba(0, 245, 160, 0.4); }
        .shadow-glowCyan { box-shadow: 0 0 15px rgba(0, 217, 255, 0.4); }

        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

        .cyber-grid {
          background-image: 
            linear-gradient(to right, rgba(0, 217, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 217, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .reveal-active {
          border-color: #00f5a0 !important;
          box-shadow: 0 0 20px rgba(0, 245, 160, 0.2);
        }
      `}</style>
    </div>
  );
}
