"use client";

import { useState } from "react";
import { PrismLogoFull } from "./PrismLogo";

interface SiteNavProps {
  activePage?: "home" | "community" | "templates" | "request" | "guide" | "faq";
}

export default function SiteNav({ activePage }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/community", label: "Community", id: "community" as const },
    { href: "/templates", label: "Templates", id: "templates" as const },
    { href: "/request", label: "Request", id: "request" as const },
    { href: "/guide", label: "Docs", id: "guide" as const },
  ];

  return (
    <header className="border-b border-[var(--rc-border)] px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <a href="/">
          <PrismLogoFull height={32} />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`text-[15px] transition-colors ${
                activePage === link.id
                  ? "font-medium text-[var(--rc-text-primary)]"
                  : "text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side — desktop CTA + mobile hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="hidden md:block rounded-full bg-[#111111] px-5 py-2 text-[14px] font-medium text-white hover:bg-[#222] transition-colors"
          >
            Build My Council
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col items-center justify-center gap-1.5 p-2"
            aria-label="Menu"
          >
            <span className={`block h-0.5 w-5 bg-[var(--rc-text-primary)] transition-transform ${menuOpen ? "translate-y-[4px] rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[var(--rc-text-primary)] transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-[var(--rc-text-primary)] transition-transform ${menuOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--rc-border)] mt-4 pt-4 pb-2 flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`text-[15px] py-1 ${
                activePage === link.id
                  ? "font-medium text-[var(--rc-text-primary)]"
                  : "text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/"
            className="mt-2 rounded-full bg-[#111111] px-5 py-2.5 text-center text-[14px] font-medium text-white hover:bg-[#222]"
          >
            Build My Council
          </a>
        </nav>
      )}
    </header>
  );
}
