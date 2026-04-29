import Link from "next/link";
import { LogoMark } from "@/components/icons";

const FOOTER_COLS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Security", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Help Centre", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Status", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
];

const SOCIALS = [
  {
    label: "X",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.938l4.26 5.632 4.796-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#07111f] px-6 pt-16 pb-8 border-t border-white/[0.06] font-dm">
      <div className="max-w-[1100px] mx-auto">

        {/* ── Top grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 no-underline mb-4">
              <LogoMark />
              <span className="font-dm font-extrabold text-xl text-white leading-none">
                Report<span className="text-[gold]">Wise</span>
              </span>
            </Link>

            <p className="font-sans text-sm text-white/40 leading-[1.75] max-w-[240px] mb-6">
              Digitizing academic reporting for Nigerian secondary schools.
              Trusted by 120&nbsp;+ schools nationwide.
            </p>

            {/* Social icons */}
            <div className="flex gap-2">
              {SOCIALS.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/45 no-underline transition-all duration-200 hover:bg-[goldenrod]/20 hover:text-[gold]"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(({ title, links }) => (
            <div key={title}>
              <p className="font-sans text-[11px] font-bold text-white/30 tracking-[0.1em] uppercase mb-4">
                {title}
              </p>
              <ul className="list-none p-0 m-0 space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-sans text-[13px] text-white/50 no-underline transition-colors duration-200 hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-wrap gap-4 items-center justify-between">
          <p className="font-sans text-[12px] text-white/25 m-0">
            © {currentYear} ReportWise Technologies Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <Link
                key={l}
                href="#"
                className="font-sans text-[12px] text-white/25 no-underline hover:text-white/55 transition-colors duration-200"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
