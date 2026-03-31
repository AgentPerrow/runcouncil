"use client";

import { useState } from "react";
import { templates, templateCategories, CouncilTemplate } from "@/data/templates";
import Link from "next/link";

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const filtered = activeCategory
    ? templates.filter((t) => t.category === activeCategory)
    : templates;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            RunCouncil
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDark}
              className="rounded-md p-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <Link href="/guide" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
              Guide
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Templates
          </h1>
          <p className="text-sm sm:text-base text-zinc-500">
            Pre-built councils for common decisions. Pick one, customize, go.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === null
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            All
          </button>
          {templateCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <Link
              key={template.id}
              href={`/?template=${template.id}`}
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 sm:p-5 text-left hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{template.emoji}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                  {template.category}
                </span>
              </div>
              <h3 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
                {template.title}
              </h3>
              <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                {template.question}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-zinc-400">{template.memberIds.length} advisors</span>
                <span className="text-xs text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-500 transition-colors">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Or build from scratch →
          </Link>
        </div>
      </div>
    </main>
  );
}
