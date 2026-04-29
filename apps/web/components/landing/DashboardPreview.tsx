import { LogoMark } from "@/components/icons";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: "▤", active: true },
  { label: "Students", icon: "👥" },
  { label: "Score Entry", icon: "✏️" },
  { label: "Report Sheets", icon: "📄" },
  { label: "Classes", icon: "🏫" },
  { label: "Settings", icon: "⚙️" },
];

const STAT_CARDS = [
  { label: "Total Students", value: "1,248", change: "+12", color: "text-[#0c1c37]" },
  { label: "Reports Generated", value: "956", change: "+89", color: "text-green-600" },
  { label: "Score Entry %", value: "78%", change: "+5%", color: "text-amber-600" },
  { label: "Unpaid Accounts", value: "34", change: "-8", color: "text-red-600" },
];

const CHART_BARS = [65, 72, 68, 80, 74, 78, 82, 70, 76, 84, 69, 88];

const RECENT_REPORTS = [
  { name: "Adewale Busayo", cls: "JSS2B", score: 78 },
  { name: "Ngozi Obi", cls: "SSS1 (Science)", score: 91 },
  { name: "Emeka Chukwu", cls: "JSS3A", score: 63 },
];

function scoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

export default function DashboardPreview() {
  return (
    <section className="px-6 pb-20 relative font-dm tracking-tight hidden sm:block">
      <div className="max-w-[1100px] mx-auto rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(12,28,55,0.18),0_0_0_1px_rgba(12,28,55,0.06)] bg-white">
        {/* Browser chrome */}
        <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2 border-b border-black/[0.06]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FC5F5A] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41] inline-block" />
          <div className="flex-1 bg-gray-200 rounded-full h-[22px] mx-4 flex items-center pl-3">
            <span className="text-[11px] text-gray-400">app.reportwise.ng/dashboard</span>
          </div>
        </div>

        {/* Dashboard layout */}
        <div className="grid grid-cols-[220px_1fr] min-h-[460px]">
          {/* Sidebar */}
          <div className="bg-[#0c1c37] py-5">
            <div className="px-4 pb-4 border-b border-white/[0.08] mb-2">
              <div className="flex items-center gap-2">
                <LogoMark />
                <span className="text-white font-bold text-sm">ReportWise</span>
              </div>
            </div>
            {SIDEBAR_ITEMS.map(({ label, icon, active }) => (
              <div
                key={label}
                className={[
                  "flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-lg cursor-pointer",
                  active ? "bg-[goldenrod]/15" : "bg-transparent",
                ].join(" ")}
              >
                {/* <span className="text-sm">{icon}</span> */}
                <span
                  className={[
                    "text-[13px]",
                    active ? "text-[gold] font-semibold" : "text-white/60 font-normal",
                  ].join(" ")}
                >
                  {label}
                </span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[gold]" />
                )}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-[#0c1c37] m-0">Dashboard Overview</h3>
                <p className="text-[11px] text-gray-400 mt-0.5 mb-0">
                  2024/2025 Session · First Term
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-3.5 py-1.5 border border-gray-200 rounded-[7px] bg-white text-[12px] font-medium text-gray-600 cursor-pointer">
                  Export PDF
                </button>
                <button className="px-3.5 py-1.5 bg-[#0c1c37] rounded-[7px] text-[12px] font-semibold text-white border-none cursor-pointer">
                  Enter Scores
                </button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {STAT_CARDS.map(({ label, value, change, color }) => (
                <div
                  key={label}
                  className="bg-white rounded-[10px] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[0.04]"
                >
                  <p className="text-[11px] text-gray-400 font-medium mb-2 uppercase tracking-[0.04em]">
                    {label}
                  </p>
                  <p className={`text-[22px] font-extrabold m-0 ${color}`}>{value}</p>
                  <p
                    className={`text-[11px] mt-1 mb-0 font-medium ${
                      change.startsWith("-") ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {change} this term
                  </p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-[10px] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[0.04]">
                <p className="text-[12px] font-semibold text-gray-600 mb-3">
                  Class Performance · JSS1A
                </p>
                <div className="flex items-end gap-1 h-20">
                  {CHART_BARS.map((h, i) => (
                    <div
                      key={i}
                      className={[
                        "flex-1 rounded-t-[3px] transition-all duration-300",
                        i === 11 ? "bg-[goldenrod]" : "bg-[#0c1c37]/[0.12]",
                      ].join(" ")}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-[10px] p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-black/[0.04]">
                <p className="text-[12px] font-semibold text-gray-600 mb-3">Recent Reports</p>
                {RECENT_REPORTS.map(({ name, cls, score }) => (
                  <div
                    key={name}
                    className="flex items-center justify-between py-1.5 border-b border-black/[0.04]"
                  >
                    <div>
                      <p className="text-[12px] font-semibold text-[#0c1c37] m-0">{name}</p>
                      <p className="text-[11px] text-gray-400 m-0">{cls}</p>
                    </div>
                    <span className={`text-[13px] font-bold ${scoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
