"use client";

import { useState } from "react";
import Link from "next/link";
import type { Metadata } from "next";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is RunCouncil?",
    answer:
      "RunCouncil lets you build a custom AI advisory council — a group of specialized AI advisors who debate your decisions from different angles. Pick your advisors, customize them to your situation, and copy the prompt into ChatGPT, Claude, Gemini, or any AI tool you use.",
  },
  {
    question: "How does it work?",
    answer:
      "Pick a council type (startup, health, career, etc.), answer a few questions about your situation, then choose your advisors. RunCouncil generates a detailed system prompt that turns your AI into a multi-perspective advisory board. Copy it, paste it into your AI tool, and start asking questions.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. No signup, no login, no email required. Just pick your council, copy the prompt, and go.",
  },
  {
    question: "Which AI tools does it work with?",
    answer:
      "Any AI tool that accepts a system prompt or custom instructions. ChatGPT, Claude, Gemini, Copilot, Perplexity, Grok — if you can paste text into it, it works.",
  },
  {
    question: "How is this different from just asking ChatGPT a question?",
    answer:
      "When you ask one AI one question, you get one perspective. RunCouncil gives you 4-8 specialized advisors who each respond from their domain — a CFO thinks about money, a lawyer thinks about risk, a Devil's Advocate pokes holes in everything. You get structured disagreement instead of a single answer.",
  },
  {
    question: "What's a Devil's Advocate and why is one included?",
    answer:
      "Every council includes a Devil's Advocate — an advisor whose job is to challenge assumptions, find weaknesses, and push back on consensus. Without one, AI advisory tends toward agreeable, safe answers. The Devil's Advocate forces the council to actually think.",
  },
  {
    question: "Can I customize the advisors?",
    answer:
      "Yes. You can add or remove members, create entirely custom advisors with your own prompts, and tune how aggressive or conservative the council thinks using the configuration sliders.",
  },
  {
    question: "What are templates?",
    answer:
      "Templates are pre-built council configurations for specific situations — like negotiating a severance package, raising startup funding, or buying your first home. They come with hand-picked advisors and deep, specific prompts. One click and you're ready to go.",
  },
  {
    question: "Does RunCouncil use my data?",
    answer:
      "No. RunCouncil generates a prompt that you copy and paste. Your conversations happen directly between you and your AI tool. RunCouncil never sees your questions or the AI's responses.",
  },
  {
    question: "Is there an API?",
    answer:
      "Not yet. If there's demand for it, it's something we'd consider building. For now, copy-paste keeps things simple and model-agnostic.",
  },
  {
    question: "Can I share my council with someone?",
    answer:
      "Yes. After generating your council, click \"Share Council\" to get a link. Anyone with that link can load your exact configuration — same advisors, same setup.",
  },
  {
    question: "How many advisors should I use?",
    answer:
      "2-3 for quick, low-stakes decisions. 4-5 for meaningful ones. 6+ for major, irreversible, or high-stakes decisions. More advisors means more perspectives but longer responses.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            RunCouncil
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/templates"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Templates
            </Link>
            <Link
              href="/guide"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Guide
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mb-10 text-zinc-500">
          Everything you need to know about RunCouncil.
        </p>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="pr-4 font-medium text-zinc-900 dark:text-zinc-100">
                  {faq.question}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`shrink-0 text-zinc-400 dark:text-zinc-600 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-3">
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 text-center">
          <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
            Ready to build your council?
          </h3>
          <p className="mb-4 text-sm text-zinc-500">
            Pick your advisors, ask the hard question, let them argue.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-400"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </main>
  );
}
