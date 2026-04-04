"use client";

import { useState, useEffect } from "react";
import { PrismLogoFull } from "./PrismLogo";

interface SiteNavProps {
  activePage?: "home" | "community" | "templates" | "request" | "guide" | "faq";
}

export default function SiteNav({ activePage }: SiteNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => { if (s?.user) setUser(s.user); })
      .catch(() => {});
  }, []);

  const links = [
    { href: "/guide", label: "Guide", id: "guide" as const },
    { href: "/templates", label: "Templates", id: "templates" as const },
    { href: "/community", label: "Community", id: "community" as const },
    { href: "/faq", label: "FAQ", id: "faq" as const },
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

        {/* Right side — desktop CTA + auth + mobile hamburger */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-[var(--rc-text-muted)]">{user.email}</span>
              <button
                onClick={() => window.location.href = "/api/auth/signout"}
                className="rounded-full border border-[var(--rc-border)] px-4 py-2 text-[13px] font-medium text-[var(--rc-text-secondary)] hover:border-red-400 hover:text-red-400 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <a
              href="/api/auth/signin"
              className="hidden md:block rounded-full border border-[var(--rc-border)] px-4 py-2 text-[13px] font-medium text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)] transition-colors"
            >
              Sign In
            </a>
          )}
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
          {user ? (
            <button
              onClick={() => window.location.href = "/api/auth/signout"}
              className="mt-2 rounded-full border border-[var(--rc-border)] px-5 py-2.5 text-center text-[14px] font-medium text-[var(--rc-text-secondary)] hover:text-red-400 hover:border-red-400"
            >
              Sign Out ({user.email})
            </button>
          ) : (
            <a
              href="/api/auth/signin"
              className="mt-2 rounded-full border border-[var(--rc-border)] px-5 py-2.5 text-center text-[14px] font-medium text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]"
            >
              Sign In
            </a>
          )}
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
