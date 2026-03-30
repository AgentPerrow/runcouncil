"use client";

import { useState } from "react";

interface DemoResponse {
  emoji: string;
  name: string;
  role: string;
  response: string;
}

interface Demo {
  question: string;
  councilType: string;
  responses: DemoResponse[];
  synthesis: string;
}

const DEMOS: Demo[] = [
  {
    question: "Should I raise a seed round or bootstrap?",
    councilType: "Startup",
    responses: [
      {
        emoji: "👑",
        name: "CEO Mind",
        role: "Strategic Tiebreaker",
        response: `**Core recommendation:** Bootstrap until you have clear product-market fit signal, then raise from a position of strength.

**Why it matters:** Raising pre-PMF means selling equity at the lowest possible valuation and giving up leverage you'll never get back. Every bootstrapped month with revenue is a data point that increases your next valuation 2-5x.

**What to ignore:** The "raise fast, move fast" VC narrative. That's their business model, not yours.

**Confidence:** High
**What would change this answer:** If the market has a clear 12-month window that closes (regulatory, platform shift), speed matters more than dilution.`,
      },
      {
        emoji: "💰",
        name: "CFO",
        role: "Financial Advisor",
        response: `**Financial assessment:** At pre-revenue, a seed round likely means 15-25% dilution at a $2-5M valuation. That's expensive equity.

**Key risks:** Running out of runway before PMF. But also: raising too early locks in a low valuation that haunts every future round.

**Recommendation:** If you can sustain 6-12 months of expenses personally, bootstrap. If not, raise the minimum viable round — $250-500K on a SAFE, not a priced round.

**Confidence:** Medium
**What would change this answer:** Your monthly burn rate and personal runway. If it's <3 months, raise immediately.`,
      },
      {
        emoji: "😈",
        name: "Devil's Advocate",
        role: "Independent Critic",
        response: `**Strongest objection:** "Bootstrap until PMF" is survivorship bias advice. For every Basecamp, there are 10,000 bootstrapped startups that died slowly because they couldn't invest in growth fast enough.

**Why this may fail:** Bootstrapping feels virtuous but it can be a trap. You're trading equity dilution for time dilution — and time is your most expensive resource.

**Key assumption doing all the work:** That you'll find PMF on a shoestring budget. Most founders underestimate how many iterations (and how much money) that takes.

**Confidence:** Medium
**What would change this answer:** If the founder has done this before and has strong distribution instincts, bootstrapping is viable. First-time founders with no audience should probably raise.`,
      },
    ],
    synthesis: `**Synthesis:** The council leans toward bootstrapping with a caveat. CEO Mind and CFO agree: don't raise pre-PMF if you can avoid it. Devil's Advocate raises a valid counter — bootstrapping can be slow death if you can't iterate fast enough.

**Key disagreement:** Whether time or equity is more expensive at this stage. CEO Mind says equity; DA says time.

**Final recommendation:** Bootstrap if you have 6+ months personal runway. If not, raise a small SAFE ($250-500K) to buy time without giving up a board seat or a priced round. Revisit when you have revenue.`,
  },
  {
    question: "I'm 38, sitting at a desk all day, and want to get in the best shape of my life. Where do I start?",
    councilType: "Health",
    responses: [
      {
        emoji: "🏋️",
        name: "Strength Coach",
        role: "Training Programming",
        response: `**Training recommendation:** Start with 3x/week full-body strength training. Compound movements only — squat, hinge, push, pull, carry. No isolation work yet.

**Progression plan:** Week 1-4: learn the movements with light weight. Week 5-8: add weight progressively. By week 12 you should be lifting meaningfully. Don't rush this — you're building a 20-year habit, not a 20-day transformation.

**Recovery considerations:** At 38 with a desk job, your hips and thoracic spine are probably locked up. 10 min mobility work before every session. Non-negotiable.

**Confidence:** High
**What would change this answer:** Pre-existing injuries or medical conditions. Get cleared by a doctor first.`,
      },
      {
        emoji: "🥗",
        name: "Nutritionist",
        role: "Diet & Supplements",
        response: `**Nutrition recommendation:** Don't overhaul everything at once. Start with protein — aim for 0.8g per pound of bodyweight. Most desk workers get half that. This single change will drive more results than any diet.

**Supplementation:** Creatine monohydrate (5g/day), Vitamin D3 (2000-4000 IU if you're indoors all day), magnesium glycinate before bed. That's it — everything else is noise at this stage.

**Sustainability check:** Skip the meal prep Instagram fantasy. Find 4-5 high-protein meals you actually enjoy and rotate them. Consistency beats perfection every time.

**Confidence:** High
**What would change this answer:** Specific dietary restrictions, digestive issues, or medical conditions.`,
      },
      {
        emoji: "😈",
        name: "Devil's Advocate",
        role: "Reality Checker",
        response: `**Strongest objection:** "Best shape of my life" is a recipe for a 6-week sprint followed by burnout. The #1 predictor of fitness success isn't the program — it's whether you're still doing it in 6 months.

**Hidden risk:** At 38 with years of desk work, you probably have movement dysfunctions you can't feel yet. Going hard without addressing these = injury within 8 weeks. Seen it a hundred times.

**BS check:** You don't need a fancy program. You need to show up 3x/week and not get hurt. That's 90% of the game.

**Reality check:** The first month will feel amazing. Month 2-3 is where everyone quits. Plan for that now — what's your strategy for the day you don't feel like going?

**Confidence:** High
**What would change this answer:** If this person has a training history and is returning after a break, they can push harder faster.`,
      },
    ],
    synthesis: `**Synthesis:** Unanimous agreement: start with strength training 3x/week, prioritize protein, don't overcomplicate it. The council diverges on intensity — Strength Coach wants progressive overload, DA wants you to pump the brakes and focus on longevity.

**Key insight:** The Nutritionist's protein-first approach and the DA's "plan for month 3" advice are the two things that will actually determine success. The program matters less than people think.

**Final recommendation:** 3x/week full-body lifting + 0.8g/lb protein + creatine + mobility work. Start lighter than your ego wants. Plan your "I don't want to go" strategy now. Reassess at 90 days.`,
  },
];

export default function DemoSection() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  const demo = DEMOS[activeDemo];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="mb-6">
        <h3 className="mb-1 text-lg font-semibold">See it in action</h3>
        <p className="text-sm text-zinc-500">Real council responses to real questions.</p>
      </div>

      {/* Demo Tabs */}
      <div className="mb-6 flex gap-2">
        {DEMOS.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveDemo(i);
              setExpandedMember(null);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              activeDemo === i
                ? "bg-zinc-900 text-white dark:bg-zinc-700"
                : "bg-zinc-100 text-zinc-500 hover:text-zinc-700 dark:bg-zinc-900 dark:hover:text-zinc-300"
            }`}
          >
            {d.councilType}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs text-zinc-500 mb-1">Question:</p>
        <p className="text-sm text-zinc-700 italic dark:text-zinc-200">&ldquo;{demo.question}&rdquo;</p>
      </div>

      {/* Responses */}
      <div className="space-y-3">
        {demo.responses.map((r, i) => (
          <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <button
              onClick={() => setExpandedMember(expandedMember === i ? null : i)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{r.emoji}</span>
                <div>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">{r.name}</span>
                  <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-600">{r.role}</span>
                </div>
              </div>
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
                className={`text-zinc-400 dark:text-zinc-600 transition-transform ${
                  expandedMember === i ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {expandedMember === i && (
              <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
                <div className="prose prose-sm max-w-none text-sm text-zinc-600 whitespace-pre-line dark:prose-invert dark:text-zinc-300">
                  {r.response}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* The Verdict — always visible */}
        <div className="mt-4 rounded-lg border border-zinc-300 bg-gradient-to-b from-zinc-100 to-zinc-50 p-5 dark:border-zinc-600 dark:from-zinc-800 dark:to-zinc-900">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="text-base font-semibold">The Verdict</span>
          </div>
          <div className="text-sm leading-relaxed text-zinc-700 whitespace-pre-line dark:text-zinc-200">
            {demo.synthesis}
          </div>
        </div>
      </div>
    </div>
  );
}
