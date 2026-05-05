import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Button } from "../ui/button";
import { ShinyText } from "../ui/shiny-text";

const TRUSTED_SCHOOLS = [
  "Crown Academy",
  "Heritage College",
  "Pinnacle Schools",
  "Excel Group",
  "Zenith Academy",
];

export default function Hero() {
  return (
    <section className="pt-[120px] pb-20 bg-white text-center overflow-hidden relative font-sans">
      {/* Dot-grid background pattern */}
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative flex flex-col gap-6 items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#0c1c37]/[0.06] border border-[#0c1c37]/[0.12] rounded-full px-3.5 py-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[goldenrod] inline-block" />
          <span className="text-[11px] font-semibold text-[#0c1c37] tracking-[0.05em] uppercase">
            Built for Nigerian Schools
          </span>
        </div>

        {/* Headline */}
        {/* <h1 className="text-5xl md:text-7xl font-bold md:leading-18 leading-10 tracking-[-3px] text-[#0c1c37] max-w-[800px] mx-auto font-dm tracking-tighter">
          One platform to manage your school
        </h1> */}
        <ShinyText
          text="One platform to manage your school"
          speed={8}
          delay={0}
          color="#0c1c37"
          shineColor="#3c5580"
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-5xl md:text-7xl font-bold md:leading-18 leading-10 tracking-[-3px] text-[#3c5580] max-w-[800px] mx-auto font-dm tracking-tighter"
        />

        {/* Subtitle */}
        <p className="text-md leading-[1.4] text-gray-500 max-w-[600px] mx-auto tracking-tight font-medium">
          ReportWise digitizes academic reporting, handling score entry, grade
          computation, PDF report sheets, student metrics, and parent engagement
          — all in one place.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3.5 justify-center">
          <Link
            href="/sign-up"
            id="hero-get-started"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0c1c37] text-white font-bold text-[15px] rounded-[10px] shadow-[0_4px_20px_rgba(12,28,55,0.35)] no-underline transition-all duration-200 hover:bg-[goldenrod] hover:-translate-y-0.5"
          >
            Start Free Trial <ArrowRight />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#0c1c37] font-semibold text-[15px] rounded-[10px] border-[1.5px] border-[#0c1c37]/[0.18] no-underline transition-all duration-200 hover:border-[goldenrod] hover:bg-[goldenrod]/[0.04]"
          >
            See How It Works
          </Link>
        </div>

        {/* Trust logos */}
        {/* <div className="flex flex-wrap items-center justify-center gap-8">
          <span className="text-[11px] text-gray-400 font-medium tracking-[0.04em]">
            TRUSTED BY SCHOOLS ACROSS NIGERIA
          </span>
          {TRUSTED_SCHOOLS.map((name) => (
            <span
              key={name}
              className="text-[13px] font-bold text-gray-400 tracking-[-0.2px] font-serif"
            >
              {name}
            </span>
          ))}
        </div> */}
      </div>
    </section>
  );
}
