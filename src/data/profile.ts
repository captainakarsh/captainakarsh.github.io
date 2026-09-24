// Single source of truth for everything on the site, the /api/profile endpoint
// and the AI assistant's knowledge. Edit here and every surface updates.

export type Link = { label: string; href: string };

export type Experience = {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
};

export type ProjectCategory = "saas" | "enterprise" | "fullstack";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  period: string;
  category: ProjectCategory;
  featured?: boolean;
  url?: string;
  urlLabel?: string;
  stack: string[];
  highlights: string[];
  metrics?: { value: string; label: string }[];
};

export const profile = {
  name: "Akarsh Singh",
  firstName: "Akarsh",
  initials: "AS",
  role: "Full Stack Engineer",
  headline: "I build AI-powered products and cloud-native systems that ship to real users.",
  location: "Greater Noida, India",
  timezone: "Asia/Kolkata",
  email: "akarshsingh2904@gmail.com",
  available: true,
  socials: {
    github: "https://github.com/captainakarsh",
    linkedin: "https://www.linkedin.com/in/akarsh-singh-4736881ba" as string,
  },
  summary:
    "Full Stack Developer with 3.5 years of experience designing and delivering scalable enterprise applications, AI-powered SaaS products, and cloud-native microservices. Proficient in Java, Spring Boot, Node.js and React, with hands-on expertise in Google Cloud Platform, Docker and CI/CD automation. Sole architect and engineer behind two production SaaS products — AxaPDF and NonriX — serving real users at scale.",
  about: [
    "I'm a full stack engineer who likes owning a product end to end — from the data model and API contracts to the pixels users touch and the pipeline that ships it.",
    "By day I build multi-tenant enterprise systems at XORLabs. Outside of that I've independently designed, built and launched two production AI SaaS products: AxaPDF, which translates entire PDFs into 70+ languages while preserving layout, and NonriX, an AI knowledge and video-notes app.",
    "I care about fast APIs, boring-in-a-good-way infrastructure, and interfaces that feel effortless. Competitive programming (CodeChef 4★) keeps my problem-solving sharp.",
  ],
  roles: [
    "Full Stack Engineer",
    "Java · Spring Boot",
    "Node.js · React",
    "GCP · Cloud Run",
    "Gemini & Claude AI",
    "SaaS Founder",
  ],
  stats: [
    { value: 3.5, suffix: "+", label: "Years building", decimals: 1 },
    { value: 50, suffix: "+", label: "REST APIs shipped", decimals: 0 },
    { value: 70, suffix: "+", label: "Languages in AxaPDF", decimals: 0 },
    { value: 1798, suffix: "", label: "CodeChef rating", decimals: 0 },
  ],
} as const;

export const experience: Experience[] = [
  {
    role: "Software Engineer",
    company: "Exclusive OR · XORLabs",
    location: "Greater Noida, IN",
    start: "Jul 2023",
    end: "Present",
    current: true,
    summary:
      "Building core modules of a multi-tenant platform, the CI/CD that ships it, and the security that protects it.",
    highlights: [
      "Developed core modules in a multi-tenant architecture serving 5 client environments; deployed 50+ RESTful APIs with a 30% latency reduction through query optimization and caching.",
      "Established CI/CD pipelines with GitHub Actions and Jenkins, cutting release cycles from 5 days to under 2 and enabling zero-downtime deployments.",
      "Strengthened API security with input validation, rate limiting and OAuth 2.0, reducing vulnerabilities by 25% in third-party security audits.",
    ],
    stack: ["Java", "Spring Boot", "MySQL", "GitHub Actions", "Jenkins", "OAuth 2.0"],
  },
  {
    role: "Junior Software Engineer (Intern)",
    company: "Exclusive OR · XORLabs",
    location: "Greater Noida, IN",
    start: "Aug 2022",
    end: "Jun 2023",
    summary: "Shipped internal products used daily by 200+ employees, backed by a serious test suite.",
    highlights: [
      "Delivered a real-time attendance tracking system for 200+ employees with tiered permissions, an analytics dashboard and automated reporting.",
      "Authored 200+ unit and integration tests with JUnit and Mockito, reaching 85% code coverage and sharply reducing post-release defects.",
      "Automated leave tracking and approval workflows, reducing HR processing overhead by 30% through scheduled notifications.",
    ],
    stack: ["Java", "JUnit", "Mockito", "React", "Node.js"],
  },
];

export const projects: Project[] = [
  {
    slug: "axapdf",
    name: "AxaPDF",
    tagline: "AI-powered PDF translation SaaS",
    period: "Oct 2023 — Present",
    category: "saas",
    featured: true,
    url: "https://axapdf.com",
    urlLabel: "axapdf.com",
    stack: ["Node.js", "React", "Flutter", "Gemini AI", "GCP Cloud Run", "Firebase", "Razorpay", "WebSockets"],
    highlights: [
      "Translates PDFs into 70+ languages with Google Gemini AI while preserving layout — tables, multi-column formats and Indic scripts included.",
      "Parallel page-by-page pipeline with real-time WebSocket progress; a 100-page document translates in under 5 minutes.",
      "Pay-per-page credit wallet with Razorpay on web and Google Play Billing on Android; auto-scaling on Cloud Run with end-to-end TLS.",
      "Android app on Google Play (Flutter) with staging/production flavors, Firebase Auth + Google Sign-In and GCP Secret Manager.",
    ],
    metrics: [
      { value: "70+", label: "languages" },
      { value: "<5 min", label: "per 100 pages" },
      { value: "Web + Android", label: "platforms" },
    ],
  },
  {
    slug: "nonrix",
    name: "NonriX",
    tagline: "AI knowledge & video-notes app",
    period: "Mar 2024 — Present",
    category: "saas",
    featured: true,
    url: "https://staging.nonrix.ai",
    urlLabel: "nonrix.ai",
    stack: ["Flutter", "Node.js", "Gemini File API", "Firestore", "Firebase Storage", "Cloud Build"],
    highlights: [
      "Multi-feature AI app (Flutter web + mobile) with video notes, conversational AI and YouTube summarization powered by Gemini.",
      "Node.js backend on Cloud Run streams large videos from Firebase Storage straight into the Gemini File API via pipe() — no RAM or disk bottlenecks.",
      "Google OAuth + Firebase Auth with custom domains on Cloud Run; secrets in GCP Secret Manager, deployments automated with Cloud Build.",
      "Firestore data architecture with GCS path persistence to prevent orphaned files and support resumable uploads across clients.",
    ],
    metrics: [
      { value: "Streaming", label: "video → Gemini" },
      { value: "Web + Mobile", label: "one codebase" },
      { value: "0", label: "orphaned files" },
    ],
  },
  {
    slug: "kiuwan",
    name: "Kiuwan",
    tagline: "Code quality & security analysis",
    period: "Jul 2023 — Jun 2024",
    category: "enterprise",
    stack: ["Java", "SQL", "Maven", "REST APIs"],
    highlights: [
      "Extended the enterprise static-analysis platform with SQL-injection detection for JSX codebases.",
      "Enhanced the REST API layer for third-party integrations in a detection engine used by enterprise clients globally.",
    ],
  },
  {
    slug: "dasho",
    name: "PreEmptive Dasho",
    tagline: "Java obfuscation tooling",
    period: "Jul 2023 — Dec 2023",
    category: "enterprise",
    stack: ["Java", "Spring Boot", "Hibernate", "Gradle", "Kotlin DSL"],
    highlights: [
      "Added Gradle DSL and Kotlin DSL support, keeping the obfuscator compatible with modern Android and JVM builds.",
      "Streamlined the plugin configuration API, cutting onboarding and configuration effort by 40%.",
    ],
  },
  {
    slug: "reservations",
    name: "Reservation System",
    tagline: "Full-stack slot booking platform",
    period: "Aug 2022 — Jun 2023",
    category: "fullstack",
    stack: ["React", "Node.js", "MySQL"],
    highlights: [
      "Real-time slot booking with automated user notifications, improving operational efficiency by 50%.",
      "Responsive React UI on a Node.js/MySQL backend with notification workflows that removed manual coordination.",
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Java", "TypeScript", "JavaScript", "Python", "C++", "SQL"] },
  {
    group: "Frameworks",
    items: ["Spring Boot", "Node.js", "Express.js", "React", "Next.js", "Flutter", "Hibernate", "LangChain"],
  },
  {
    group: "AI & ML",
    items: ["Google Gemini", "Gemini File API", "Claude API", "Vertex AI", "LangChain", "Prompt Engineering"],
  },
  {
    group: "Cloud & DevOps",
    items: ["GCP Cloud Run", "Cloud Build", "Secret Manager", "Artifact Registry", "Docker", "GitHub Actions", "Jenkins", "Vercel"],
  },
  { group: "Data", items: ["PostgreSQL", "MySQL", "MongoDB", "Firestore", "Firebase Storage"] },
  {
    group: "Tools",
    items: ["Git", "Maven", "Gradle", "Socket.IO", "Razorpay", "Play Billing", "Postman", "Jira"],
  },
];

export const achievements = [
  {
    title: "CodeChef Expert",
    detail: "4★ with a peak rating of 1798 — among top competitive programmers nationwide.",
    kind: "achievement",
  },
  {
    title: "Independent SaaS Founder",
    detail: "Designed, engineered and shipped two production AI SaaS products, from architecture to deployment.",
    kind: "achievement",
  },
  {
    title: "Building with the Claude API",
    detail: "Anthropic Education · June 2026",
    href: "https://verify.skilljar.com/c/zjqgyy2dauom",
    kind: "certification",
  },
] as const;

export const education = {
  school: "AKTU University",
  degree: "B.Tech, Computer Science",
  period: "Aug 2019 — May 2023",
  grade: "CGPA 8.6 / 10",
};

export const marquee = [
  "Java",
  "Spring Boot",
  "Node.js",
  "TypeScript",
  "React",
  "Next.js",
  "Flutter",
  "Google Cloud",
  "Cloud Run",
  "Firebase",
  "Gemini AI",
  "Claude API",
  "Docker",
  "PostgreSQL",
  "MongoDB",
  "WebSockets",
  "GitHub Actions",
  "LangChain",
];
