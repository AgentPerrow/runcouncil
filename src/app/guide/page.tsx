"use client";

import Link from "next/link";
import DemoSection from "@/components/DemoSection";
import SiteNav from "@/components/SiteNav";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <SiteNav activePage="guide" />

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Guide
        </h1>
        <p className="mb-10 text-lg text-zinc-500">
          Why councils work, how to build one, and the mistakes to avoid.
        </p>

        {/* Why build a council */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Why build a council?</h2>
          <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              When you ask ChatGPT a question, you get one perspective. It&apos;s helpful, but it&apos;s a single voice — eager to agree, unlikely to push back, and blind to what it doesn&apos;t know.
            </p>
            <p>
              A council changes that. Instead of one generalist answer, you get a CFO who flags the financial risk, a lawyer who spots the liability, a strategist who sees the opportunity, and a devil&apos;s advocate who tells you why you&apos;re wrong. They deliberate, disagree, and synthesize — just like a real advisory board would.
            </p>
            <p>
              The result? Decisions that account for what you didn&apos;t think to ask. Blind spots surfaced before they become problems. And a structured output you can actually act on — not a wall of hedging and caveats.
            </p>
            <p>
              RunCouncil gives you the prompt to make this happen in any AI tool. Pick your experts, configure the conversation, and paste it in. It takes two minutes and it&apos;s free.
            </p>
          </div>
        </section>

        <hr className="mb-16 border-zinc-200 dark:border-zinc-800" />

        {/* How to run your council */}
        <h2 className="mb-2 text-2xl font-bold">How to run your council</h2>
        <p className="mb-12 text-sm text-zinc-500">
          Prompt strategies, follow-up techniques, and the mistakes that make councils useless.
        </p>

        {/* Setup */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Setup</h2>
          <div className="space-y-8">
            <div>
              <h3 className="mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">1. Build your council</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Pick a council type, customize the members for your situation, and hit Generate. You&apos;ll get a complete prompt with all your council members and their deliberation rules.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">2. Copy the prompt into your AI tool</h3>
              <p className="mb-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                The output works with any LLM. Here&apos;s how to set it up on each platform:
              </p>
              <div className="space-y-3">
                {[
                  { name: "ChatGPT", text: "Start a new conversation. Paste the full council prompt as your first message. Then ask your question in a follow-up message. For repeat use, create a Custom GPT and paste the prompt in the \"Instructions\" field." },
                  { name: "Claude", text: "Start a new conversation. Paste the full prompt, then add your question after it. For repeat use, create a Project and add the prompt as project instructions — then every conversation in that project uses your council automatically." },
                  { name: "Gemini", text: "Open a new chat. Paste the prompt and your question together. Gemini's long context window handles the full council prompt well." },
                  { name: "OpenClaw / Local Agents", text: "Save the prompt as a skill or system prompt. For true parallel deliberation, run each council member as a separate sub-agent — this gives you genuinely independent responses instead of one model role-playing all members sequentially." },
                ].map((p) => (
                  <div key={p.name} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h4 className="mb-1 text-sm font-semibold">{p.name}</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-zinc-800 dark:text-zinc-200">3. Ask your question</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Once the prompt is loaded, just ask your question naturally. The AI will respond as each council member in sequence, then provide a synthesis with the final recommendation.
              </p>
            </div>
          </div>
        </section>

        {/* Demo */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">See It In Action</h2>
          <DemoSection />
        </section>

        {/* Best Practices */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Best Practices</h2>
          <div className="space-y-6">
            {[
              {
                emoji: "⚡", title: "Use tiers — don't ask everyone everything",
                body: "Your council has a tier system built in. Use it:",
                list: [
                  ["Tier 1 (Quick):", "2-3 members. For fast decisions under $1K or easily reversible choices."],
                  ["Tier 2 (Standard):", "4-5 members. For meaningful decisions with real consequences."],
                  ["Tier 3 (Full Council):", "Everyone. Reserve for major, irreversible, or high-stakes calls."],
                ],
                footer: "Using all members for every question wastes tokens and dilutes signal."
              },
              {
                emoji: "🎯", title: "Frame the decision, not just the question",
                body: "The quality of your council's output depends entirely on how you frame the input.",
                examples: [
                  { bad: true, text: "\"What do you think about expanding to Europe?\"" },
                  { bad: false, text: "\"I'm deciding whether to expand to Europe in Q3 or double down on US growth. We have $200K runway, 3 team members, and our US revenue is $15K/mo growing 20% MoM. Our product is B2B SaaS. What's the right move?\"" },
                ],
                footer: "Include: the options you're weighing, your constraints, the stakes, and context."
              },
              {
                emoji: "😈", title: "Run the Devil's Advocate separately",
                body: "The Devil's Advocate is designed to be independent. For best results, run them in a separate conversation so they can't see other members' answers.",
                footer: "This is the difference between a rubber-stamp DA and one that catches blind spots."
              },
              {
                emoji: "🔄", title: "Chase the disagreements",
                body: "When two council members disagree, that's the most valuable signal. Follow up to surface the underlying assumptions.",
                footer: "The disagreement reveals the actual tradeoff. That's where the real decision lives."
              },
              {
                emoji: "📏", title: "State your constraints upfront",
                body: "Every recommendation changes based on your constraints. Always include budget, timeline, team, risk tolerance, and non-negotiables.",
                footer: "\"I have $5K and 2 weeks\" produces completely different advice than \"I have $500K and 6 months.\""
              },
              {
                emoji: "🧪", title: "Calibrate with a past decision",
                body: "Before trusting your council on a big call, run a decision you already made through it. Compare the council's recommendation to what you did and what happened.",
                footer: "This calibrates your trust and shows which members to weight more heavily."
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="mb-2 flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.body}</p>
                {item.list && (
                  <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.list.map(([label, desc]) => (
                      <li key={label}>• <strong className="text-zinc-800 dark:text-zinc-300">{label}</strong> {desc}</li>
                    ))}
                  </ul>
                )}
                {item.examples && (
                  <div className="mt-3 space-y-2">
                    {item.examples.map((ex, i) => (
                      <div key={i} className={`rounded-md px-3 py-2 ${ex.bad ? "border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-950/30" : "border border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-950/30"}`}>
                        <p className={`text-xs mb-0.5 ${ex.bad ? "text-red-500 dark:text-red-400/80" : "text-green-600 dark:text-green-400/80"}`}>{ex.bad ? "❌ Weak" : "✅ Strong"}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{ex.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                {item.footer && <p className="mt-2 text-sm text-zinc-500">{item.footer}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Tips */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Advanced</h2>
          <div className="space-y-6">
            {[
              { emoji: "🔧", title: "Edit the prompts", text: "The generated prompts are a starting point. Customize them — add industry context, change focus areas, adjust output format. Download the .md file, edit it, and keep your own version." },
              { emoji: "📊", title: "Track your decisions", text: "Keep a simple log: what you asked, what the council recommended, what you decided, and what happened. Review monthly to see which members add the most value." },
              { emoji: "🎭", title: "Create specialist members", text: "The pre-built members are generalists. For your specific industry, create custom members with deep domain knowledge. A \"DTC E-commerce Expert\" is more useful than a generic \"CMO\" if you're running a Shopify store." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="mb-2 flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
          <h3 className="mb-2 text-xl font-bold">Ready to build?</h3>
          <p className="mb-4 text-sm text-zinc-500">Create your council in under 2 minutes.</p>
          <Link href="/" className="inline-block rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
            Build Your Council →
          </Link>
        </div>
      </div>
    </main>
  );
}
