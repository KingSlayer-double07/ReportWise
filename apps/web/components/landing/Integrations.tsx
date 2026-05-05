import Link from "next/link";
import { ArrowRight } from "@/components/icons";

const MODULES = [
  { icon: "📊", label: "Score Engine" },
  { icon: "🧮", label: "Grade Calculator" },
  { icon: "📄", label: "PDF Generator" },
  { icon: "👨‍👩‍👧‍👦", label: "Parent Portal" },
  { icon: "🏫", label: "Class Manager" },
  { icon: "🎓", label: "Promotion Logic" },
  { icon: "👤", label: "Student Portal" },
  { icon: "📅", label: "Term Control" },
  { icon: "📬", label: "Notifications" },
  { icon: "🔐", label: "Multi-Tenant Auth" },
  { icon: "📈", label: "Analytics" },
  { icon: "⚙️", label: "Admin Panel" },
];

export default function Integrations() {
  return (
    <section className="py-20 px-6 bg-[#0c1c37] overflow-hidden relative">
      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(218,165,32,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[goldenrod]/[0.12] border border-[goldenrod]/20 rounded-full px-3.5 py-1.5 mb-5">
          <span className="text-[11px] font-bold text-[gold] tracking-[0.05em] uppercase">
            Everything Included
          </span>
        </div>

        <h2 className="text-[clamp(28px,4vw,48px)] font-black tracking-[-1.5px] text-white mx-auto mb-4 max-w-[580px]">
          Don&apos;t cobble together tools.{" "}
          <span className="text-[gold]">Use one platform.</span>
        </h2>
        <p className="text-[17px] text-white/60 max-w-[500px] mx-auto mb-12 leading-[1.7]">
          Everything your school needs — from score entry to parent engagement
          — is built into ReportWise. No integrations needed.
        </p>

        {/* Module chips */}
        <div className="flex flex-wrap gap-3 justify-center">
          {MODULES.map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-[10px] px-4 py-2.5 transition-all duration-200 hover:bg-[goldenrod]/[0.12] hover:border-[goldenrod]/30"
            >
              <span className="text-lg">{icon}</span>
              <span className="text-[13px] font-semibold text-white/85">{label}</span>
            </div>
          ))}
        </div>

        <Link
          href="#features"
          className="inline-flex items-center gap-2 mt-10 px-6 py-3 bg-[gold] text-[#0c1c37] font-bold text-sm rounded-lg no-underline transition-all duration-200 hover:bg-white"
        >
          View all features <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
