// Prompt modifiers — transform member prompts based on configurator answers
// This is the brain that makes the configurator actually DO something

interface ConfigState {
  answers: Record<string, string>;
  scales: Record<string, number>;
}

// ═══════════════════════════════════════════════════════
// PER-MEMBER PROMPT INJECTIONS
// ═══════════════════════════════════════════════════════

// Maps: councilId → memberId → (configState) → additional prompt text
// These get INJECTED into the member's prompt, not appended as a footnote

type PromptModifier = (config: ConfigState) => string;

const startupModifiers: Record<string, PromptModifier> = {
  "startup-cfo": (config) => {
    const parts: string[] = [];
    const industry = config.answers.industry;
    const stage = config.answers.stage;
    const funding = config.answers.funding;
    const risk = config.scales.risk ?? 50;

    if (industry === "saas") {
      parts.push("Think in terms of ARR, MRR, churn rate, LTV/CAC ratio, and net revenue retention. SaaS metrics are your native language.");
    } else if (industry === "dtc") {
      parts.push("Think in terms of COGS, contribution margin, AOV, repeat purchase rate, and customer acquisition cost. DTC unit economics are your focus.");
    } else if (industry === "marketplace") {
      parts.push("Think in terms of take rate, GMV, liquidity, supply/demand balance, and marketplace unit economics.");
    } else if (industry === "fintech") {
      parts.push("Think in terms of regulatory capital requirements, compliance costs, interchange revenue, and fintech-specific burn patterns.");
    } else if (industry === "ai") {
      parts.push("Think in terms of compute costs, GPU spend, API pricing models, training vs inference economics, and AI-specific infrastructure costs.");
    }

    if (stage === "idea" || stage === "building") {
      parts.push("They're pre-revenue. Focus on runway, burn rate, and how long they can survive. Don't ask for metrics they don't have yet — help them figure out what to track first.");
    } else if (stage === "early-revenue") {
      parts.push("They have early revenue. Focus on unit economics — is each customer profitable? What's the path to break-even? Where is money leaking?");
    } else if (stage === "scaling") {
      parts.push("They're scaling. Focus on operating leverage, margin expansion, and whether growth is profitable or just expensive. Challenge them on CAC payback period.");
    } else if (stage === "profitable") {
      parts.push("They're profitable. Focus on capital allocation — reinvest vs distribute? Where's the highest-ROI dollar? Are they optimizing or coasting?");
    }

    if (funding === "bootstrapped" || funding === "revenue-funded") {
      parts.push("They're not raising. Every dollar matters. Think cash flow first, growth second. Profitability is not optional — it's survival.");
    } else if (funding === "pre-seed" || funding === "seed") {
      parts.push("They're raising early-stage. Help them think about dilution, valuation benchmarks, and how much to raise (enough runway to hit the next milestone, no more).");
    } else if (funding === "series-a") {
      parts.push("They're raising Series A+. Focus on growth metrics that matter to institutional investors — ARR growth rate, magic number, burn multiple.");
    }

    if (risk <= 25) {
      parts.push("Be conservative in your financial recommendations. Prioritize cash preservation, longer runway, and profitability over aggressive growth.");
    } else if (risk >= 75) {
      parts.push("Be aggressive in your financial recommendations. They want to move fast — help them think about bold capital allocation, even if it burns cash in the short term.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },

  "startup-cmo": (config) => {
    const parts: string[] = [];
    const industry = config.answers.industry;
    const stage = config.answers.stage;
    const focus = config.scales.focus ?? 50;

    if (industry === "saas") {
      parts.push("Focus on product-led growth, content marketing, SEO, and demand gen. SaaS distribution is your specialty — think free trials, freemium, and activation funnels.");
    } else if (industry === "dtc") {
      parts.push("Focus on paid social, influencer marketing, email/SMS flows, and brand storytelling. DTC is a brand game — help them build one that commands premium pricing.");
    } else if (industry === "marketplace") {
      parts.push("Focus on solving the chicken-and-egg problem. Which side do you subsidize? How do you create liquidity in one market before expanding?");
    } else if (industry === "creator") {
      parts.push("Focus on audience building, platform strategy, and community-led growth. The creator economy runs on authenticity and direct relationships.");
    }

    if (stage === "idea" || stage === "building") {
      parts.push("They're pre-launch. Focus on audience building before the product exists. Landing pages, waitlists, content that validates demand. Don't talk about scaling channels they haven't started.");
    } else if (stage === "pre-revenue" || stage === "early-revenue") {
      parts.push("They're early. Focus on finding one channel that works before diversifying. Help them identify their highest-leverage distribution move.");
    } else if (stage === "scaling") {
      parts.push("They're scaling. Focus on channel diversification, reducing CAC dependency on any single channel, and building brand as a long-term moat.");
    }

    if (focus <= 25) {
      parts.push("They're product-first. Emphasize product-led growth, word of mouth, and organic discovery. Marketing should amplify a great product, not compensate for a mediocre one.");
    } else if (focus >= 75) {
      parts.push("They're distribution-first. Help them build distribution before the product is perfect. Better to have an audience waiting than a product nobody knows about.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },

  "startup-cto": (config) => {
    const parts: string[] = [];
    const industry = config.answers.industry;
    const stage = config.answers.stage;
    const team = config.answers.team;
    const speed = config.scales.speed ?? 50;

    if (industry === "saas") {
      parts.push("Think about multi-tenancy, API design, integrations, and platform scalability. SaaS architecture decisions made early compound for years.");
    } else if (industry === "ai") {
      parts.push("Think about model selection, inference costs, fine-tuning vs prompting, GPU infrastructure, and the build vs buy decision for AI capabilities.");
    } else if (industry === "fintech") {
      parts.push("Think about compliance infrastructure, audit trails, encryption, PCI/SOC2, and the regulatory burden on every technical decision.");
    } else if (industry === "hardware") {
      parts.push("Think about firmware, IoT connectivity, manufacturing constraints on software design, and the unique challenges of hardware-software integration.");
    }

    if (stage === "idea" || stage === "building") {
      parts.push("They're building the MVP. Simplicity is king. Recommend the most boring, proven stack. No microservices, no Kubernetes — monolith first, optimize later.");
    } else if (stage === "scaling") {
      parts.push("They're scaling. Now is when architecture debt hurts. Help them identify the 2-3 technical investments that unlock the next 10x of growth without a rewrite.");
    }

    if (team === "solo") {
      parts.push("They're solo. Recommend tools and frameworks that minimize operational overhead. No-ops, managed services, and anything that lets one person do the work of five.");
    }

    if (speed <= 25) {
      parts.push("They want to build it right. Emphasize test coverage, code quality, documentation, and architecture decisions they won't regret in 2 years.");
    } else if (speed >= 75) {
      parts.push("They want to ship fast. Emphasize speed over perfection. Suggest the fastest path to production — cut corners intentionally, document the debt, and plan to fix it later.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },

  "startup-ceo": (config) => {
    const parts: string[] = [];
    const stage = config.answers.stage;
    const funding = config.answers.funding;
    const risk = config.scales.risk ?? 50;

    if (stage === "idea" || stage === "building") {
      parts.push("They're at the earliest stage. Focus on validation — are they solving a real problem? Help them avoid building something nobody wants. The most important decision right now is what NOT to build.");
    } else if (stage === "early-revenue") {
      parts.push("They have early traction. Focus on whether this is a real business or a side project. Help them decide: double down, pivot, or kill it. The data is ambiguous at this stage — help them read the signals.");
    } else if (stage === "scaling") {
      parts.push("They're scaling. Focus on organizational design, hiring priorities, and strategic positioning. The founder's job is shifting from builder to leader — help them navigate that transition.");
    }

    if (funding === "bootstrapped") {
      parts.push("They're bootstrapped by choice. Respect that. Don't push fundraising unless the math demands it. Help them think about sustainable growth and optionality.");
    }

    if (risk <= 25) {
      parts.push("Be measured. They want careful, deliberate moves. Emphasize reversible decisions and staged commitment.");
    } else if (risk >= 75) {
      parts.push("Be bold. They want to swing big. Help them identify asymmetric bets and move decisively. Caution is the bigger risk here.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },

  "startup-gc": (config) => {
    const parts: string[] = [];
    const industry = config.answers.industry;
    const stage = config.answers.stage;
    const funding = config.answers.funding;

    if (industry === "fintech") {
      parts.push("Fintech is a regulatory minefield. Prioritize licensing requirements, money transmission laws, KYC/AML obligations, and the compliance burden before they write a line of code.");
    } else if (industry === "healthtech") {
      parts.push("Healthcare has HIPAA, FDA, and patient data considerations. Assess regulatory exposure early — compliance failures in healthtech can be company-ending.");
    } else if (industry === "ai") {
      parts.push("AI has emerging regulatory requirements — EU AI Act, data privacy, model bias liability. Help them build responsibly while regulations are still forming.");
    }

    if (stage === "idea" || stage === "building") {
      parts.push("They're early. Focus on incorporation, founder agreements, and IP assignment. Don't overwhelm them with compliance they don't need yet — but flag what's coming.");
    } else if (funding === "pre-seed" || funding === "seed" || funding === "series-a") {
      parts.push("They're fundraising. Focus on cap table cleanliness, SAFE vs priced round implications, investor rights, and terms they should never agree to.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },
};

const healthModifiers: Record<string, PromptModifier> = {
  "health-sports-med": (config) => {
    const parts: string[] = [];
    const goal = config.answers.goal;
    const intensity = config.scales.intensity ?? 50;

    if (goal === "fatloss") {
      parts.push("Their primary goal is fat loss. Focus on safe caloric deficit strategies, injury prevention during increased activity, and realistic body composition timelines.");
    } else if (goal === "muscle" || goal === "strength") {
      parts.push("Their goal is building muscle/strength. Focus on progressive overload safety, joint health, recovery protocols, and when soreness is productive vs problematic.");
    } else if (goal === "longevity") {
      parts.push("Their goal is longevity. Focus on injury prevention, joint preservation, cardiovascular health markers, and sustainable movement patterns that compound over decades.");
    } else if (goal === "recovery") {
      parts.push("They're recovering from injury. Be conservative. Focus on rehabilitation protocols, return-to-activity criteria, and preventing re-injury. Speed of recovery matters less than quality of recovery.");
    }

    if (intensity >= 75) {
      parts.push("They want to be pushed hard. Support aggressive training but flag injury risks clearly. High intensity is fine — recklessness isn't.");
    } else if (intensity <= 25) {
      parts.push("They want sustainable and easy. Focus on habit formation and consistency over intensity. The best workout is the one they'll actually do for years.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },

  "health-nutrition": (config) => {
    const parts: string[] = [];
    const goal = config.answers.goal;
    const approach = config.scales.approach ?? 65;
    const timeframe = config.scales.timeframe ?? 40;

    if (goal === "fatloss") {
      parts.push("Goal is fat loss. Focus on sustainable caloric deficit, protein adequacy (1g/lb target), and meal timing that supports adherence. Crash diets are forbidden — they always backfire.");
    } else if (goal === "muscle") {
      parts.push("Goal is muscle building. Focus on caloric surplus (200-500 over maintenance), protein timing around training, and progressive nutrition periodization.");
    } else if (goal === "longevity") {
      parts.push("Goal is longevity. Focus on anti-inflammatory eating patterns, micronutrient density, gut health, and the evidence behind caloric restriction, fasting, and Mediterranean patterns.");
    } else if (goal === "mental") {
      parts.push("Goal is mental health. Focus on the gut-brain axis, omega-3s, B-vitamins, magnesium, and the relationship between blood sugar stability and mood.");
    }

    if (approach <= 25) {
      parts.push("They prefer natural/holistic approaches. Emphasize whole foods, traditional diets, and ancestral eating patterns. Minimize supplement recommendations unless clearly necessary.");
    } else if (approach >= 75) {
      parts.push("They want data-driven nutrition. Recommend specific macros, micronutrient targets, blood work to track, and evidence-based supplementation. Numbers, not feelings.");
    }

    if (timeframe >= 75) {
      parts.push("They want fast results. Be honest about what's achievable quickly without being destructive. Aggressive but safe short-term protocols are OK if they transition to sustainable habits.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },

  "health-strength": (config) => {
    const parts: string[] = [];
    const goal = config.answers.goal;
    const experience = config.answers.experience;
    const intensity = config.scales.intensity ?? 50;

    if (goal === "fatloss") {
      parts.push("Goal is fat loss. Program for muscle preservation during a deficit. Higher volume, moderate intensity, compound movements. Don't let them skip strength training for cardio.");
    } else if (goal === "strength") {
      parts.push("Goal is raw strength. Program around the big lifts — squat, bench, deadlift, press. Progressive overload is law. Periodize properly.");
    } else if (goal === "athletic") {
      parts.push("Goal is athletic performance. Blend strength with power, speed, and sport-specific conditioning. Periodize around their competition/season schedule.");
    }

    if (experience === "beginner") {
      parts.push("They're a beginner. Simple linear progression, focus on form mastery, full-body 3x/week. Don't overcomplicate it. The goal is building the habit and learning movement patterns.");
    } else if (experience === "advanced") {
      parts.push("They're advanced. They need periodization, deload protocols, weak point analysis, and specialty movements. The easy gains are gone — be specific about programming.");
    } else if (experience === "returning") {
      parts.push("They're returning after a break. Muscle memory is real — they'll bounce back faster than they think. Start at 50-60% of previous numbers and ramp over 4-6 weeks.");
    }

    if (intensity >= 75) {
      parts.push("Push them. RPE 8-9, heavy compounds, aggressive progression. They can handle it and they want to be challenged.");
    } else if (intensity <= 25) {
      parts.push("Keep it sustainable. RPE 6-7, focus on volume and consistency over max effort. They're in it for the long haul.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },

  "health-sleep": (config) => {
    const parts: string[] = [];
    const goal = config.answers.goal;
    const time = config.answers.time;

    if (goal === "athletic" || goal === "muscle" || goal === "strength") {
      parts.push("They're training hard. Sleep is where gains happen. Emphasize 7-9 hours, sleep timing around training, and the relationship between sleep debt and performance decline.");
    } else if (goal === "mental") {
      parts.push("Mental health is the focus. Sleep is the foundation. Address sleep anxiety, racing thoughts, circadian rhythm alignment, and the bidirectional relationship between sleep and mood.");
    } else if (goal === "longevity") {
      parts.push("Longevity focus. Deep sleep and REM are the metrics that matter most. Glymphatic clearance, HRV during sleep, and the long-term effects of chronic sleep deprivation on healthspan.");
    }

    if (time === "serious") {
      parts.push("They train 10+ hours/week. Recovery demands are high. Napping strategy, sleep extension before competition, and managing the stimulant-sleep trade-off.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },
};

const careerModifiers: Record<string, PromptModifier> = {
  "career-strategist": (config) => {
    const parts: string[] = [];
    const situation = config.answers.situation;
    const level = config.answers.level;
    const risk = config.scales.risk ?? 50;

    if (situation === "offer") {
      parts.push("They have an offer on the table. Help them evaluate it holistically — comp, growth, culture, manager quality, and strategic career positioning. The best offer isn't always the highest number.");
    } else if (situation === "pivot") {
      parts.push("They're considering a career pivot. Help them assess transferable skills, the credibility gap, realistic timeline to regain their current income, and whether this is desire or escapism.");
    } else if (situation === "leaving") {
      parts.push("They want to leave. Help them distinguish between a bad job and a bad moment. If they should leave, help them time it right and leave from a position of strength.");
    } else if (situation === "freelance") {
      parts.push("They're considering freelance/independent. Help them assess financial readiness (6+ months expenses), pipeline development, pricing strategy, and the emotional reality of working alone.");
    }

    if (level === "executive" || level === "founder") {
      parts.push("They're senior. At this level, moves are strategic, not tactical. Think about legacy, equity, board dynamics, and the 5-year arc, not just the next role.");
    } else if (level === "early") {
      parts.push("They're early career. Optimize for learning rate and slope of trajectory, not current compensation. The right environment matters more than the right title.");
    }

    if (risk <= 25) {
      parts.push("They value stability. Respect that. Not everyone needs to take big swings. Help them grow within their comfort zone while gently expanding it.");
    } else if (risk >= 75) {
      parts.push("They want to bet on themselves. Encourage bold moves but make sure they're calculated, not reckless. Help them find asymmetric career bets.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },

  "career-negotiator": (config) => {
    const parts: string[] = [];
    const situation = config.answers.situation;
    const level = config.answers.level;
    const priority = config.scales.priority ?? 50;

    if (situation === "offer" || situation === "negotiating") {
      parts.push("Active negotiation. Focus on specific tactics — anchoring, BATNA, package negotiation (not just base), and exact scripts for common negotiation scenarios.");
    } else if (situation === "promotion") {
      parts.push("Going for a promotion. Help them build the case before the conversation — quantified impact, market comps, and timing the ask around budget cycles.");
    }

    if (level === "executive") {
      parts.push("Executive-level negotiation. Think about equity, severance, acceleration, board seats, title, and the non-monetary terms that matter more than base salary at this level.");
    }

    if (priority <= 25) {
      parts.push("Work-life balance is the priority. Help them negotiate flexibility, remote work, PTO, and boundaries — not just money. These are worth more than a 10% raise.");
    } else if (priority >= 75) {
      parts.push("Maximum income is the goal. Be aggressive. Help them push for top-of-market comp, equity upside, and performance bonuses. Leave nothing on the table.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },
};

const investmentModifiers: Record<string, PromptModifier> = {
  "invest-strategist": (config) => {
    const parts: string[] = [];
    const focus = config.answers.focus;
    const amount = config.answers.amount;
    const horizon = config.answers.horizon;
    const risk = config.scales.risk ?? 50;

    if (focus === "crypto") {
      parts.push("Crypto focus. Think about portfolio allocation limits (max 5-10% for most people), custody solutions, tax implications of trading, and the difference between investing and speculating.");
    } else if (focus === "real-estate") {
      parts.push("Real estate focus. Think about leverage strategy, geographic diversification, the REIT vs direct ownership trade-off, and how real estate fits the overall portfolio.");
    } else if (focus === "private") {
      parts.push("Private equity / startup focus. Think about illiquidity premium, J-curve, vintage year diversification, and the realistic hit rate for angel investments.");
    }

    if (amount === "small") {
      parts.push("Small portfolio (<$50K). Focus on low-cost index funds, automated investing, and building the savings habit. Complexity is the enemy at this stage.");
    } else if (amount === "hnw") {
      parts.push("High net worth ($5M+). Think about asset location optimization, alternative investments, estate planning implications, and tax-loss harvesting at scale.");
    }

    if (horizon === "short") {
      parts.push("Short time horizon (<2 years). Capital preservation is priority one. Stocks are gambling at this horizon. Think high-yield savings, T-bills, short-duration bonds.");
    } else if (horizon === "long") {
      parts.push("Long time horizon (10+ years). Volatility is your friend. Maximize equity exposure, consider small-cap tilt, and don't touch it. Time in market > timing the market.");
    }

    if (risk <= 25) {
      parts.push("Very conservative. Prioritize capital preservation. Bonds, dividend aristocrats, and sleeping well at night. Missing upside is better than losing principal.");
    } else if (risk >= 75) {
      parts.push("Very aggressive. They can handle volatility. Concentrated positions, growth stocks, leveraged strategies are on the table if the math works.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },

  "invest-tax": (config) => {
    const parts: string[] = [];
    const amount = config.answers.amount;
    const horizon = config.answers.horizon;

    if (amount === "large" || amount === "hnw") {
      parts.push("Large portfolio. Tax optimization is a major alpha source at this level. Focus on asset location (tax-advantaged vs taxable), tax-loss harvesting, charitable giving vehicles, and Roth conversion ladders.");
    }

    if (horizon === "retirement") {
      parts.push("Retirement planning. Think about withdrawal sequencing, required minimum distributions, Social Security timing, and the tax bracket management game during the accumulation-to-decumulation transition.");
    }

    return parts.length > 0 ? `\n\n## Situational Context\n${parts.join(" ")}` : "";
  },
};

// ═══════════════════════════════════════════════════════
// MEMBER RECOMMENDATIONS BASED ON CONFIG
// ═══════════════════════════════════════════════════════

// Returns member IDs that should be auto-added based on config answers
export function getRecommendedMembers(councilId: string, config: ConfigState): string[] {
  const recs: string[] = [];

  if (councilId === "startup") {
    if (config.answers.industry === "saas") {
      recs.push("startup-data", "startup-cs", "startup-pricing");
    } else if (config.answers.industry === "dtc" || config.answers.industry === "hardware") {
      recs.push("startup-supply-chain", "startup-pricing");
    } else if (config.answers.industry === "ai") {
      recs.push("startup-data", "startup-security");
    } else if (config.answers.industry === "fintech") {
      recs.push("startup-security", "startup-gc");
    }

    if (config.answers.funding === "pre-seed" || config.answers.funding === "seed" || config.answers.funding === "series-a") {
      recs.push("startup-ir");
    }
    if (config.answers.funding === "bootstrapped" || config.answers.funding === "revenue-funded") {
      recs.push("startup-bootstrapper");
    }

    if (config.answers.stage === "scaling") {
      recs.push("startup-cs", "startup-content");
    }
  }

  if (councilId === "health") {
    if (config.answers.goal === "fatloss") {
      recs.push("health-dietitian", "health-addiction");
    } else if (config.answers.goal === "muscle" || config.answers.goal === "strength") {
      recs.push("health-ortho");
    } else if (config.answers.goal === "longevity") {
      recs.push("health-longevity", "health-cardio", "health-gut");
    } else if (config.answers.goal === "recovery") {
      recs.push("health-ortho", "health-physio");
    } else if (config.answers.goal === "mental") {
      recs.push("health-psych", "health-sports-psych");
    }

    const approach = config.scales.approach ?? 65;
    if (approach >= 75) {
      recs.push("health-biohacker");
    } else if (approach <= 25) {
      recs.push("health-naturopath");
    }
  }

  if (councilId === "investment") {
    if (config.answers.focus === "crypto") {
      recs.push("invest-crypto");
    } else if (config.answers.focus === "real-estate") {
      recs.push("invest-realestate");
    } else if (config.answers.focus === "private") {
      recs.push("invest-vc");
    }

    if (config.answers.amount === "hnw" || config.answers.amount === "large") {
      recs.push("invest-estate", "invest-tax");
    }

    const active = config.scales.active ?? 40;
    if (active >= 75) {
      recs.push("invest-options");
    } else if (active <= 25) {
      recs.push("invest-dividend");
    }
  }

  if (councilId === "career") {
    if (config.answers.situation === "offer" || config.answers.situation === "negotiating") {
      recs.push("career-salary", "career-negotiator");
    } else if (config.answers.situation === "freelance") {
      recs.push("career-side-hustle");
    } else if (config.answers.situation === "leaving") {
      recs.push("career-burnout");
    }

    if (config.answers.level === "executive" || config.answers.level === "founder") {
      recs.push("career-executive-coach");
    }
  }

  // Deduplicate
  return [...new Set(recs)];
}

// ═══════════════════════════════════════════════════════
// MAIN EXPORT — Apply modifiers to a member's prompt
// ═══════════════════════════════════════════════════════

const allModifiers: Record<string, Record<string, PromptModifier>> = {
  startup: startupModifiers,
  health: healthModifiers,
  career: careerModifiers,
  investment: investmentModifiers,
};

export function applyPromptModifiers(
  councilId: string,
  member: { id: string; prompt: string },
  config: ConfigState
): string {
  const councilMods = allModifiers[councilId];
  if (!councilMods) {
    // Fall back to generic context for councils without specific modifiers
    return member.prompt + generateGenericContext(councilId, config);
  }

  const modifier = councilMods[member.id];
  if (modifier) {
    return member.prompt + modifier(config);
  }

  // Member doesn't have a specific modifier — apply generic context
  return member.prompt + generateGenericContext(councilId, config);
}

// Generic context for members without specific modifiers
function generateGenericContext(councilId: string, config: ConfigState): string {
  const parts: string[] = [];

  // Build context from answers
  for (const [key, value] of Object.entries(config.answers)) {
    if (value && value !== "general" && value !== "undecided") {
      parts.push(`- ${key}: ${value}`);
    }
  }

  // Build context from scales
  for (const [key, value] of Object.entries(config.scales)) {
    if (value !== undefined && value !== 50) {
      const direction = value < 50 ? "left-leaning" : "right-leaning";
      const intensity = Math.abs(value - 50) > 25 ? "strongly" : "slightly";
      parts.push(`- ${key} preference: ${intensity} ${direction} (${value}/100)`);
    }
  }

  if (parts.length === 0) return "";
  return `\n\n## User Context\nTailor your advice to this person's situation:\n${parts.join("\n")}`;
}
