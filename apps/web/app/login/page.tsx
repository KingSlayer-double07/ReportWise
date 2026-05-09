"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { Role } from "@reportwise/shared";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

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
  const [role, setRole] = useState<Role>(Role.ADMIN);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // MOCK LOGIN for now
    setTimeout(() => {
      login("mock_token", {
        id: "1",
        name: role === Role.ADMIN ? "Admin User" : role === Role.TEACHER ? "Teacher User" : "Student User",
        email,
        role: role,
      });
      setLoading(false);
    }, 1500);
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
          <div className="mb-6">
            <h1 className="text-[32px] font-black tracking-tighter text-[#0c1c37] font-dm leading-none mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Sign in to your school&apos;s dashboard
            </p>
          </div>

          {/* Role Selector */}
          <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="mb-8">
            <TabsList className="w-full h-11 p-1 bg-muted rounded-xl">
              {[Role.ADMIN, Role.TEACHER, Role.STUDENT].map((r) => (
                <TabsTrigger
                  key={r}
                  value={r}
                  className="rounded-lg font-bold data-active:shadow-sm"
                >
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="login-email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="admin@yourschool.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground font-medium hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-12 h-12 rounded-xl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            {/* Submit */}
            <Button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="h-12 rounded-xl font-bold text-base shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
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
        {/* <div
          className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(100,180,255,0.2) 35%, transparent 70%)",
            filter: "blur(10px)",
          }}
        /> */}

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
