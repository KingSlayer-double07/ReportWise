"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/icons";

// ── Decorative stat cards shown on the right panel ────────────────────────────
const STATS = [
  { label: "Schools onboarded", value: "240+" },
  { label: "Reports generated", value: "18k+" },
  { label: "Time saved / term", value: "~40 hrs" },
];

// ── Tiny eye icon ──────────────────────────────────────────────────────────────
const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up auth
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="h-screen overflow-hidden flex font-dm tracking-tight">
      {/* ── LEFT — Form panel ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-12 bg-white relative overflow-hidden">
        {/* Subtle dot-grid background (mirrors the landing Hero) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage:
              "radial-gradient(ellipse 70% 80% at 20% 50%, #000 60%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 80% at 20% 50%, #000 60%, transparent 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[400px] mx-auto lg:mx-0">
          {/* Brand mark */}
          <Link href="/" className="inline-flex items-center gap-2.5 no-underline mb-10">
            <LogoMark />
            <span className="font-extrabold text-xl text-[#0c1c37] tracking-tight font-dm">
              Report<span className="text-[goldenrod]">Wise</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[32px] font-black tracking-tighter text-[#0c1c37] font-dm leading-none mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Sign in to your school&#39;s dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-[13px] font-semibold text-[#0c1c37]"
              >
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@yourschool.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-[10px] border border-[#0c1c37]/[0.15] bg-white text-[#0c1c37] text-[14px] placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#0c1c37]/50 focus:ring-3 focus:ring-[#0c1c37]/[0.08]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-[13px] font-semibold text-[#0c1c37]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] text-[#3c5580] font-medium hover:text-[goldenrod] transition-colors no-underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-[10px] border border-[#0c1c37]/[0.15] bg-white text-[#0c1c37] text-[14px] placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#0c1c37]/50 focus:ring-3 focus:ring-[#0c1c37]/[0.08]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0c1c37] transition-colors bg-transparent border-none cursor-pointer p-0"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3.5 rounded-[10px] bg-[#0c1c37] text-white font-bold text-[15px] tracking-tight shadow-[0_4px_20px_rgba(12,28,55,0.30)] transition-all duration-200 hover:bg-[goldenrod] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-[13px] text-gray-500 text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[#0c1c37] font-semibold hover:text-[goldenrod] transition-colors no-underline"
            >
              Request access
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT — Brand showcase panel (hidden on mobile) ─────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden px-14 py-12"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 110% 40%, #3b82f6 0%, #1e3a6e 30%, #0c1c37 65%)",
        }}
      >
        {/* Dot-grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Glowing orb top-right */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(100,180,255,0.2) 35%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />

        {/* Goldish accent line */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-1"
          style={{
            background: "linear-gradient(90deg, transparent, goldenrod 40%, transparent)",
          }}
        />

        {/* Top — brand chip */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 mb-3">
            <div className="w-5 h-5 flex-shrink-0">
              <LogoMark />
            </div>
            <span className="font-sans text-[11px] font-semibold text-white/80 tracking-[0.12em] uppercase">
              ReportWise
            </span>
          </div>
        </div>

        {/* Middle — headline + description */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-6 max-w-[420px]">
          <div>
            <h2 className="font-dm text-4xl font-black tracking-tighter text-white leading-[1.1] mb-4">
              Academic reporting,{" "}
              <span style={{ color: "goldenrod" }}>made effortless.</span>
            </h2>
            <p className="text-white/60 text-[15px] leading-[1.7] font-sans">
              Digitize score entry, auto-compute grades, generate PDF report sheets, and
              track student metrics — all from one school dashboard.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl p-4 flex flex-col gap-1"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
              >
                <span className="text-[22px] font-black text-white font-dm leading-none" style={{ color: "goldenrod" }}>
                  {value}
                </span>
                <span className="text-[11px] text-white/50 font-sans leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(218,165,32,0.15) 0%, transparent 70%)",
              }}
            />
            <p className="text-white/80 text-[14px] leading-[1.65] font-sans mb-4 relative z-10">
              &ldquo;ReportWise cut our end-of-term report processing from 3 weeks down to
              just 2 days. Absolutely game-changing for our admin team.&rdquo;
            </p>
            <div className="flex items-center gap-3 relative z-10">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-[#0c1c37] flex-shrink-0"
                style={{ background: "goldenrod" }}
              >
                AC
              </div>
              <div>
                <p className="text-white text-[13px] font-semibold leading-none mb-0.5">
                  Adaeze Chukwu
                </p>
                <p className="text-white/40 text-[11px]">
                  Deputy Principal, Pinnacle Schools
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom — decorative feature pills */}
        {/* <div className="relative z-10 flex flex-wrap gap-2">
          {["PDF Report Sheets", "Grade Auto-compute", "Paystack Billing", "Student Analytics"].map(
            (feat) => (
              <span
                key={feat}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                {feat}
              </span>
            )
          )}
        </div> */}
      </div>
    </div>
  );
}
