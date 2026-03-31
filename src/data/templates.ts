// Pre-built council templates for ongoing advisory scenarios
export interface CouncilTemplate {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: string;
  memberIds: string[];
}

export const templates: CouncilTemplate[] = [
  // Startup
  {
    id: "funding-strategy",
    title: "Funding Strategy",
    description: "Navigate fundraising, bootstrap decisions, investor relations, and capital allocation as you grow.",
    emoji: "💸",
    category: "Startup",
    memberIds: ["startup-cfo", "startup-vc", "startup-bootstrapper", "startup-ceo", "startup-da"],
  },
  {
    id: "go-to-market",
    title: "Go-to-Market",
    description: "Launch strategy, positioning, pricing, channels, and early traction. Your ongoing growth war room.",
    emoji: "🚀",
    category: "Startup",
    memberIds: ["startup-growth", "startup-community", "startup-cmo", "startup-pricing", "startup-da"],
  },
  {
    id: "product-leadership",
    title: "Product Leadership",
    description: "Roadmap prioritization, user research, technical architecture, and shipping cadence.",
    emoji: "🛠️",
    category: "Startup",
    memberIds: ["startup-ceo", "startup-cto", "startup-growth", "startup-data", "startup-da"],
  },
  {
    id: "ai-product",
    title: "AI Product Strategy",
    description: "Where AI fits in your product, build vs buy, model selection, and staying ahead of the curve.",
    emoji: "🤖",
    category: "Startup",
    memberIds: ["startup-ai-strategist", "startup-cto", "startup-ceo", "startup-data", "startup-da"],
  },

  // Career — Featured
  {
    id: "severance-negotiation",
    title: "Severance Negotiation Council",
    description: "Five specialists who review your severance package, find leverage, and help you walk away with what you deserve.",
    emoji: "⚖️",
    category: "Career",
    memberIds: ["career-employment-lawyer", "career-negotiation-strategist", "career-financial-advisor", "career-transition-coach", "career-da"],
  },
  {
    id: "career-growth",
    title: "Career Acceleration",
    description: "Promotions, visibility, skill gaps, and strategic moves to get where you want to be.",
    emoji: "📈",
    category: "Career",
    memberIds: ["career-coach", "career-personal-brand", "career-mentor", "career-recruiter", "career-da"],
  },
  {
    id: "compensation",
    title: "Compensation & Negotiation",
    description: "Salary benchmarking, equity packages, offer evaluation, and knowing your leverage.",
    emoji: "💰",
    category: "Career",
    memberIds: ["career-salary", "career-coach", "career-recruiter", "career-da"],
  },
  {
    id: "founder-transition",
    title: "Employee → Founder",
    description: "Planning the leap, building on the side, financial runway, and making the call.",
    emoji: "🚪",
    category: "Career",
    memberIds: ["career-founder", "career-coach", "career-salary", "career-burnout", "career-da"],
  },
  {
    id: "sustainable-performance",
    title: "Sustainable Performance",
    description: "High output without burning out. Boundaries, energy management, and career longevity.",
    emoji: "🔋",
    category: "Career",
    memberIds: ["career-burnout", "career-coach", "career-remote", "career-da"],
  },

  // Health
  {
    id: "training-optimization",
    title: "Training & Performance",
    description: "Programming, recovery, progressive overload, and getting past plateaus.",
    emoji: "💪",
    category: "Health",
    memberIds: ["health-sports-doc", "health-strength", "health-mobility", "health-nutritionist", "health-da"],
  },
  {
    id: "sleep-recovery",
    title: "Sleep & Recovery",
    description: "Sleep quality, recovery protocols, stress management, and actually feeling rested.",
    emoji: "😴",
    category: "Health",
    memberIds: ["health-sleep", "health-therapist", "health-endocrinologist", "health-naturopath", "health-da"],
  },
  {
    id: "hormone-health",
    title: "Hormone Optimization",
    description: "Energy, performance, labs, and getting your hormones dialed in.",
    emoji: "⚡",
    category: "Health",
    memberIds: ["health-endocrinologist", "health-sports-doc", "health-functional", "health-biohacker", "health-da"],
  },
  {
    id: "nutrition-strategy",
    title: "Nutrition Strategy",
    description: "Meal planning, macros, supplements, and cutting through the noise.",
    emoji: "🥗",
    category: "Health",
    memberIds: ["health-nutritionist", "health-dietitian", "health-biohacker", "health-functional", "health-da"],
  },
  {
    id: "mental-wellness",
    title: "Mental Wellness",
    description: "Stress, anxiety, cognitive performance, and building resilience that lasts.",
    emoji: "🧠",
    category: "Health",
    memberIds: ["health-therapist", "health-sleep", "health-sports-psych", "health-naturopath", "health-da"],
  },

  // Investment
  {
    id: "portfolio-management",
    title: "Portfolio Management",
    description: "Asset allocation, rebalancing, risk management, and long-term wealth building.",
    emoji: "📊",
    category: "Investment",
    memberIds: ["invest-bull", "invest-bear", "invest-tax", "invest-estate-planner", "invest-da"],
  },
  {
    id: "crypto-strategy",
    title: "Digital Assets",
    description: "Bitcoin, ETH, DeFi, regulation, and position sizing in a volatile asset class.",
    emoji: "₿",
    category: "Investment",
    memberIds: ["invest-crypto", "invest-bear", "invest-bull", "invest-tax", "invest-da"],
  },
  {
    id: "real-estate-investing",
    title: "Real Estate Investing",
    description: "Rental properties, REITs, deal analysis, leverage, and building a property portfolio.",
    emoji: "🏠",
    category: "Investment",
    memberIds: ["invest-real-estate", "invest-tax", "invest-bear", "invest-bull", "invest-da"],
  },
  {
    id: "wealth-planning",
    title: "Wealth & Estate Planning",
    description: "Tax strategy, trusts, wealth transfer, and making sure your money outlasts you.",
    emoji: "📜",
    category: "Investment",
    memberIds: ["invest-estate-planner", "invest-tax", "invest-angel", "invest-da"],
  },

  // Startup — Featured
  {
    id: "fundraising-war-room",
    title: "Startup Fundraising War Room",
    description: "Your fundraising brain trust — from pitch polish to cap table modeling to knowing what VCs actually think when they say 'interesting.'",
    emoji: "🎯",
    category: "Startup",
    memberIds: ["startup-ceo", "startup-vc", "startup-financial-modeler", "startup-pitch-coach", "startup-da"],
  },

  // Life — Featured
  {
    id: "first-time-homebuyer",
    title: "First-Time Homebuyer Advisory Board",
    description: "A lawyer, a mortgage advisor, an inspector, and a financial planner walk through your first home purchase — so you don't get wrecked.",
    emoji: "🏡",
    category: "Life",
    memberIds: ["life-real-estate-lawyer", "life-mortgage-advisor", "life-home-inspector", "life-financial-planner", "life-da"],
  },

  // Life
  {
    id: "major-life-decisions",
    title: "Major Life Decisions",
    description: "Moving, buying a house, changing direction. The big calls that don't have undo buttons.",
    emoji: "🔮",
    category: "Life",
    memberIds: ["life-philosopher", "life-financial-planner", "life-relationships", "life-da", "life-minimalist"],
  },
  {
    id: "relationship-navigation",
    title: "Relationship Navigation",
    description: "Communication, conflict, boundaries, and building stronger connections.",
    emoji: "💕",
    category: "Life",
    memberIds: ["life-relationships", "life-philosopher", "life-spiritual", "life-da"],
  },
  {
    id: "life-design",
    title: "Life Design",
    description: "Intentional living. Cutting noise, aligning choices with values, building the life you actually want.",
    emoji: "🪴",
    category: "Life",
    memberIds: ["life-minimalist", "life-philosopher", "life-financial-planner", "life-spiritual", "life-da"],
  },

  // Parenting
  {
    id: "early-childhood",
    title: "Early Childhood Development",
    description: "Ages 0-6. Learning, independence, behavior, and building a strong foundation.",
    emoji: "🌱",
    category: "Parenting",
    memberIds: ["parenting-montessori", "parenting-dev-psych", "parenting-nutrition", "parenting-pediatrician", "parenting-da"],
  },
  {
    id: "teens-tweens",
    title: "Navigating Teens & Tweens",
    description: "Screens, independence, social dynamics, and keeping the connection alive.",
    emoji: "🎒",
    category: "Parenting",
    memberIds: ["parenting-teen", "parenting-dev-psych", "parenting-behavioral", "parenting-da"],
  },
  {
    id: "co-parenting",
    title: "Co-Parenting",
    description: "Shared custody, communication, consistency across two homes, and putting kids first.",
    emoji: "⚖️",
    category: "Parenting",
    memberIds: ["parenting-coparent", "parenting-dev-psych", "parenting-behavioral", "parenting-da"],
  },

  // Creative
  {
    id: "brand-building",
    title: "Brand Building",
    description: "Identity, voice, visual direction, and building something people actually feel.",
    emoji: "🎨",
    category: "Creative",
    memberIds: ["creative-copywriter", "creative-photographer", "creative-content", "creative-ux", "creative-da"],
  },
  {
    id: "content-engine",
    title: "Content Engine",
    description: "What to create, where to publish, how to distribute. Content as a growth system.",
    emoji: "📝",
    category: "Creative",
    memberIds: ["creative-content", "creative-copywriter", "creative-photographer", "creative-da"],
  },
];

// Get unique categories
export const templateCategories = [...new Set(templates.map(t => t.category))];
