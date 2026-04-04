"use client";

import { useState } from "react";
import { mergedCouncils as councils } from "@/data/merged-councils";
import { PrismLogoFull } from "@/components/PrismLogo";
import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";


const FEATURED_IDS = ["startup", "health", "career", "investment"];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const featuredCouncils = councils.filter((c) => FEATURED_IDS.includes(c.id));


  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="px-6 sm:px-12 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/">
            <PrismLogoFull height={36} />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            <a href="/guide" className="text-[15px] text-[#4A4A5A] hover:text-[#111]">Guide</a>
            <a href="/templates" className="text-[15px] text-[#4A4A5A] hover:text-[#111]">Templates</a>
            <a href="/community" className="text-[15px] text-[#4A4A5A] hover:text-[#111]">Community</a>
            <Link href="/build" className="text-[15px] text-[#4A4A5A] hover:text-[#111]">Build a council</Link>
            <a href="/faq" className="text-[15px] text-[#4A4A5A] hover:text-[#111]">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href="/api/auth/signin" className="hidden sm:block text-[15px] font-medium text-[#4A4A5A] hover:text-[#111]">
              Log in
            </a>
            <Link
              href="/build"
              className="hidden sm:block rounded-full bg-[#111111] px-6 py-2.5 text-[15px] font-medium text-white hover:bg-[#222]"
            >
              Build My Council
            </Link>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden flex flex-col items-center justify-center gap-1.5 p-2"
              aria-label="Menu"
            >
              <span className={`block h-0.5 w-5 bg-[#111] transition-transform ${mobileMenuOpen ? "translate-y-[4px] rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-[#111] transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-[#111] transition-transform ${mobileMenuOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-[var(--rc-border)] mt-4 pt-4 pb-2 flex flex-col gap-3 px-2">
            <a href="/guide" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-[#4A4A5A] hover:text-[#111] py-1">Guide</a>
            <a href="/templates" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-[#4A4A5A] hover:text-[#111] py-1">Templates</a>
            <a href="/community" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-[#4A4A5A] hover:text-[#111] py-1">Community</a>
            <Link href="/build" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-[#4A4A5A] hover:text-[#111] py-1">Build a council</Link>
            <a href="/faq" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-[#4A4A5A] hover:text-[#111] py-1">FAQ</a>
          </nav>
        )}
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="pt-20 sm:pt-32 pb-20 sm:pb-28">
          <div className="grid sm:grid-cols-2 gap-12 sm:gap-20 items-center">
            <div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#111111] sm:text-[52px] sm:leading-[1.1]">
                What would your personal council say?
              </h1>
              <p className="mb-10 max-w-md text-[17px] leading-[1.7] text-[#6B7280]">
                Pick expert personas. Configure the conversation. Paste into ChatGPT, Claude, or Gemini — free.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/build"
                  className="rounded-full bg-[#111111] px-8 py-3.5 text-[15px] font-medium text-white hover:bg-[#222] transition-colors"
                >
                  Build my council →
                </Link>
                <a
                  href="/guide"
                  className="flex items-center gap-2 text-[15px] font-medium text-[#6B7280] hover:text-[#111] transition-colors"
                >
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" opacity="0.5"><polygon points="0,0 10,6 0,12" /></svg>
                  See how it works
                </a>
              </div>
            </div>

            {/* Right — Card */}
            <div className="relative">
              <div className="absolute -top-px left-8 right-8 h-[2px] rounded-full" style={{ background: "linear-gradient(to right, #F97316, #EAB308, #3B82F6)" }} />
              
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.06)]">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9CA3AF]">Question</p>
                <p className="mb-5 text-[15px] font-medium text-[#111] italic">&ldquo;Should I raise a $3–5M round right now?&rdquo;</p>

                <div className="mb-5 h-px" style={{ background: "linear-gradient(to right, #F97316, #EAB308, #3B82F6, transparent)" }} />

                {/* Mobile: collapsible toggle */}
                <button
                  onClick={() => setHeroExpanded((v) => !v)}
                  className="sm:hidden w-full flex items-center justify-between text-[12px] font-semibold text-[#6B7280] mb-3"
                >
                  <span>See council response</span>
                  <span className={`transition-transform ${heroExpanded ? "rotate-180" : ""}`}>▼</span>
                </button>

                <div className={`${heroExpanded ? "block" : "hidden"} sm:block`}>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[13px]">💰</span>
                    <div>
                      <p className="text-[12px] font-semibold text-[#111]">CFO</p>
                      <p className="text-[13px] leading-[1.5] text-[#374151]">Raise, but cut burn 20% first. You need 18–24 months of runway, not 12.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFF7ED] text-[13px]">🚀</span>
                    <div>
                      <p className="text-[12px] font-semibold text-[#111]">Growth Strategist</p>
                      <p className="text-[13px] leading-[1.5] text-[#374151]">Move now. The window is 6–9 months. Waiting costs you leverage and valuation.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FEF2F2] text-[13px]">⚖️</span>
                    <div>
                      <p className="text-[12px] font-semibold text-[#111]">Devil&apos;s Advocate</p>
                      <p className="text-[13px] leading-[1.5] text-[#374151]">You&apos;re solving a cash problem with dilution. Can you hit profitability in 6 months instead?</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0"><circle cx="8" cy="8" r="8" fill="#22C55E"/><path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#16A34A]">Council Recommendation</p>
                  </div>
                  <p className="text-[13px] leading-[1.5] font-medium text-[#374151]">Raise $3–5M, but cut burn 20% first. Start investor conversations within 2 weeks while the window is open.</p>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="border-t border-[#E5E7EB] py-8 flex flex-wrap items-center justify-center gap-12 sm:gap-16 text-[14px] text-[#9CA3AF]">
          <span className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><circle cx="9" cy="9" r="7"/><circle cx="9" cy="9" r="3"/></svg>
            Multi-perspective analysis
          </span>
          <span className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M5 13l4-8 4 8M6.5 10h5"/></svg>
            Conflicting views surfaced
          </span>
          <span className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"><path d="M4 9.5l3.5 3.5 7-7"/></svg>
            Clear, actionable output
          </span>
        </div>
      </div>

      {/* Built for decisions that matter */}
      <div className="bg-[var(--rc-surface)] border-y border-[var(--rc-border)]">
        <div id="councils" className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-[var(--rc-text-primary)]">
            Built for decisions that matter
          </h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            {featuredCouncils.map((council) => {
              const cardCopy: Record<string, { q: string; desc: string }> = {
                startup: { q: "Should I raise, cut burn, or buy time?", desc: "A CFO, growth strategist, and devil\u2019s advocate pressure-test your next move." },
                health: { q: "Am I training smart, or running myself into the ground?", desc: "A sports doc, nutritionist, and recovery specialist review the plan." },
                career: { q: "Should I take the offer, stay put, or negotiate?", desc: "Multiple perspectives before you make the call." },
                investment: { q: "Is this conviction, or am I rationalizing a bad trade?", desc: "A bull, a bear, and a tax-aware strategist stress-test the thesis." },
              };
              const copy = cardCopy[council.id];
              return (
                <Link
                  key={council.id}
                  href={`/build?council=${council.id}`}
                  className="group rounded-xl border border-[var(--rc-border)] bg-[var(--rc-card)] p-3 sm:p-4 text-left hover:border-[var(--rc-text-muted)] hover:shadow-md transition-all"
                >
                  <div className="mb-1.5 sm:mb-2 text-2xl sm:text-3xl">{council.emoji}</div>
                  <h3 className="text-sm sm:text-lg font-semibold tracking-tight text-[var(--rc-text-primary)]">
                    {council.name}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm italic text-[var(--rc-text-muted)] sm:text-[var(--rc-text-secondary)] line-clamp-2 sm:line-clamp-none">
                    &ldquo;{copy ? copy.q : council.description}&rdquo;
                  </p>
                  <p className="hidden sm:block mt-2 text-xs text-[var(--rc-text-secondary)]">
                    {copy ? copy.desc : council.tagline}
                  </p>
                  <div className="mt-2 text-xs text-[var(--rc-text-secondary)] font-medium text-right opacity-0 group-hover:opacity-100 transition-opacity">Build →</div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/templates"
              className="rounded-full border border-[var(--rc-border)] px-5 py-2 text-sm font-medium text-[var(--rc-text-secondary)] hover:border-[var(--rc-text-muted)] hover:text-[var(--rc-text-primary)]"
            >
              Browse all templates →
            </Link>
          </div>
        </div>
      </div>

      {/* Why councils work */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-[var(--rc-text-primary)]">
          Why councils work better than a single answer
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--rc-border)] bg-[var(--rc-card)] p-6">
            <div className="mb-3 text-2xl">🔍</div>
            <h3 className="mb-1 font-semibold text-[var(--rc-text-primary)]">Multiple lenses</h3>
            <p className="text-sm text-[var(--rc-text-secondary)]">Finance, legal, brand, ops, risk — each advisor sees what the others miss.</p>
          </div>
          <div className="rounded-xl border border-[var(--rc-border)] bg-[var(--rc-card)] p-6">
            <div className="mb-3 text-2xl">⚡</div>
            <h3 className="mb-1 font-semibold text-[var(--rc-text-primary)]">Built-in disagreement</h3>
            <p className="text-sm text-[var(--rc-text-secondary)]">The system argues before you act. A Devil&apos;s Advocate catches what consensus thinking misses.</p>
          </div>
          <div className="rounded-xl border border-[var(--rc-border)] bg-[var(--rc-card)] p-6">
            <div className="mb-3 text-2xl">📋</div>
            <h3 className="mb-1 font-semibold text-[var(--rc-text-primary)]">Clear output</h3>
            <p className="text-sm text-[var(--rc-text-secondary)]">Recommendation, tradeoffs, and the immediate next move — not a wall of text.</p>
          </div>
        </div>
      </div>

      {/* Email Capture */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
        <EmailCapture />
      </div>

      {/* Final CTA */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-[var(--rc-text-primary)] sm:text-3xl">
          Ready to think better?
        </h2>
        <Link
          href="/build"
          className="inline-block rounded-full bg-[#111111] dark:bg-white px-8 py-3 text-sm font-medium text-white dark:text-[#111111] hover:opacity-90"
        >
          Build my council →
        </Link>
        <p className="mt-3 text-xs text-[var(--rc-text-muted)]">No signup · No API key · Works with any AI tool</p>
      </div>
    </main>
  );
}
