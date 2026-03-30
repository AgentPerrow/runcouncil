"use client";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  label: string;
  type: "dropdown";
  options: QuestionOption[];
}

export interface Scale {
  id: string;
  leftLabel: string;
  rightLabel: string;
  defaultValue: number; // 0-100
}

export interface CouncilConfig {
  questions: Question[];
  scales: Scale[];
}

// Per-council configurations
export const COUNCIL_CONFIGS: Record<string, CouncilConfig> = {
  startup: {
    questions: [
      {
        id: "industry",
        label: "What industry?",
        type: "dropdown",
        options: [
          { value: "general", label: "General" },
          { value: "saas", label: "SaaS" },
          { value: "dtc", label: "DTC / E-commerce" },
          { value: "marketplace", label: "Marketplace" },
          { value: "hardware", label: "Hardware / Physical Product" },
          { value: "services", label: "Services / Agency" },
          { value: "fintech", label: "Fintech" },
          { value: "healthtech", label: "Healthtech" },
          { value: "ai", label: "AI / ML" },
          { value: "creator", label: "Creator Economy" },
        ],
      },
      {
        id: "stage",
        label: "What stage?",
        type: "dropdown",
        options: [
          { value: "idea", label: "Idea / Pre-build" },
          { value: "building", label: "Building MVP" },
          { value: "pre-revenue", label: "Launched, Pre-revenue" },
          { value: "early-revenue", label: "Early Revenue ($1-50K/mo)" },
          { value: "scaling", label: "Scaling ($50K+/mo)" },
          { value: "profitable", label: "Profitable" },
        ],
      },
      {
        id: "funding",
        label: "Funding model?",
        type: "dropdown",
        options: [
          { value: "undecided", label: "Undecided" },
          { value: "bootstrapped", label: "Bootstrapped" },
          { value: "pre-seed", label: "Raising Pre-seed / Angel" },
          { value: "seed", label: "Raising Seed" },
          { value: "series-a", label: "Series A+" },
          { value: "revenue-funded", label: "Revenue-funded" },
        ],
      },
      {
        id: "team",
        label: "Team size?",
        type: "dropdown",
        options: [
          { value: "solo", label: "Solo founder" },
          { value: "cofounders", label: "2-3 co-founders" },
          { value: "small", label: "Small team (4-10)" },
          { value: "medium", label: "Medium (10-50)" },
          { value: "large", label: "50+" },
        ],
      },
    ],
    scales: [
      { id: "risk", leftLabel: "Conservative", rightLabel: "Aggressive", defaultValue: 50 },
      { id: "speed", leftLabel: "Build it right", rightLabel: "Ship fast", defaultValue: 50 },
      { id: "focus", leftLabel: "Product-first", rightLabel: "Distribution-first", defaultValue: 50 },
    ],
  },
  health: {
    questions: [
      {
        id: "goal",
        label: "Primary goal?",
        type: "dropdown",
        options: [
          { value: "general", label: "General Health" },
          { value: "fatloss", label: "Fat Loss" },
          { value: "muscle", label: "Build Muscle" },
          { value: "strength", label: "Get Stronger" },
          { value: "athletic", label: "Athletic Performance" },
          { value: "longevity", label: "Longevity" },
          { value: "recovery", label: "Injury Recovery" },
          { value: "mental", label: "Mental Health" },
        ],
      },
      {
        id: "age",
        label: "Age range?",
        type: "dropdown",
        options: [
          { value: "20s", label: "20s" },
          { value: "30s", label: "30s" },
          { value: "40s", label: "40s" },
          { value: "50s", label: "50s" },
          { value: "60plus", label: "60+" },
        ],
      },
      {
        id: "experience",
        label: "Fitness experience?",
        type: "dropdown",
        options: [
          { value: "beginner", label: "Beginner (< 1 year)" },
          { value: "intermediate", label: "Intermediate (1-3 years)" },
          { value: "advanced", label: "Advanced (3+ years)" },
          { value: "returning", label: "Returning after a break" },
        ],
      },
      {
        id: "time",
        label: "Hours per week?",
        type: "dropdown",
        options: [
          { value: "minimal", label: "< 3 hours" },
          { value: "moderate", label: "3-5 hours" },
          { value: "dedicated", label: "5-10 hours" },
          { value: "serious", label: "10+ hours" },
        ],
      },
    ],
    scales: [
      { id: "intensity", leftLabel: "Easy & sustainable", rightLabel: "Push me hard", defaultValue: 50 },
      { id: "approach", leftLabel: "Natural / holistic", rightLabel: "Science / data-driven", defaultValue: 65 },
      { id: "timeframe", leftLabel: "Long-term habits", rightLabel: "Fast results", defaultValue: 40 },
    ],
  },
  career: {
    questions: [
      {
        id: "situation",
        label: "What's the situation?",
        type: "dropdown",
        options: [
          { value: "exploring", label: "Exploring options" },
          { value: "job-search", label: "Active job search" },
          { value: "offer", label: "Evaluating an offer" },
          { value: "negotiating", label: "Negotiating compensation" },
          { value: "promotion", label: "Going for a promotion" },
          { value: "pivot", label: "Career pivot" },
          { value: "freelance", label: "Going freelance / independent" },
          { value: "leaving", label: "Thinking about leaving" },
        ],
      },
      {
        id: "level",
        label: "Career level?",
        type: "dropdown",
        options: [
          { value: "early", label: "Early career (0-5 years)" },
          { value: "mid", label: "Mid career (5-15 years)" },
          { value: "senior", label: "Senior / Director" },
          { value: "executive", label: "VP / Executive" },
          { value: "founder", label: "Founder / C-suite" },
        ],
      },
      {
        id: "industry",
        label: "Industry?",
        type: "dropdown",
        options: [
          { value: "general", label: "General" },
          { value: "tech", label: "Tech / Software" },
          { value: "finance", label: "Finance" },
          { value: "consulting", label: "Consulting" },
          { value: "creative", label: "Creative / Design" },
          { value: "healthcare", label: "Healthcare" },
          { value: "education", label: "Education" },
          { value: "other", label: "Other" },
        ],
      },
    ],
    scales: [
      { id: "risk", leftLabel: "Stability first", rightLabel: "Bet on myself", defaultValue: 50 },
      { id: "priority", leftLabel: "Work-life balance", rightLabel: "Maximum income", defaultValue: 50 },
      { id: "timeline", leftLabel: "No rush", rightLabel: "Need to move now", defaultValue: 50 },
    ],
  },
  creative: {
    questions: [
      {
        id: "medium",
        label: "What do you create?",
        type: "dropdown",
        options: [
          { value: "general", label: "General / Multi" },
          { value: "writing", label: "Writing / Content" },
          { value: "video", label: "Video / YouTube" },
          { value: "music", label: "Music" },
          { value: "visual", label: "Visual Art / Design" },
          { value: "podcast", label: "Podcast" },
          { value: "photography", label: "Photography" },
        ],
      },
      {
        id: "stage",
        label: "Where are you?",
        type: "dropdown",
        options: [
          { value: "starting", label: "Just starting" },
          { value: "building", label: "Building an audience" },
          { value: "established", label: "Established following" },
          { value: "monetizing", label: "Monetizing" },
          { value: "scaling", label: "Scaling a creative business" },
        ],
      },
    ],
    scales: [
      { id: "commercial", leftLabel: "Pure art", rightLabel: "Commercial focus", defaultValue: 50 },
      { id: "risk", leftLabel: "Play it safe", rightLabel: "Experiment boldly", defaultValue: 60 },
    ],
  },
  investment: {
    questions: [
      {
        id: "focus",
        label: "Investment focus?",
        type: "dropdown",
        options: [
          { value: "general", label: "General Portfolio" },
          { value: "stocks", label: "Stocks / Equities" },
          { value: "real-estate", label: "Real Estate" },
          { value: "crypto", label: "Crypto / Digital Assets" },
          { value: "private", label: "Private Equity / Startups" },
          { value: "mixed", label: "Mixed / Diversified" },
        ],
      },
      {
        id: "amount",
        label: "Portfolio size?",
        type: "dropdown",
        options: [
          { value: "small", label: "< $50K" },
          { value: "medium", label: "$50K - $500K" },
          { value: "large", label: "$500K - $5M" },
          { value: "hnw", label: "$5M+" },
        ],
      },
      {
        id: "horizon",
        label: "Time horizon?",
        type: "dropdown",
        options: [
          { value: "short", label: "< 2 years" },
          { value: "medium", label: "2-10 years" },
          { value: "long", label: "10+ years" },
          { value: "retirement", label: "Retirement planning" },
        ],
      },
    ],
    scales: [
      { id: "risk", leftLabel: "Capital preservation", rightLabel: "Maximum growth", defaultValue: 50 },
      { id: "active", leftLabel: "Passive / set & forget", rightLabel: "Active management", defaultValue: 40 },
    ],
  },
  parenting: {
    questions: [
      {
        id: "age",
        label: "Child's age?",
        type: "dropdown",
        options: [
          { value: "baby", label: "Baby (0-1)" },
          { value: "toddler", label: "Toddler (1-3)" },
          { value: "preschool", label: "Preschool (3-5)" },
          { value: "elementary", label: "Elementary (5-10)" },
          { value: "tween", label: "Tween (10-13)" },
          { value: "teen", label: "Teen (13-18)" },
          { value: "multiple", label: "Multiple ages" },
        ],
      },
      {
        id: "concern",
        label: "Primary concern?",
        type: "dropdown",
        options: [
          { value: "general", label: "General parenting" },
          { value: "behavior", label: "Behavior / Discipline" },
          { value: "education", label: "Education / School" },
          { value: "health", label: "Health / Development" },
          { value: "social", label: "Social / Friendships" },
          { value: "screen", label: "Screen time / Technology" },
          { value: "family", label: "Family dynamics" },
        ],
      },
    ],
    scales: [
      { id: "style", leftLabel: "Structured / Scheduled", rightLabel: "Free-range / Flexible", defaultValue: 50 },
      { id: "approach", leftLabel: "Gentle parenting", rightLabel: "Traditional / Firm", defaultValue: 50 },
    ],
  },
  life: {
    questions: [
      {
        id: "area",
        label: "What area of life?",
        type: "dropdown",
        options: [
          { value: "general", label: "General / Multiple" },
          { value: "relationship", label: "Relationship" },
          { value: "relocation", label: "Moving / Relocation" },
          { value: "purpose", label: "Purpose / Direction" },
          { value: "financial", label: "Major financial decision" },
          { value: "transition", label: "Life transition" },
          { value: "conflict", label: "Conflict / Difficult situation" },
        ],
      },
    ],
    scales: [
      { id: "risk", leftLabel: "Play it safe", rightLabel: "Take the leap", defaultValue: 50 },
      { id: "timeline", leftLabel: "Take my time", rightLabel: "Decide now", defaultValue: 50 },
      { id: "priority", leftLabel: "Stability & security", rightLabel: "Growth & fulfillment", defaultValue: 50 },
    ],
  },
};

// Generate context string from questionnaire answers
export function generateConfigContext(
  councilId: string,
  answers: Record<string, string>,
  scaleValues: Record<string, number>
): string {
  const config = COUNCIL_CONFIGS[councilId];
  if (!config) return "";

  const parts: string[] = [];

  // Questions
  for (const q of config.questions) {
    const answer = answers[q.id];
    if (answer) {
      const option = q.options.find((o) => o.value === answer);
      if (option && option.value !== "general") {
        parts.push(`- ${q.label} **${option.label}**`);
      }
    }
  }

  // Scales
  for (const s of config.scales) {
    const value = scaleValues[s.id] ?? s.defaultValue;
    let description: string;
    if (value <= 20) description = `Strongly ${s.leftLabel.toLowerCase()}`;
    else if (value <= 40) description = `Leaning ${s.leftLabel.toLowerCase()}`;
    else if (value <= 60) description = `Balanced between ${s.leftLabel.toLowerCase()} and ${s.rightLabel.toLowerCase()}`;
    else if (value <= 80) description = `Leaning ${s.rightLabel.toLowerCase()}`;
    else description = `Strongly ${s.rightLabel.toLowerCase()}`;
    
    if (value !== 50) {
      parts.push(`- ${s.leftLabel} ↔ ${s.rightLabel}: **${description}**`);
    }
  }

  if (parts.length === 0) return "";

  return `\n\n## User Context\nTailor all advice to this person's specific situation:\n${parts.join("\n")}`;
}

interface Props {
  councilId: string;
  answers: Record<string, string>;
  scaleValues: Record<string, number>;
  onAnswerChange: (questionId: string, value: string) => void;
  onScaleChange: (scaleId: string, value: number) => void;
}

export default function CouncilConfigurator({
  councilId,
  answers,
  scaleValues,
  onAnswerChange,
  onScaleChange,
}: Props) {
  const config = COUNCIL_CONFIGS[councilId];
  if (!config) return null;

  return (
    <div className="space-y-6">
      {/* Questions */}
      {config.questions.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="grid gap-4 sm:grid-cols-2">
            {config.questions.map((q) => (
              <div key={q.id}>
                <label className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400">{q.label}</label>
                <select
                  value={answers[q.id] || q.options[0].value}
                  onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {q.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scales */}
      {config.scales.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="mb-4 text-sm font-semibold text-zinc-600 uppercase tracking-wider dark:text-zinc-300">Preferences</h3>
          <div className="space-y-5">
            {config.scales.map((s) => (
              <div key={s.id}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{s.leftLabel}</span>
                  <span className="text-xs text-zinc-500">{s.rightLabel}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scaleValues[s.id] ?? s.defaultValue}
                  onChange={(e) => onScaleChange(s.id, parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-zinc-200 cursor-pointer dark:bg-zinc-700
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md dark:[&::-webkit-slider-thumb]:bg-white
                    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-900 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer dark:[&::-moz-range-thumb]:bg-white"
                />
                <p className="mt-1 text-center text-xs text-zinc-400 dark:text-zinc-600">
                  {(() => {
                    const v = scaleValues[s.id] ?? s.defaultValue;
                    if (v <= 20) return `Very ${s.leftLabel.toLowerCase()}`;
                    if (v <= 40) return `Leaning ${s.leftLabel.toLowerCase()}`;
                    if (v <= 60) return "Balanced";
                    if (v <= 80) return `Leaning ${s.rightLabel.toLowerCase()}`;
                    return `Very ${s.rightLabel.toLowerCase()}`;
                  })()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
