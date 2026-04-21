"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LogoMark, ChevronDown, MenuIcon, XIcon } from "@/components/icons";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const MOBILE_LINKS = ["Features", "How It Works", "Pricing"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-lg bg-white/90 border-b border-white/90 font-dm tracking-tight"
      }
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <LogoMark />
          <span className="font-extrabold text-xl text-[#0c1c37] tracking-tight">
            Report<span className="text-[goldenrod]">Wise</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex items-center gap-1 px-3.5 py-2 text-gray-600 font-medium text-sm rounded-lg transition-all duration-200 hover:bg-[#0c1c37]/[0.06] hover:text-[#0c1c37] no-underline"
              >
                {label} <ChevronDown />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/login"
            className="px-4 py-2.5 text-[#0c1c37] font-semibold text-sm rounded-lg transition-all duration-200 hover:bg-[#0c1c37]/[0.06] no-underline"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="px-5 py-2.5 bg-[#0c1c37] text-white font-semibold text-sm rounded-lg shadow-[0_2px_8px_rgba(12,28,55,0.25)] transition-all duration-200 hover:bg-[goldenrod] no-underline"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden bg-transparent border-none cursor-pointer text-[#0c1c37] flex items-center"
          aria-label="Toggle menu"
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#0c1c37]/[0.08] px-6 pb-5 pt-4">
          {MOBILE_LINKS.map((label) => (
            <Link
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-gray-600 font-medium text-[15px] border-b border-black/5 no-underline hover:text-[#0c1c37] transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-2.5 mt-4">
            <Link
              href="/login"
              className="flex-1 text-center py-2.5 border border-[#0c1c37]/20 rounded-lg text-[#0c1c37] font-semibold text-sm no-underline"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="flex-1 text-center py-2.5 bg-[#0c1c37] rounded-lg text-white font-semibold text-sm no-underline"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
