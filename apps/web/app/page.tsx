"use client";

import { useState, useEffect } from "react";

// ─── Icons (inline SVGs) ──────────────────────────────────────────────────────

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const XIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const LogoMark = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#0c1c37"/>
    <rect x="7" y="8" width="12" height="2.5" rx="1.25" fill="gold"/>
    <rect x="7" y="13" width="18" height="2.5" rx="1.25" fill="gold" opacity="0.7"/>
    <rect x="7" y="18" width="10" height="2.5" rx="1.25" fill="gold" opacity="0.5"/>
    <rect x="19" y="16" width="6" height="8" rx="1" fill="gold"/>
  </svg>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(12,28,55,0.08)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <LogoMark />
          <span style={{ fontWeight: 800, fontSize: 20, color: "#0c1c37", letterSpacing: "-0.5px" }}>
            Report<span style={{ color: "goldenrod" }}>Wise</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <ul style={{ display: "flex", alignItems: "center", gap: 4, listStyle: "none", margin: 0, padding: 0 }} className="desktop-nav">
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Pricing", href: "#pricing" },
          ].map(({ label, href }) => (
            <li key={label}>
              <a href={href}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", color: "#374151", fontWeight: 500, fontSize: 14, textDecoration: "none", borderRadius: 8, transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(12,28,55,0.06)"; (e.currentTarget as HTMLElement).style.color = "#0c1c37"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#374151"; }}
              >
                {label} <ChevronDown />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="desktop-nav">
          <a href="#" style={{ padding: "9px 18px", color: "#0c1c37", fontWeight: 600, fontSize: 14, textDecoration: "none", borderRadius: 8, transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(12,28,55,0.06)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >Login</a>
          <a href="#" style={{ padding: "9px 20px", background: "#0c1c37", color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none", borderRadius: 8, transition: "all 0.2s", boxShadow: "0 2px 8px rgba(12,28,55,0.25)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "goldenrod"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#0c1c37"; }}
          >Get Started</a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#0c1c37", display: "none" }} className="mobile-menu-btn">
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-nav" style={{ background: "#fff", borderTop: "1px solid rgba(12,28,55,0.08)", padding: "16px 24px 20px" }}>
          {["Features", "How It Works", "Pricing"].map(label => (
            <a key={label} href="#" onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "10px 0", color: "#374151", fontWeight: 500, fontSize: 15, textDecoration: "none", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              {label}
            </a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <a href="#" style={{ flex: 1, textAlign: "center", padding: "10px", border: "1px solid rgba(12,28,55,0.2)", borderRadius: 8, color: "#0c1c37", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Login</a>
            <a href="#" style={{ flex: 1, textAlign: "center", padding: "10px", background: "#0c1c37", borderRadius: 8, color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Get Started</a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, background: "linear-gradient(180deg, #f8faff 0%, #fff 100%)", textAlign: "center", overflow: "hidden", position: "relative" }}>
      {/* subtle background decoration */}
      <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 800, height: 800, background: "radial-gradient(circle, rgba(12,28,55,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        {/* Label */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(12,28,55,0.06)", border: "1px solid rgba(12,28,55,0.12)", borderRadius: 100, padding: "6px 14px", marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "goldenrod", display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0c1c37", letterSpacing: "0.05em", textTransform: "uppercase" }}>Built for Nigerian Secondary Schools</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-2px", color: "#0c1c37", marginBottom: 24, maxWidth: 800, margin: "0 auto 24px" }}>
          One platform to manage{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ position: "relative", zIndex: 1, color: "goldenrod" }}>school reports</span>
            <svg style={{ position: "absolute", bottom: -4, left: 0, width: "100%", height: 8 }} viewBox="0 0 300 8" fill="none">
              <path d="M2 6 Q75 2 150 6 Q225 10 298 4" stroke="goldenrod" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
            </svg>
          </span>{" "}
          and your school
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 18, lineHeight: 1.7, color: "#6B7280", maxWidth: 560, margin: "0 auto 40px" }}>
          ReportWise digitizes academic reporting for JSS1–SSS3, handling score entry, grade computation, PDF report sheets, student promotion, and Paystack-powered billing — all in one place.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", marginBottom: 60 }}>
          <a href="#" id="hero-get-started" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#0c1c37", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none", borderRadius: 10, boxShadow: "0 4px 20px rgba(12,28,55,0.35)", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "goldenrod"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#0c1c37"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            Start Free Trial <ArrowRight />
          </a>
          <a href="#features" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#fff", color: "#0c1c37", fontWeight: 600, fontSize: 15, textDecoration: "none", borderRadius: 10, border: "1.5px solid rgba(12,28,55,0.18)", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "goldenrod"; (e.currentTarget as HTMLElement).style.background = "rgba(218,165,32,0.04)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(12,28,55,0.18)"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
          >
            See How It Works
          </a>
        </div>

        {/* Trust logos */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 32 }}>
          <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, letterSpacing: "0.04em" }}>TRUSTED BY SCHOOLS ACROSS NIGERIA</span>
          {["Crown Academy", "Heritage College", "Pinnacle Schools", "Excel Group", "Zenith Academy"].map(name => (
            <span key={name} style={{ fontSize: 13, fontWeight: 700, color: "#9CA3AF", letterSpacing: "-0.2px", fontFamily: "serif" }}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Preview ────────────────────────────────────────────────────────

function DashboardPreview() {
  return (
    <section style={{ padding: "0 24px 80px", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", borderRadius: 16, overflow: "hidden", boxShadow: "0 30px 100px rgba(12,28,55,0.18), 0 0 0 1px rgba(12,28,55,0.06)", background: "#fff" }}>
        {/* Browser bar */}
        <div style={{ background: "#f3f4f6", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FC5F5A", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28CA41", display: "inline-block" }} />
          <div style={{ flex: 1, background: "#E5E7EB", borderRadius: 100, height: 22, margin: "0 16px", display: "flex", alignItems: "center", paddingLeft: 12 }}>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>app.reportwise.ng/dashboard</span>
          </div>
        </div>
        {/* Dashboard content mockup */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: 460 }}>
          {/* Sidebar */}
          <div style={{ background: "#0c1c37", padding: "20px 0" }}>
            <div style={{ padding: "0 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LogoMark />
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>ReportWise</span>
              </div>
            </div>
            {[
              { label: "Dashboard", icon: "▤", active: true },
              { label: "Students", icon: "👥" },
              { label: "Score Entry", icon: "✏️" },
              { label: "Report Sheets", icon: "📄" },
              { label: "Classes", icon: "🏫" },
              { label: "Settings", icon: "⚙️" },
            ].map(({ label, icon, active }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", margin: "2px 8px", borderRadius: 8, background: active ? "rgba(218,165,32,0.15)" : "transparent", cursor: "pointer" }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span style={{ fontSize: 13, color: active ? "gold" : "rgba(255,255,255,0.6)", fontWeight: active ? 600 : 400 }}>{label}</span>
                {active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "gold" }} />}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ padding: 24, background: "#F9FAFB" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0c1c37", margin: 0 }}>Dashboard Overview</h3>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>2024/2025 Session · First Term</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ padding: "7px 14px", border: "1px solid #E5E7EB", borderRadius: 7, background: "#fff", fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer" }}>Export PDF</button>
                <button style={{ padding: "7px 14px", background: "#0c1c37", borderRadius: 7, fontSize: 12, fontWeight: 600, color: "#fff", border: "none", cursor: "pointer" }}>Enter Scores</button>
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Total Students", value: "1,248", change: "+12", color: "#0c1c37" },
                { label: "Reports Generated", value: "956", change: "+89", color: "#16A34A" },
                { label: "Score Entry %", value: "78%", change: "+5%", color: "#D97706" },
                { label: "Unpaid Accounts", value: "34", change: "-8", color: "#DC2626" },
              ].map(({ label, value, change, color }) => (
                <div key={label} style={{ background: "#fff", borderRadius: 10, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color, margin: 0 }}>{value}</p>
                  <p style={{ fontSize: 11, color: change.startsWith("-") ? "#DC2626" : "#16A34A", margin: "4px 0 0", fontWeight: 500 }}>{change} this term</p>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "#fff", borderRadius: 10, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>Class Performance · JSS1A</p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
                  {[65, 72, 68, 80, 74, 78, 82, 70, 76, 84, 69, 88].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: i === 11 ? "goldenrod" : "rgba(12,28,55,0.12)", borderRadius: "3px 3px 0 0", height: `${h}%`, transition: "all 0.3s" }} />
                  ))}
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 10, padding: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 12px" }}>Recent Reports</p>
                {[
                  { name: "Adewale Busayo", class: "JSS2B", score: 78 },
                  { name: "Ngozi Obi", class: "SSS1 (Science)", score: 91 },
                  { name: "Emeka Chukwu", class: "JSS3A", score: 63 },
                ].map(({ name, class: cls, score }) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#0c1c37", margin: 0 }}>{name}</p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{cls}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: score >= 80 ? "#16A34A" : score >= 60 ? "#D97706" : "#DC2626" }}>{score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────

const features = [
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

function FeaturesSection() {
  return (
    <section id="features" style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(218,165,32,0.1)", border: "1px solid rgba(218,165,32,0.3)", borderRadius: 100, padding: "6px 14px", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "goldenrod", letterSpacing: "0.05em", textTransform: "uppercase" }}>Platform Features</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-1.5px", color: "#0c1c37", margin: "0 auto 16px", maxWidth: 580 }}>
            Latest tools to ensure everything you need
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Manage your school&#39;s academic workflows from a single, intelligent dashboard — affordable, fast, and built for the Nigerian system.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {features.map(({ icon, title, desc, tag }, i) => (
            <div key={title}
              style={{ background: "#FAFAFA", border: "1px solid rgba(12,28,55,0.07)", borderRadius: 14, padding: "28px 28px 24px", transition: "all 0.25s", cursor: "default", position: "relative", overflow: "hidden" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = "0 12px 40px rgba(12,28,55,0.12)";
                el.style.borderColor = "rgba(218,165,32,0.3)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
                el.style.borderColor = "rgba(12,28,55,0.07)";
              }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, padding: "6px 12px", background: i % 2 === 0 ? "rgba(12,28,55,0.05)" : "rgba(218,165,32,0.08)", borderRadius: "0 14px 0 8px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: i % 2 === 0 ? "#0c1c37" : "goldenrod", letterSpacing: "0.06em", textTransform: "uppercase" }}>{tag}</span>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#0c1c37", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18 }}>
                {icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0c1c37", margin: "0 0 10px", letterSpacing: "-0.3px" }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{desc}</p>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6, color: "goldenrod", fontSize: 13, fontWeight: 600 }}>
                Learn more <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const steps = [
  { n: "01", title: "Set Up Your School", desc: "Configure your classes, subjects, grading scale, and teaching staff. OnBoard takes less than 30 minutes." },
  { n: "02", title: "Enter Scores", desc: "Teachers log in and enter CA scores and exam scores per student per subject, per term." },
  { n: "03", title: "Auto-Generate Reports", desc: "The engine computes totals, grades, positions, and remarks. Reports are ready instantly." },
  { n: "04", title: "Share & Bill", desc: "Students receive PDF reports via the portal. Schools collect payment via Paystack per active student." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "80px 24px", background: "#F8FAFF" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(12,28,55,0.06)", border: "1px solid rgba(12,28,55,0.12)", borderRadius: 100, padding: "6px 14px", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0c1c37", letterSpacing: "0.05em", textTransform: "uppercase" }}>How It Works</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-1.5px", color: "#0c1c37", margin: "0 auto 16px", maxWidth: 520 }}>
            From scores to certified reports in minutes
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2 }}>
          {steps.map(({ n, title, desc }, i) => (
            <div key={n} style={{ position: "relative" }}>
              {i < steps.length - 1 && (
                <div style={{ position: "absolute", top: 30, right: -1, width: 2, height: "calc(100% - 60px)", background: "linear-gradient(180deg, rgba(12,28,55,0.12) 0%, transparent 100%)", display: "none" }} className="step-connector" />
              )}
              <div style={{ padding: "28px 24px", background: "#fff", border: "1px solid rgba(12,28,55,0.07)", borderRadius: 14, height: "100%", boxSizing: "border-box" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0c1c37", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "gold" }}>{n}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0c1c37", margin: "0 0 10px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dark Integration Section ─────────────────────────────────────────────────

function IntegrationSection() {
  const modules = [
    { icon: "📊", label: "Score Engine" },
    { icon: "🧮", label: "Grade Calculator" },
    { icon: "📄", label: "PDF Generator" },
    { icon: "💳", label: "Paystack" },
    { icon: "🏫", label: "Class Manager" },
    { icon: "🎓", label: "Promotion Logic" },
    { icon: "👤", label: "Student Portal" },
    { icon: "📅", label: "Term Control" },
    { icon: "📬", label: "Notifications" },
    { icon: "🔐", label: "Multi-Tenant Auth" },
    { icon: "📈", label: "Analytics" },
    { icon: "⚙️", label: "Admin Panel" },
  ];

  return (
    <section style={{ padding: "80px 24px", background: "#0c1c37", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, background: "radial-gradient(circle, rgba(218,165,32,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(218,165,32,0.12)", border: "1px solid rgba(218,165,32,0.2)", borderRadius: 100, padding: "6px 14px", marginBottom: 20 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "gold", letterSpacing: "0.05em", textTransform: "uppercase" }}>Everything Included</span>
        </div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", color: "#fff", margin: "0 auto 16px", maxWidth: 580 }}>
          Don&apos;t cobble together tools.{" "}
          <span style={{ color: "gold" }}>Use one platform.</span>
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto 48px", lineHeight: 1.7 }}>
          Everything your school needs — from score entry to payment collection — is built into ReportWise. No integrations needed.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {modules.map(({ icon, label }) => (
            <div key={label}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 16px", transition: "all 0.2s" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(218,165,32,0.12)";
                el.style.borderColor = "rgba(218,165,32,0.3)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,0.06)";
                el.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{label}</span>
            </div>
          ))}
        </div>

        <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 40, padding: "12px 24px", background: "gold", color: "#0c1c37", fontWeight: 700, fontSize: 14, textDecoration: "none", borderRadius: 8, transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "gold"; }}
        >
          View all features <ArrowRight />
        </a>
      </div>
    </section>
  );
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

function TestimonialSection() {
  return (
    <section style={{ padding: "80px 24px", background: "#fff", textAlign: "center" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ fontSize: 48, color: "rgba(218,165,32,0.4)", lineHeight: 1, marginBottom: 8 }}>&ldquo;</div>
        <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, lineHeight: 1.5, color: "#0c1c37", letterSpacing: "-0.5px", margin: "0 0 32px" }}>
          ReportWise has completely eliminated manual report card errors for us. Our teachers enter scores, and within minutes, 600+ student reports are ready to download. It&#39;s transformed our academic admin.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #0c1c37, goldenrod)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>MA</div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#0c1c37", margin: 0 }}>Mrs Amaka Okonkwo</p>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Principal, Pinnacle Schools Enugu</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatsSection() {
  const stats = [
    { value: "2024", label: "Platform Founded" },
    { value: "8,500+", label: "Students Managed" },
    { value: "120+", label: "Schools Onboarded" },
    { value: "99.9%", label: "Uptime SLA" },
  ];

  return (
    <section style={{ padding: "60px 24px", background: "#F8FAFF", borderTop: "1px solid rgba(12,28,55,0.06)", borderBottom: "1px solid rgba(12,28,55,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
        {stats.map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, color: "#0c1c37", letterSpacing: "-2px", margin: "0 0 6px" }}>{value}</p>
            <p style={{ fontSize: 14, color: "#9CA3AF", fontWeight: 500, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function PricingSection() {
  const plans = [
    {
      name: "Edufy Basic",
      price: "₦500",
      per: "/ student / session",
      desc: "Perfect for smaller schools getting started with digital reporting.",
      features: ["Up to 150 students", "All report sheet types", "Score entry dashboard", "PDF generation", "Email support"],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Edufy",
      price: "₦400",
      per: "/ student / session",
      desc: "Best value for mid-size schools. Volume discount built in.",
      features: ["150–500 students", "Everything in Basic", "Multi-class management", "Promotion automation", "Priority support", "Custom branding"],
      cta: "Start Free Trial",
      highlight: true,
    },
    {
      name: "Edufy Pro",
      price: "₦300",
      per: "/ student / session",
      desc: "Best value for mid-size schools. Volume discount built in.",
      features: ["500-1000 students", "Everything in Basic", "Multi-class management", "Promotion automation", "Priority support", "Custom branding"],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Edufy Enterprise",
      price: "Custom",
      per: "pricing",
      desc: "For school groups and education districts managing multiple schools.",
      features: ["Unlimited students", "Multiple schools", "Centralized admin", "API access", "Dedicated account manager", "SLA guarantee"],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" style={{ padding: "80px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(12,28,55,0.06)", border: "1px solid rgba(12,28,55,0.12)", borderRadius: 100, padding: "6px 14px", marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0c1c37", letterSpacing: "0.05em", textTransform: "uppercase" }}>Simple Pricing</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-1.5px", color: "#0c1c37", margin: "0 auto 16px" }}>
            Pay only for active students
          </h2>
          <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
            No flat fees. No surprises. You're billed per active student per session — fair and scalable.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "start" }}>
          {plans.map(({ name, price, per, desc, features, cta, highlight }) => (
            <div key={name}
              style={{ border: highlight ? "2px solid #0c1c37" : "1px solid rgba(12,28,55,0.1)", borderRadius: 16, padding: "32px 28px", position: "relative", background: highlight ? "#0c1c37" : "#fff", boxShadow: highlight ? "0 20px 60px rgba(12,28,55,0.25)" : "none" }}
            >
              {highlight && (
                <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "gold", color: "#0c1c37", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 100, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Most Popular
                </div>
              )}
              <h3 style={{ fontSize: 16, fontWeight: 700, color: highlight ? "rgba(255,255,255,0.7)" : "#6B7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{name}</h3>
              <p style={{ fontSize: "clamp(30px, 4vw, 40px)", fontWeight: 900, color: highlight ? "#fff" : "#0c1c37", margin: "0 0 4px", letterSpacing: "-1px" }}>
                {price} <span style={{ fontSize: 14, fontWeight: 500, color: highlight ? "rgba(255,255,255,0.5)" : "#9CA3AF" }}>{per}</span>
              </p>
              <p style={{ fontSize: 14, color: highlight ? "rgba(255,255,255,0.6)" : "#6B7280", margin: "0 0 24px", lineHeight: 1.6 }}>{desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                {features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 14, color: highlight ? "rgba(255,255,255,0.8)" : "#374151" }}>
                    <span style={{ color: highlight ? "gold" : "#16A34A", flexShrink: 0 }}><CheckIcon /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#"
                style={{ display: "block", textAlign: "center", padding: "12px", background: highlight ? "gold" : "#0c1c37", color: highlight ? "#0c1c37" : "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", borderRadius: 8, transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                {cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section style={{ padding: "80px 24px", background: "#0c1c37", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -80, right: -80, width: 400, height: 400, background: "radial-gradient(circle, rgba(218,165,32,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", margin: "0 0 16px" }}>
          Discover the full power of{" "}
          <span style={{ color: "gold" }}>ReportWise</span>
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", margin: "0 0 36px", lineHeight: 1.7 }}>
          Join hundreds of Nigerian schools that have made the switch to digital academic management.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
          <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "gold", color: "#0c1c37", fontWeight: 700, fontSize: 15, textDecoration: "none", borderRadius: 9, transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "gold"; }}
          >
            Start Free Trial <ArrowRight />
          </a>
          <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: "transparent", color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 15, textDecoration: "none", borderRadius: 9, border: "1.5px solid rgba(255,255,255,0.2)", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.5)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
          >
            Book a Demo
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Security", "Changelog", "Roadmap"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Press", "Contact"],
    },
    {
      title: "Resources",
      links: ["Documentation", "API Reference", "Help Centre", "Status", "Privacy"],
    },
  ];

  return (
    <footer style={{ background: "#07111f", padding: "60px 24px 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(3, 1fr)", gap: 40, marginBottom: 48 }} className="footer-grid">
          {/* Brand */}
          <div>
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
              <LogoMark />
              <span style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>Report<span style={{ color: "gold" }}>Wise</span></span>
            </a>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 260, margin: "0 0 20px" }}>
              Digitizing academic reporting for Nigerian secondary schools. Trusted by 120+ schools.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["𝕏", "in", "f"].map(icon => (
                <a key={icon} href="#" style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(218,165,32,0.2)"; (e.currentTarget as HTMLElement).style.color = "gold"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
                >{icon}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {cols.map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>{title}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {links.map(l => (
                  <li key={l} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>© 2024 ReportWise. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }

        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
          .mobile-menu-btn { display: none !important; }
        }

        html { scroll-behavior: smooth; }
      `}</style>
      <Navbar />
      <main>
        <HeroSection />
        <DashboardPreview />
        <FeaturesSection />
        <HowItWorks />
        <IntegrationSection />
        <TestimonialSection />
        <StatsSection />
        <PricingSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
