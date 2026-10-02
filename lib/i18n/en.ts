// English copy and data. Every string on the site lives here (Arabic mirror: ar.ts).
// Prices are in Egyptian pounds (EGP) for the Egyptian market. PLACEHOLDER until confirmed.

export type Option = { id: string; label: string; hint?: string; cost?: number };

// Top level tabs. The quote page (/start) is the primary action and sits apart in the nav.
const NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
];

// Concept builds shown in the Work slider. Screenshots: public/work/<id>.webp (tools/mockups.mjs)
const WORK = [
  { id: "ember", title: "EMBER", kind: "Restaurant", desc: "Menu, story and table reservations" },
  { id: "nova", title: "NOVA DENTAL", kind: "Clinic", desc: "Online booking and treatment prices" },
  { id: "haven", title: "HAVEN", kind: "Real estate", desc: "Property search with 1,000+ listings" },
  { id: "pulse", title: "PULSE", kind: "Gym", desc: "Classes, coaches and free trial signup" },
  { id: "atelier", title: "ATELIER", kind: "Fashion store", desc: "Editorial online store with cart" },
  { id: "ledger", title: "LEDGERLY", kind: "SaaS", desc: "Product site with dashboard preview" },
  { id: "azure", title: "AZURE", kind: "Resort", desc: "Room booking and seasonal rates" },
  { id: "glow", title: "GLOW&CO", kind: "Skincare shop", desc: "Skin quiz that sells the routine" },
];

const SERVICES = [
  {
    cmd: "landing",
    type: "landing",
    from: "9,900",
    title: "Landing page",
    body: "One page, one goal. Built to turn ad clicks and launches into leads.",
    spec: ["1 page, up to 8 sections", "Lead form to WhatsApp or email", "Ready in about 1 week"],
  },
  {
    cmd: "business",
    type: "business",
    from: "24,900",
    title: "Business website",
    body: "Your full online presence: services, story, team and contact.",
    spec: ["5 to 10 pages", "Editable content (CMS)", "Local SEO setup"],
  },
  {
    cmd: "store",
    type: "store",
    from: "45,000",
    title: "Online store",
    body: "A shop that fits your brand, not a template everyone else uses.",
    spec: ["Products, cart, checkout", "Card and cash on delivery", "Order dashboard"],
  },
  {
    cmd: "app",
    type: "app",
    from: "60,000",
    title: "Web app & dashboard",
    body: "Booking systems, client portals and internal tools.",
    spec: ["Logins and roles", "Database and admin panel", "Integrations and APIs"],
  },
  {
    cmd: "portfolio",
    type: "portfolio",
    from: "12,900",
    title: "Portfolio & personal brand",
    body: "For creators and professionals who want to be remembered.",
    spec: ["Case studies", "Motion and 3D details", "CV and booking links"],
  },
  {
    cmd: "rebuild",
    type: "business",
    from: "19,900",
    title: "Redesign & rescue",
    body: "Old, slow or broken site? We rebuild it and keep your traffic.",
    spec: ["Speed and SEO audit", "Content migration", "Redirects kept intact"],
  },
];

const PACKAGES = [
  {
    name: "Launch",
    type: "landing",
    price: "9,900",
    note: "one payment",
    for: "New businesses that need to be online this month.",
    items: ["Custom single page site", "Designed for phones first", "Contact form + WhatsApp", "Basic SEO", "1 revision round"],
    featured: false,
  },
  {
    name: "Business",
    type: "business",
    price: "24,900",
    note: "one payment",
    for: "Established businesses that want to look the part.",
    items: ["Up to 8 pages", "Custom design system", "Editable content (CMS)", "Animations", "SEO + analytics", "3 revision rounds"],
    featured: true,
  },
  {
    name: "Custom",
    type: "store",
    price: "45,000",
    note: "starting at",
    for: "Stores, booking systems and web apps.",
    items: ["Online store or web app", "Payments and logins", "Admin dashboard", "Integrations", "Priority support"],
    featured: false,
  },
];

const FAQ = [
  {
    q: "How long does a website take?",
    a: "A landing page takes about 1 week. A business website 2 to 4 weeks. Stores and web apps depend on scope, and your quote includes an exact timeline.",
  },
  {
    q: "Do I need to have a logo and content ready?",
    a: "No. Tell us what you have in the brief. We can write the copy, source photos and design a simple logo if you need one.",
  },
  {
    q: "Is it a template?",
    a: "No. Every site is designed for your business and coded from scratch. That is why they load fast and do not look like everyone else's.",
  },
  {
    q: "Can I edit the website myself later?",
    a: "Yes. Business and Custom plans come with a simple editor for text, images, products and prices.",
  },
  {
    q: "What about hosting and domain?",
    a: "We set both up for you, in your name. Most sites host for free or a few hundred pounds a year.",
  },
  {
    q: "How do payments work?",
    a: "50% to start, 50% at launch. Small projects can be paid in one go.",
  },
];

// ---- Questionnaire (ids and costs are shared with ar.ts) -----------------
const Q_TYPE: Option[] = [
  { id: "landing", label: "Landing page", hint: "One page, one goal", cost: 9000 },
  { id: "business", label: "Business website", hint: "Several pages", cost: 22000 },
  { id: "store", label: "Online store", hint: "Sell products", cost: 42000 },
  { id: "app", label: "Web app / system", hint: "Logins, dashboards", cost: 60000 },
  { id: "portfolio", label: "Portfolio", hint: "Personal brand", cost: 12000 },
  { id: "unsure", label: "Not sure yet", hint: "Help me decide", cost: 16000 },
];

const Q_PAGES: Option[] = [
  { id: "1", label: "1 page", cost: 0 },
  { id: "2-5", label: "2 to 5", cost: 4000 },
  { id: "6-10", label: "6 to 10", cost: 10000 },
  { id: "10+", label: "10+", cost: 18000 },
];

const Q_FEATURES: Option[] = [
  { id: "booking", label: "Online booking", cost: 6000 },
  { id: "payments", label: "Payments", cost: 7000 },
  { id: "cms", label: "Edit content myself", cost: 5000 },
  { id: "blog", label: "Blog / news", cost: 3000 },
  { id: "multilang", label: "Arabic + English", cost: 6000 },
  { id: "motion", label: "Animations / 3D", cost: 7000 },
  { id: "seo", label: "SEO boost", cost: 4000 },
  { id: "logins", label: "Customer logins", cost: 10000 },
];

const Q_ASSETS: Option[] = [
  { id: "logo", label: "Logo" },
  { id: "copy", label: "Text / copy" },
  { id: "photos", label: "Photos" },
  { id: "domain", label: "Domain" },
];

const Q_TIMELINE: Option[] = [
  { id: "asap", label: "ASAP (1 to 2 weeks)" },
  { id: "month", label: "Within a month" },
  { id: "flex", label: "Flexible" },
];

const Q_BUDGET: Option[] = [
  { id: "<10k", label: "Under EGP 10,000" },
  { id: "10k-25k", label: "EGP 10,000 to 25,000" },
  { id: "25k-60k", label: "EGP 25,000 to 60,000" },
  { id: "60k+", label: "EGP 60,000+" },
  { id: "unsure", label: "Not sure" },
];

export const en = {
  lang: "en",
  currency: "EGP",
  NAV,
  WORK,
  SERVICES,
  PACKAGES,
  FAQ,
  Q_TYPE,
  Q_PAGES,
  Q_FEATURES,
  Q_ASSETS,
  Q_TIMELINE,
  Q_BUDGET,
  HOME_STEPS: [
    { title: "Tell us what you need", body: "Five questions, about two minutes. No call needed." },
    { title: "Approve the design", body: "You get a fixed quote, then see the full design before any code." },
    { title: "Go live", body: "We build, test on real phones and launch. 30 days of fixes included." },
  ],
  PROCESS: [
    { step: "brief", title: "Brief", body: "Answer 5 quick questions. Takes about 2 minutes." },
    { step: "quote", title: "Fixed quote", body: "We reply with scope, price and timeline. No surprises later." },
    { step: "design", title: "Design", body: "You see the full design first and approve it before any code." },
    { step: "build", title: "Build", body: "We code it from scratch, test it on real phones and check the speed of every page." },
    { step: "launch", title: "Launch", body: "Domain, hosting, analytics. Then 30 days of free fixes." },
  ],
  STACK_POINTS: [
    { title: "You own everything", body: "Code, domain and content are yours. No monthly contract with us." },
    { title: "Fast on real phones", body: "Every page is checked against Google's Core Web Vitals before launch." },
    { title: "Found on Google", body: "Clean structure, meta tags and sitemap set up from day one." },
    { title: "Easy to update", body: "Change text, prices and photos yourself, or ask us." },
  ],

  meta: {
    title: "SiteCraft | Custom websites, designed and built for you",
    description:
      "SiteCraft designs and builds custom websites: landing pages, business sites, online stores and web apps. Answer a short brief, get a fixed quote.",
    ogDescription: "Custom websites, online stores and web apps. Designed first, built from scratch, owned by you.",
    work: {
      title: "Work",
      description:
        "Eight concept websites designed and coded from scratch by SiteCraft: restaurant, clinic, real estate, gym, fashion store, SaaS, resort and skincare shop.",
    },
    services: {
      title: "Services",
      description:
        "Landing pages, business websites, online stores, web apps, portfolios and redesigns, with starting prices in Egyptian pounds.",
    },
    pricing: {
      title: "Pricing",
      description: "Clear, fixed prices in Egyptian pounds for custom websites. Launch, Business and Custom plans, plus answers to common questions.",
    },
    process: {
      title: "Process",
      description:
        "How SiteCraft builds your website: brief, fixed quote, design, build and launch. Plus the tools behind every site.",
    },
    start: { title: "Get a quote", description: "Answer five quick questions and get a fixed quote for your website. Free, no call needed." },
    privacy: { title: "Privacy" },
    terms: { title: "Terms" },
  },

  nav: {
    home: "Home",
    quote: "Get a quote",
    open: "Open menu",
    close: "Close menu",
    homeAria: "SiteCraft home",
    main: "Main",
    mobile: "Mobile",
    skip: "Skip to content",
    switchLabel: "العربية",
    switchAria: "Read this page in Arabic",
  },

  hero: {
    chip: "Taking new projects this month",
    h1: ["Your website, ", "crafted", " from scratch."],
    lead: "SiteCraft designs and builds custom websites, online stores and web apps for businesses. No templates. You approve the design before we code, and you own every line.",
    cta: "Get my free quote",
    cta2: "See 8 sites we built",
    stats: [
      ["Fixed quote", "before any work"],
      ["Design first", "you approve it"],
      ["Built from scratch", "no templates"],
      ["30 days", "of free fixes"],
    ],
  },
  xray: {
    hint: "Hover to x-ray the build",
    hintTouch: "Drag to x-ray",
    alt: "The SiteCraft home page you are on, with its source code under the lens",
    eyebrow: "Under the hood",
    title: "Every pixel has real code behind it.",
    body: "Move over the page to see its source. No drag-and-drop builder, no theme you share with a thousand other shops. Clean code, written for your business.",
    points: [
      ["Fast on real phones", "every page speed-checked before launch"],
      ["You own the code", "hand it to any developer, any time"],
      ["Ready for Google", "structure, meta tags and sitemap built in"],
    ],
    link: "Start my project",
  },


  tagline: {
    aria: "What we do",
    eyebrow: "Why SiteCraft",
    text: "No templates, no page builders. We design the site your business needs, code it from scratch, and hand you every line.",
  },

  homeWork: {
    eyebrow: "Work · concept builds",
    title: "Built for restaurants, shops, clinics and startups.",
    all: "See all 8 builds",
    skip: "Skip",
  },

  rail: {
    hint: "Scroll, drag or use ← →",
    hintTouch: "Swipe to browse",
    of: "of",
    nav: "Concept builds",
    jump: "Jump to a build",
    open: "View",
    like: "Get one like it",
  },

  workPage: {
    eyebrow: "Work · concept builds",
    title: "Eight businesses. Eight sites. Zero templates.",
    body: "Scroll or drag through the strip. Each one designed and coded from scratch.",
    ctaTitle: "Want one like these?",
    ctaBody: "Tell us which one feels closest. We design yours from scratch.",
  },

  homeServices: {
    eyebrow: "What we build",
    title: "One team for every kind of site.",
    body: "Fixed prices in Egyptian pounds. You know the cost before any work starts.",
    compare: "Compare plans",
    from: "from",
    quote: "Quote this",
  },

  homeSteps: { eyebrow: "How it works", title: "Three steps. One fixed price.", link: "Full process" },

  compare: {
    eyebrow: "Your turn",
    title: "Drag the line.",
    title2: "Watch code turn into your website.",
    label: "Drag to compile the code into a website",
    compiling: "compiling",
    keys: "drag or use ← → keys",
    live: "live site",
    shotAlt: "The SiteCraft home page, compiled from the code on the other side of the slider",
    points: [
      ["Written by people", "Every line is ours. No page builder, no plugins you pay for every month."],
      ["Built for your business", "Menus, bookings, products or listings. Built around how you sell."],
      ["Yours on launch day", "Code, domain and logins handed over. Change teams any time."],
    ],
    lead: "Tell us about your business. You get a fixed quote and a clear plan, free.",
    cta: "Get my free quote",
    cta2: "See the work",
  },

  why: {
    eyebrow: "What you get",
    title: "A website you own, not a subscription you rent.",
    body: "Page builders charge every month and lock your site in. We hand you the code, the domain and the logins on launch day.",
    link: "How we work",
  },

  faq: { eyebrow: "FAQ", title: "Questions people ask before they start.", else: "Something else?", ask: "Ask in the brief" },

  finalCta: {
    chip: "Taking new projects",
    title: "Your website could be live this month.",
    body: "Answer five questions. Get a fixed price, a timeline and a plan. Free, and no call needed.",
    cta: "Get my free quote",
    cta2: "Chat on WhatsApp",
    waMessage: "Hi SiteCraft, I'd like a website.",
    points: ["Fixed price", "Design approved first", "You own the code", "30 days of free fixes"],
  },

  ctaBand: {
    title: "Ready when you are.",
    body: "Answer five questions and get a fixed quote. Free, no call needed.",
    cta: "Get my free quote",
  },

  servicesPage: {
    eyebrow: "Services",
    title: "Pick what you need. We build it to fit.",
    body: "Six kinds of projects we take on. Not sure which one is yours? The quote form figures it out.",
  },

  processPage: {
    eyebrow: "Process",
    title: "How your site gets built.",
    body: "Five clear steps from first message to launch day, and the tools we use along the way.",
  },

  pricingPage: {
    eyebrow: "Pricing",
    title: "Clear prices. Fixed before we start.",
    body: "Three starting points. Your exact quote comes after the brief, and it does not change unless the scope does.",
  },

  process: {
    eyebrow: "Process",
    title: "From brief to launch in five steps.",
    lead: "You always know what happens next, what it costs and when it ships.",
    log: [
      ["brief", "received in 2 min"],
      ["quote", "fixed price + timeline"],
      ["design", "approved by you"],
      ["build", "tested on real phones"],
      ["launch", "live on yourdomain.com"],
    ],
    support: "30 days of free fixes",
    typical: "typical project: 2 to 4 weeks",
  },

  stack: {
    eyebrow: "Under the hood",
    title: "The tools serious product teams use. For your business.",
    cardTitle: "Designed in Figma. Shipped in code.",
    cardBody:
      "Your site is built with React, Next.js and Tailwind, the same stack behind many of the fastest sites on the web. No page-builder bloat.",
    cardCta: "How we work",
    tools: {
      figma: {
        title: "Figma. You see it before we build it.",
        body: "Every page is designed in Figma first. You review and approve the real layout before a single line of code is written.",
      },
      next: {
        title: "Next.js. Fast on day one.",
        body: "Pages are pre-built and served from the edge, so they load in a blink and Google can read every word.",
      },
      shadcn: {
        title: "shadcn/ui. Solid building blocks.",
        body: "Buttons, forms and menus built on accessible, battle-tested parts, then styled to match your brand.",
      },
      react: {
        title: "React. Built to grow.",
        body: "Your site is made of reusable pieces, so adding a page, a section or a whole store later is quick and cheap.",
      },
      motion: {
        title: "Motion. Movement with a purpose.",
        body: "Smooth, light animations that guide the eye and make the site feel alive, without slowing it down.",
      },
      tailwind: {
        title: "Tailwind CSS. Pixel-perfect on every screen.",
        body: "Only the styles your site uses get shipped. The result looks sharp on phones, tablets and desktops alike.",
      },
    },
  },

  pricing: {
    popular: "Most picked",
    cta: "Get my quote",
    includesLabel: "Every plan includes:",
    includes:
      "design for phones first, SSL, domain and hosting setup in your name, speed checks, 30 days of free fixes, and full ownership of the code. Prices in Egyptian pounds. Pay 50% to start, 50% at launch.",
  },

  footer: {
    tagline: "Custom websites, online stores and web apps. Designed first, built from scratch, owned by you.",
    site: "Site",
    services: "Services",
    contact: "Contact",
    faq: "FAQ",
    quote: "Get a quote",
    privacy: "Privacy",
    terms: "Terms",
  },

  brief: {
    eyebrow: "Project brief",
    title: "Get your quote",
    lead: "Five questions, about two minutes. We reply with a fixed price, a timeline and a plan. Free.",
    steps: ["Project", "Scope", "Style", "Timing", "Contact"],
    progress: "Progress",
    stepOf: (a: number, b: number, name: string) => `Step ${a} of ${b} · ${name}`,
    qType: "What are we building?",
    qPages: "Roughly how many pages?",
    qFeatures: "Features you need",
    pickAny: "Pick any",
    qClosest: "Which of our builds feels closest?",
    closestNote: (n: number) => `${n} of 3 picked, optional`,
    qHave: "What do you already have?",
    qLike: "A site you like?",
    optional: "Optional",
    likeLabel: "Link to a website you like",
    likePlaceholder: "e.g. apple.com or a competitor",
    qWhen: "When do you need it live?",
    qBudget: "Budget you have in mind",
    qWhere: "Where do we send your quote?",
    name: "Your name *",
    business: "Business name",
    contact: "WhatsApp number or email *",
    contactPlaceholder: "+20 100 000 0000 or you@company.com",
    notes: "Anything else we should know?",
    errType: "Pick what we're building.",
    errPages: "Pick roughly how many pages.",
    errTimeline: "Pick a timeline.",
    errName: "Add your name.",
    errContact: "Add a WhatsApp number or email so we can send your quote.",
    errContactBad: "That email or number does not look complete. Please check it.",
    back: "Back",
    next: "Next",
    review: "Review my brief",
    ready: "brief ready",
    thanks: (name: string) => `Thanks, ${name}. Send it our way.`,
    sendBody: "Pick how you want to send it. WhatsApp is fastest. Nothing is sent until you press a button.",
    wa: "Send on WhatsApp",
    email: "Send by email",
    copy: "Copy brief",
    copied: "Copied",
    edit: "Edit answers",
    summary: "Brief summary",
    estRange: "estimated range",
    pickProject: "pick a project",
    to: "to",
    estNote: "A rough guide, not a quote. Your fixed price comes after we read the brief.",
    mailSubject: "Website quote",
    msg: {
      hello: "Hi SiteCraft, I'd like a quote.",
      name: "Name",
      contact: "Contact",
      project: "Project",
      pages: "Pages",
      features: "Features",
      style: "Style like",
      reference: "Reference",
      have: "I already have",
      timeline: "Timeline",
      budget: "Budget",
      estimate: "Site estimate",
      notes: "Notes",
    },
  },

  legal: {
    eyebrow: "Legal",
    privacyTitle: "Privacy",
    privacy: [
      "The quote form on this site does not store your answers. When you press send, your brief opens in WhatsApp or your email app, and you choose whether to send it.",
      "If you send us a brief, we use your name and contact details only to reply about your project. We do not sell or share them.",
    ],
    privacyDelete: "Want your details deleted? Email",
    termsTitle: "Terms",
    terms: [
      "Every project starts with a written quote that lists scope, price and timeline. Work begins once you approve it.",
      "Payment is 50% to start and 50% at launch, unless your quote says otherwise.",
      "When the final payment is made, the code, design files and content are yours.",
      "Fixes for bugs found in the first 30 days after launch are free. New features are quoted separately.",
    ],
  },

  notFound: {
    error: "error 404: page not found",
    title: "This page was never built.",
    body: "Yours could be, though. Head back home or tell us what you need.",
    cta: "Get my free quote",
    home: "Back home",
  },
};
