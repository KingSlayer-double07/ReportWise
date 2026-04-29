import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { PLANS } from "@/lib/constants";

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0c1c37]/[0.06] border border-[#0c1c37]/[0.12] rounded-full px-3.5 py-1.5 mb-5">
            <span className="text-[11px] font-bold text-[#0c1c37] tracking-[0.05em] uppercase">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-[clamp(28px,4vw,44px)] font-black tracking-[-1.5px] text-[#0c1c37] mx-auto mb-4">
            Pay only for active students
          </h2>
          <p className="text-[17px] text-gray-500 max-w-[440px] mx-auto leading-[1.7]">
            No flat fees. No surprises. You&apos;re billed per active student per
            session — fair and scalable.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 items-start">
          {PLANS.map(({ name, price, per, desc, features, cta, highlight }) => (
            <div
              key={name}
              className={[
                "rounded-2xl p-8 px-7 relative",
                highlight
                  ? "border-2 border-[#0c1c37] bg-[#0c1c37] shadow-[0_20px_60px_rgba(12,28,55,0.25)]"
                  : "border border-[#0c1c37]/10 bg-white",
              ].join(" ")}
            >
              {highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[gold] text-[#0c1c37] text-[11px] font-extrabold px-3.5 py-1 rounded-full tracking-[0.06em] uppercase">
                  Most Popular
                </div>
              )}

              <h3
                className={[
                  "text-base font-bold mb-2 uppercase tracking-[0.08em]",
                  highlight ? "text-white/70" : "text-gray-500",
                ].join(" ")}
              >
                {name}
              </h3>

              <p
                className={[
                  "text-[clamp(30px,4vw,40px)] font-black mb-1 tracking-[-1px]",
                  highlight ? "text-white" : "text-[#0c1c37]",
                ].join(" ")}
              >
                {price}{" "}
                <span
                  className={[
                    "text-sm font-medium",
                    highlight ? "text-white/50" : "text-gray-400",
                  ].join(" ")}
                >
                  {per}
                </span>
              </p>

              <p
                className={[
                  "text-sm mb-6 leading-[1.6]",
                  highlight ? "text-white/60" : "text-gray-500",
                ].join(" ")}
              >
                {desc}
              </p>

              <ul className="list-none p-0 mb-7">
                {features.map((f) => (
                  <li
                    key={f}
                    className={[
                      "flex items-center gap-2 py-1.5 text-sm",
                      highlight ? "text-white/80" : "text-gray-600",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "shrink-0",
                        highlight ? "text-[gold]" : "text-green-600",
                      ].join(" ")}
                    >
                      <CheckIcon />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={[
                  "block text-center py-3 font-bold text-sm rounded-lg no-underline transition-opacity duration-200 hover:opacity-85",
                  highlight
                    ? "bg-[gold] text-[#0c1c37]"
                    : "bg-[#0c1c37] text-white",
                ].join(" ")}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
