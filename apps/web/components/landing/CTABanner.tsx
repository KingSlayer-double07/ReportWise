import Link from "next/link";
import { LogoMark } from "@/components/icons";

export default function CTABanner() {
  return (
    /* Light page bg — the card floats on top */
    <section className="px-6 py-20 bg-neutral-50">
      <div className="max-w-[1100px] mx-auto">
        {/* ── Floating dark card ─────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-20 text-center"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 110% 50%, #3b82f6 0%, #1e3a6e 30%, #0c1c37 60%)",
          }}
        >
          {/* Glowing orb — top right, matches reference */}
          {/* <div
            className="pointer-events-none absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(100,180,255,0.25) 35%, transparent 70%)",
              filter: "blur(8px)",
            }}
          /> */}

          {/* Subtle dot-grid texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-[600px] mx-auto">
            {/* Brand chip */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-white/10 border border-white/15">
              <div className="w-5 h-5 flex-shrink-0">
                <LogoMark />
              </div>
              <span className="font-sans text-[11px] font-semibold text-white/80 tracking-[0.12em] uppercase">
                ReportWise
              </span>
            </div>

            <h2 className="font-dm text-[clamp(32px,5vw,52px)] font-black tracking-[-1.5px] text-white leading-[1.1] mb-4">
              Realize your school&apos;s potential
            </h2>

            <p className="font-sans text-[16px] text-white/60 leading-[1.7] mb-9">
              Join hundreds of Nigerian schools that have ditched manual report cards
              and made the switch to smart, digital academic management.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0c1c37] font-semibold text-[14px] rounded-[9px] no-underline transition-all duration-200 hover:bg-white/90 shadow-sm"
              >
                Request early access
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold text-[14px] rounded-[9px] border border-white/15 no-underline transition-all duration-200 hover:bg-white/15"
              >
                About product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
