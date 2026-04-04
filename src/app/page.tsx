"use client";

import { useState } from "react";
import { mergedCouncils as councils } from "@/data/merged-councils";
import { PrismLogoFull } from "@/components/PrismLogo";
import Link from "next/link";



export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



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
            <a href="/guide" className="hidden sm:block text-[15px] font-medium text-[#4A4A5A] hover:text-[#111]">
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

      {/* How it works */}
      <div id="how-it-works" className="bg-[var(--rc-surface)] border-y border-[var(--rc-border)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-[var(--rc-text-primary)]">
            How it works
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] dark:bg-white text-sm font-bold text-white dark:text-[#111111]">1</div>
              <h3 className="mb-1 font-semibold text-[var(--rc-text-primary)]">Pick a council</h3>
              <p className="text-sm text-[var(--rc-text-secondary)]">Start from a template or build your own from scratch.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] dark:bg-white text-sm font-bold text-white dark:text-[#111111]">2</div>
              <h3 className="mb-1 font-semibold text-[var(--rc-text-primary)]">Customize the room</h3>
              <p className="text-sm text-[var(--rc-text-secondary)]">Add, remove, or create advisors. Tune how aggressive or conservative they think.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] dark:bg-white text-sm font-bold text-white dark:text-[#111111]">3</div>
              <h3 className="mb-1 font-semibold text-[var(--rc-text-primary)]">Run the council</h3>
              <p className="text-sm text-[var(--rc-text-secondary)]">Paste the prompt into ChatGPT, Claude, or Gemini and get a decision memo in minutes.</p>
            </div>
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
