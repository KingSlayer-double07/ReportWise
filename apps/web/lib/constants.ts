// ─── Landing Page Static Data ─────────────────────────────────────────────────

export interface Feature {
  icon: string;
  title: string;
  desc: string;
  tag: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "📊",
    title: "Smart Score Entry",
    desc: "Teachers enter CA & exam scores per subject. The platform auto-calculates totals, grades, positions, and remarks using your school's custom grading rules.",
    tag: "Core Feature",
  },
  {
    icon: "📄",
    title: "Branded PDF Reports",
    desc: "Generate beautifully formatted, school-branded report sheets in one click. Students can view and download them from their portal.",
    tag: "Reports",
  },
  {
    icon: "🎓",
    title: "Promotion & Graduation",
    desc: "Automate end-of-session promotion logic for JSS1–SSS3. Handle Art, Commercial, and Science stream transitions seamlessly.",
    tag: "Academic Flow",
  },
  {
    icon: "💳",
    title: "Paystack Billing",
    desc: "Per-student, per-session billing powered by Paystack. School admins can track payments, send reminders, and manage subscriptions.",
    tag: "Payments",
  },
  {
    icon: "🏫",
    title: "Multi-Class Management",
    desc: "Full support for the Nigerian school structure — JSS1, JSS2, JSS3, SSS1, SSS2, SSS3 — with arms, subjects, and teachers assigned per class.",
    tag: "Structure",
  },
  {
    icon: "🔄",
    title: "Term & Session Control",
    desc: "Admins control term progression and session rollover. Student records are preserved across sessions for comprehensive academic history.",
    tag: "Administration",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export interface Step {
  n: string;
  title: string;
  desc: string;
}

export const STEPS: Step[] = [
  {
    n: "01",
    title: "Set Up Your School",
    desc: "Configure your classes, subjects, grading scale, and teaching staff. OnBoard takes less than 30 minutes.",
  },
  {
    n: "02",
    title: "Enter Scores",
    desc: "Teachers log in and enter CA scores and exam scores per student per subject, per term.",
  },
  {
    n: "03",
    title: "Auto-Generate Reports",
    desc: "The engine computes totals, grades, positions, and remarks. Reports are ready instantly.",
  },
  {
    n: "04",
    title: "Share & Bill",
    desc: "Students receive PDF reports via the portal. Schools collect payment via Paystack per active student.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export interface Plan {
  name: string;
  price: string;
  per: string;
  desc: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────

export interface Testimonial {
  initials: string;
  name: string;
  handle: string;
  quote: string;
  highlight: string; // word inside the quote to render in accent colour
}

export const TESTIMONIALS: Testimonial[] = [
  {
    initials: "AO",
    name: "Mrs Amaka Okonkwo",
    handle: "Principal, Pinnacle Schools",
    quote:
      "ReportWise has completely eliminated manual report card errors for us. Our teachers enter scores and within minutes, 600+ student reports are ready. It's transformed our academic admin.",
    highlight: "transformed",
  },
  {
    initials: "EB",
    name: "Mr Emeka Balogun",
    handle: "VP Academics, Hallmark College",
    quote:
      "The automated grading and promotion engine is fantastic. It's motivating to see how much time we've recovered — no more spreadsheets. The school branding on the PDFs is outstanding.",
    highlight: "outstanding",
  },
  {
    initials: "FN",
    name: "Mrs Funke Nwachukwu",
    handle: "Head Teacher, Greenfield Academy",
    quote:
      "Paystack billing integration was a game changer. Parents pay online, we track every payment in one place. The whole platform just works the way a Nigerian school actually operates.",
    highlight: "game changer",
  },
  {
    initials: "TI",
    name: "Mr Tunde Ige",
    handle: "Director, Sunrise Group Schools",
    quote:
      "Managing three school campuses used to be a nightmare during result-entry season. With ReportWise, even our non-technical staff picked it up in a day. Absolutely seamless.",
    highlight: "seamless",
  },
  {
    initials: "KA",
    name: "Miss Kemi Adeyemi",
    handle: "Form Tutor, Heritage Secondary",
    quote:
      "I used to spend every end-of-term weekend manually compiling scores into Word documents. Now I just enter marks and download the finished report sheet instantly. It's a lifesaver.",
    highlight: "lifesaver",
  },
  {
    initials: "CO",
    name: "Mr Chidi Okafor",
    handle: "ICT Coordinator, Excel Academy",
    quote:
      "Setup was surprisingly quick — we had the whole school onboarded in under two hours. The support team was responsive, and the platform hasn't had a single downtime we've noticed.",
    highlight: "responsive",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export const PLANS: Plan[] = [
  {
    name: "Edufy Basic",
    price: "₦500",
    per: "/ student / session",
    desc: "Perfect for smaller schools getting started with digital reporting.",
    features: [
      "Up to 150 students",
      "All report sheet types",
      "Score entry dashboard",
      "PDF generation",
      "Email support",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Edufy",
    price: "₦400",
    per: "/ student / session",
    desc: "Best value for mid-size schools. Volume discount built in.",
    features: [
      "150–500 students",
      "Everything in Basic",
      "Multi-class management",
      "Promotion automation",
      "Priority support",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Edufy Pro",
    price: "₦300",
    per: "/ student / session",
    desc: "Best value for mid-size schools. Volume discount built in.",
    features: [
      "500-1000 students",
      "Everything in Basic",
      "Multi-class management",
      "Promotion automation",
      "Priority support",
      "Custom branding",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Edufy Enterprise",
    price: "Custom",
    per: "pricing",
    desc: "For school groups and education districts managing multiple schools.",
    features: [
      "Unlimited students",
      "Multiple schools",
      "Centralized admin",
      "API access",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];
