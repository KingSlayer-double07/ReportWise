// ─── How It Works ─────────────────────────────────────────────────────────────
// UI modelled after the reference: dark background, white card container,
// overlapping step-number icons, 2×2 grid of cards with mini inline mockups.

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6">
      {/* ── White card shell ─────────────────────────────────────── */}
    <div className="max-w-[1100px] mx-auto bg-white rounded-3xl sm:px-10 py-14">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[goldenrod]/10 border border-[goldenrod]/25 rounded-full px-3.5 py-1.5 mb-5">
            <span className="font-sans text-[11px] font-semibold text-[goldenrod] tracking-[0.05em] uppercase">
              ✦ How It Works
            </span>
          </div>

          {/* h2 keeps project font (font-mono base) */}
          <h2 className="text-4xl font-black tracking-[-2px] text-[#0c1c37] mb-0 font-dm">
            How ReportWise Runs
          </h2>
        </div>

        {/* ── Step cards — 2 × 2 grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1 — Set Up Your School */}
          <div className="bg-gray-50 hover:bg-[#1C2333]/5 duration-300 border border-gray-100 rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <h3 className="font-sans text-lg font-bold text-[#0c1c37] mb-1">
                Set Up Your School
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-[1.6]">
                Configure your classes, subjects, grading scale, and teaching
                staff. Onboarding takes less than 30 minutes.
              </p>
            </div>
            {/* Mini mockup — setup form */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="font-sans text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
                School Setup
              </p>
              <div className="space-y-2">
                {["School Name", "Classes & Arms", "Subjects"].map((field) => (
                  <div key={field} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[goldenrod]" />
                    <div className="flex-1 h-6 bg-gray-50 rounded border border-gray-100 flex items-center px-2">
                      {/* <p className="text-[11px] text-gray-400 font-sans">
                        {field}
                      </p> */}
                      <Input placeholder={field} className="border-none focus-visible:border-none focus-visible:ring-0"/>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#0c1c37]/10 flex items-center justify-center text-[9px] text-[#0c1c37]">
                      ✓
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-3 bg-[#0c1c37] rounded-lg px-4 py-2 text-center flex w-full">
                <p className="font-sans text-[12px] font-semibold text-white">
                  Complete Setup →
                </p>
              </Button>
            </div>
          </div>

          {/* Card 2 — Enter Scores */}
          <div className="bg-gray-50 hover:bg-[#1C2333]/5 duration-300 border border-gray-100 rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <h3 className="font-sans text-lg font-bold text-[#0c1c37] mb-1">
                Enter Scores
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-[1.6]">
                Teachers log in and enter CA scores and exam scores per student
                per subject, per term.
              </p>
            </div>
            {/* Mini mockup — score table */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="font-sans text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Score Entry · JSS2B
              </p>
              <div className="space-y-1.5">
                {[
                  { name: "Adewale B.", ca: 28, exam: 62 },
                  { name: "Ngozi Obi", ca: 35, exam: 74 },
                  { name: "Emeka C.", ca: 30, exam: 61 },
                ].map(({ name, ca, exam }) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 text-[11px] font-sans"
                  >
                    <span className="w-24 text-gray-600 font-medium truncate">
                      {name}
                    </span>
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded px-2 py-0.5 w-10 justify-center">
                      <span className="text-[#0c1c37] font-semibold">{ca}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded px-2 py-0.5 w-10 justify-center">
                      <span className="text-[#0c1c37] font-semibold">
                        {exam}
                      </span>
                    </div>
                    <span className="ml-auto font-bold text-green-600">
                      {ca + exam}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3 — Auto-Generate Reports */}
          <div className="bg-gray-50 hover:bg-[#1C2333]/5 duration-300 border border-gray-100 rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <h3 className="font-sans text-lg font-bold text-[#0c1c37] mb-1">
                Auto-Generate Reports
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-[1.6]">
                The engine computes totals, grades, positions, and remarks.
                Reports are ready instantly.
              </p>
            </div>
            {/* Mini mockup — report card preview */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-sans text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Report Preview
                </p>
                <span className="font-sans text-[10px] font-bold text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                  Generated
                </span>
              </div>
              <div className="space-y-1.5">
                {[
                  { subject: "Mathematics", grade: "A", score: 88 },
                  { subject: "English", grade: "B+", score: 76 },
                  { subject: "Biology", grade: "A", score: 91 },
                ].map(({ subject, grade, score }) => (
                  <div
                    key={subject}
                    className="flex items-center gap-2 font-sans text-[11px]"
                  >
                    <span className="flex-1 text-gray-500">{subject}</span>
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-[#0c1c37] h-1.5 rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="w-8 font-bold text-[#0c1c37] text-right">
                      {grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4 — Share & Bill */}
          <div className="bg-gray-50 hover:bg-[#1C2333]/5 duration-300 border border-gray-100 rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <h3 className="font-sans text-lg font-bold text-[#0c1c37] mb-1">
                Share & Bill
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-[1.6]">
                Students receive PDF reports via the portal. Schools collect
                payment via Paystack per active student.
              </p>
            </div>
            {/* Mini mockup — share / payment */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="font-sans text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Payment Overview
              </p>
              <div className="space-y-2">
                {[
                  {
                    label: "Reports Sent",
                    value: "956",
                    color: "bg-green-500",
                  },
                  {
                    label: "Payments Collected",
                    value: "₦382,400",
                    color: "bg-[goldenrod]",
                  },
                  {
                    label: "Pending",
                    value: "34 students",
                    color: "bg-red-400",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 font-sans text-[11px]"
                  >
                    <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                    <span className="text-gray-500 flex-1">{label}</span>
                    <span className="font-bold text-[#0c1c37]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Button className="flex-1 bg-[goldenrod]/10 border border-[goldenrod]/30 rounded-lg px-3 py-1.5 text-center">
                  <p className="font-sans text-[11px] font-semibold text-[goldenrod]">
                    📄 Download PDF
                  </p>
                </Button>
                <Button className="flex-1 bg-[#0c1c37] rounded-lg px-3 py-1.5 text-center">
                  <p className="font-sans text-[11px] font-semibold text-white">
                    💳 Collect
                  </p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
