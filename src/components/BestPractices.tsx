"use client";

const tips = [
  {
    emoji: "⚡",
    title: "Use tiers",
    content: "Quick decisions: 2-3 members. Important ones: 4-5. Full council only for major, irreversible calls.",
  },
  {
    emoji: "🎯",
    title: "Frame the decision",
    content: "Don't just ask \"what do you think?\" — state the options, constraints, and stakes. Better input = sharper output.",
  },
  {
    emoji: "😈",
    title: "Run Devil's Advocate separately",
    content: "Ask all other members first, then paste the question to the DA without showing other answers. Prevents groupthink.",
  },
  {
    emoji: "🔄",
    title: "Chase the disagreements",
    content: "When two members disagree, that's the signal. Ask what assumption each position depends on — that's where the real tradeoff lives.",
  },
  {
    emoji: "📏",
    title: "State your constraints",
    content: "Budget, timeline, team size, risk tolerance. \"I have $5K and 2 weeks\" changes every recommendation.",
  },
  {
    emoji: "🧪",
    title: "Calibrate with a past decision",
    content: "Run a decision you already made through the council first. See if it catches what you missed. Builds trust in the output.",
  },
];

export default function BestPractices() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8">
      <h3 className="mb-1 text-lg font-semibold text-white">
        Get better results from your council
      </h3>
      <p className="mb-5 text-sm text-zinc-500">
        Small tweaks that make a big difference.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span>{tip.emoji}</span>
              <span className="text-sm font-medium text-zinc-200">{tip.title}</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-500">{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
