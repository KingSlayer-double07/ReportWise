"use client";

import { FEATURES } from "@/lib/constants";
import { ShinyText } from "@/components/ui/shiny-text";

// Pastel icon backgrounds — one per card
const ICON_BG = [
  "bg-rose-50",
  "bg-sky-50",
  "bg-emerald-50",
  "bg-amber-50",
  "bg-violet-50",
  "bg-orange-50",
];

export default function Features() {
  return (
    <section id="features" className="font-dm px-6">
      <div className="max-w-[1100px] mx-auto bg-white rounded-2xl sm:px-10 py-14">


        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[goldenrod]/10 border border-[goldenrod]/25 rounded-full px-3.5 py-1.5 mb-5">
            <span className="font-sans text-[11px] font-semibold text-[goldenrod] tracking-[0.05em] uppercase">
              ✦ Platform Features
            </span>
          </div>

          <h2 className="text-4xl font-black tracking-[-2px] text-[#0c1c37] mb-0 font-dm">
            Latest tools to ensure everything you need
          </h2>

          <p className="font-sans text-base text-gray-500 max-w-[480px] mx-auto leading-[1.7]">
            Manage your school&apos;s academic workflows from a single, intelligent
            dashboard — affordable, fast, and built for the Nigerian system.
          </p>
        </div>

        {/* ── Feature Grid — 4 cols, 2 rows ─────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            // <motion.div
            <div
              key={title}
              // whileHover={{ y: -4, }}
              // transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="bg-neutral-50 border border-gray-100 rounded-xl p-5 cursor-default hover:-translate-y-0.5 hover:bg-white duration-300 hover:shadow-xl/5"
            >
              {/* Pastel icon box */}
              <div
                className={`w-10 h-10 rounded-lg ${ICON_BG[i % ICON_BG.length]} flex items-center justify-center text-[18px] mb-4`}
              >
                <Icon className="w-5 h-5 text-current" />
              </div>

              <h3 className="font-sans text-[15px] font-bold text-[#0c1c37] mb-2 leading-snug">
                {title}
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-[1.6] m-0">
                {desc}
              </p>
            {/* </motion.div> */}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
