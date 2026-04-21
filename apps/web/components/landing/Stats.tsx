const STATS = [
  { value: "2026", label: "Platform Founded" },
  { value: "850+", label: "Students Managed" },
  { value: "10+", label: "Schools Onboarded" },
  { value: "99.1%", label: "Uptime SLA" },
];

export default function Stats() {
  return (
    <section className="py-16 px-6 bg-[#F8FAFF] border-t border-[#0c1c37]/[0.06] border-b font-dm">
      <div className="max-w-[1100px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-[clamp(32px,4vw,48px)] font-black text-[#0c1c37] tracking-[-2px] mb-1.5">
              {value}
            </p>
            <p className="text-sm text-gray-400 font-medium m-0">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
