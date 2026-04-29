"use client";

import { TESTIMONIALS } from "@/lib/constants";

/** Splits `quote` at the first occurrence of `highlight` and returns
 *  three parts: before, the match, and after. */
function splitQuote(quote: string, highlight: string) {
  const idx = quote.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return { before: quote, word: "", after: "" };
  return {
    before: quote.slice(0, idx),
    word: quote.slice(idx, idx + highlight.length),
    after: quote.slice(idx + highlight.length),
  };
}

/** Deterministic pastel background for each avatar based on index */
const AVATAR_COLORS = [
  "from-[#0c1c37] to-[goldenrod]",
  "from-violet-600 to-purple-400",
  "from-emerald-600 to-teal-400",
  "from-rose-600 to-orange-400",
  "from-sky-600 to-blue-400",
  "from-amber-600 to-yellow-400",
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-6">
      <div className="max-w-[1100px] mx-auto bg-white rounded-2xl sm:px-10 py-14">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[goldenrod]/10 border border-[goldenrod]/25 rounded-full px-3.5 py-1.5 mb-5">
            <span className="font-sans text-[11px] font-semibold text-[goldenrod] tracking-[0.05em] uppercase">
              Testimonials
            </span>
          </div>

          <h2 className="text-4xl font-black tracking-[-2px] text-[#0c1c37] mb-0 font-dm">
            Our trusted clients
          </h2>
        </div>

        {/* ── 3 × 2 Card Grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map(({ initials, name, handle, quote, highlight }, i) => {
            const { before, word, after } = splitQuote(quote, highlight);
            return (
              <div
                key={name}
                className="bg-neutral-50 border border-gray-100 rounded-xl p-6 flex flex-col gap-4 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl/5 duration-300 cursor-default"
              >
                {/* Large styled quote mark */}
                <span className="text-[40px] font-black leading-none text-gray-200 select-none">
                  &ldquo;
                </span>

                {/* Quote body */}
                <p className="font-sans text-[14px] text-gray-600 leading-[1.7] flex-1 -mt-3">
                  {before}
                  <span className="text-[goldenrod] font-semibold">{word}</span>
                  {after}
                </p>

                {/* Avatar + name row */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex-shrink-0 flex items-center justify-center text-white text-[12px] font-bold`}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans text-[13px] font-bold text-[#0c1c37] leading-tight truncate">
                      {name}
                    </p>
                    <p className="font-sans text-[12px] text-gray-400 leading-tight truncate">
                      {handle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
