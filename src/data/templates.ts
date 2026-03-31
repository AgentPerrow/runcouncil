// Pre-built council templates for specific scenarios
export interface CouncilTemplate {
  id: string;
  title: string;
  question: string;
  emoji: string;
  category: string;
  memberIds: string[];
  context?: string;
}

export const templates: CouncilTemplate[] = [
  // Startup
  {
    id: "raise-or-bootstrap",
    title: "Should I raise or bootstrap?",
    question: "I'm building a startup and trying to decide whether to raise venture capital or bootstrap. Help me think through the trade-offs.",
    emoji: "💸",
    category: "Startup",
    memberIds: ["startup-cfo", "startup-vc", "startup-bootstrapper", "startup-ceo", "startup-da"],
  },
  {
    id: "price-my-saas",
    title: "How do I price my SaaS?",
    question: "I need to figure out pricing for my SaaS product. I want to maximize revenue without killing conversion.",
    emoji: "🏷️",
    category: "Startup",
    memberIds: ["startup-pricing", "startup-cfo", "startup-growth", "startup-da"],
  },
  {
    id: "cofounder-fit",
    title: "Is my co-founder the right fit?",
    question: "I'm having doubts about my co-founder. We disagree on direction and I'm not sure we're aligned long-term.",
    emoji: "🤝",
    category: "Startup",
    memberIds: ["startup-ceo", "startup-gc", "startup-da", "startup-hr"],
  },
  {
    id: "launch-strategy",
    title: "How do I launch this?",
    question: "My product is ready to launch. I need a go-to-market strategy that doesn't require a huge budget.",
    emoji: "🚀",
    category: "Startup",
    memberIds: ["startup-growth", "startup-community", "startup-cmo", "startup-da", "startup-data"],
  },

  // Career
  {
    id: "take-the-offer",
    title: "Should I take the job offer?",
    question: "I have a job offer on the table. It's more money but I'm not sure about the role, company, or long-term fit.",
    emoji: "📋",
    category: "Career",
    memberIds: ["career-coach", "career-salary", "career-recruiter", "career-da", "career-burnout"],
  },
  {
    id: "negotiate-salary",
    title: "How do I negotiate my salary?",
    question: "I want to negotiate a higher salary. I think I'm underpaid but I don't want to damage the relationship.",
    emoji: "💰",
    category: "Career",
    memberIds: ["career-salary", "career-coach", "career-recruiter", "career-da"],
  },
  {
    id: "quit-go-solo",
    title: "Should I quit and go solo?",
    question: "I'm thinking about leaving my job to start something on my own. I have some savings but no clear plan yet.",
    emoji: "🚪",
    category: "Career",
    memberIds: ["career-founder", "career-coach", "career-salary", "career-da", "career-burnout"],
  },
  {
    id: "career-pivot",
    title: "Should I change careers entirely?",
    question: "I'm considering a completely different career path. The pay might be lower but I think I'd be happier.",
    emoji: "🔄",
    category: "Career",
    memberIds: ["career-coach", "career-personal-brand", "career-da", "career-burnout", "career-mentor"],
  },

  // Health
  {
    id: "overtraining",
    title: "Am I overtraining?",
    question: "I've been training hard but my progress has stalled and I feel tired all the time. Should I pull back?",
    emoji: "😤",
    category: "Health",
    memberIds: ["health-sports-doc", "health-strength", "health-sleep", "health-mobility", "health-da"],
  },
  {
    id: "fix-sleep",
    title: "How do I fix my sleep?",
    question: "I can't fall asleep, wake up multiple times, and feel exhausted. I've tried melatonin and it's not enough.",
    emoji: "😴",
    category: "Health",
    memberIds: ["health-sleep", "health-therapist", "health-endocrinologist", "health-naturopath", "health-da"],
  },
  {
    id: "hormone-optimization",
    title: "Should I get my hormones checked?",
    question: "Low energy, brain fog, and my performance is declining. I'm wondering if it's hormonal.",
    emoji: "⚡",
    category: "Health",
    memberIds: ["health-endocrinologist", "health-sports-doc", "health-functional", "health-naturopath", "health-da"],
  },
  {
    id: "nutrition-overhaul",
    title: "How should I actually eat?",
    question: "I'm overwhelmed by conflicting nutrition advice. I want a sustainable approach that actually works.",
    emoji: "🥗",
    category: "Health",
    memberIds: ["health-nutritionist", "health-dietitian", "health-biohacker", "health-functional", "health-da"],
  },

  // Investment
  {
    id: "invest-100k",
    title: "How should I invest $100K?",
    question: "I have $100K to invest. I want growth but I'm not sure about my risk tolerance or timeline.",
    emoji: "💰",
    category: "Investment",
    memberIds: ["invest-bull", "invest-bear", "invest-tax", "invest-estate-planner", "invest-da"],
  },
  {
    id: "bitcoin-now",
    title: "Should I buy Bitcoin?",
    question: "I've been watching Bitcoin and I'm thinking about putting a significant amount in. Is this the right time?",
    emoji: "₿",
    category: "Investment",
    memberIds: ["invest-crypto", "invest-bear", "invest-bull", "invest-tax", "invest-da"],
  },
  {
    id: "rental-property",
    title: "Is this rental property worth it?",
    question: "I'm looking at buying an investment property. The numbers seem decent but I've never been a landlord.",
    emoji: "🏠",
    category: "Investment",
    memberIds: ["invest-real-estate", "invest-tax", "invest-bear", "invest-bull", "invest-da"],
  },

  // Life
  {
    id: "buy-or-rent",
    title: "Should we buy or rent?",
    question: "We're trying to decide whether to buy a home or keep renting. Housing prices are crazy but rent keeps going up.",
    emoji: "🏡",
    category: "Life",
    memberIds: ["life-financial-planner", "life-relationships", "life-philosopher", "life-da", "life-minimalist"],
  },
  {
    id: "move-cities",
    title: "Should I move to a new city?",
    question: "I'm considering relocating. Better opportunities but I'd be leaving my network and support system behind.",
    emoji: "✈️",
    category: "Life",
    memberIds: ["life-philosopher", "life-relationships", "life-financial-planner", "life-da", "life-minimalist"],
  },
  {
    id: "hard-conversation",
    title: "How do I have the hard conversation?",
    question: "I need to have a difficult conversation with someone important to me. I've been avoiding it and it's getting worse.",
    emoji: "💬",
    category: "Life",
    memberIds: ["life-relationships", "life-philosopher", "life-spiritual", "life-da"],
  },

  // Parenting
  {
    id: "screen-time",
    title: "How do I handle screen time?",
    question: "My kids want more screen time and I'm not sure what's reasonable. I don't want to be the bad guy but I'm worried.",
    emoji: "📱",
    category: "Parenting",
    memberIds: ["parenting-dev-psych", "parenting-teen", "parenting-behavioral", "parenting-da"],
  },
  {
    id: "school-choice",
    title: "Which school is right for my kid?",
    question: "We're choosing between public, private, and alternative schools. Budget is a factor but so is fit.",
    emoji: "🏫",
    category: "Parenting",
    memberIds: ["parenting-montessori", "parenting-dev-psych", "parenting-da", "parenting-pediatrician"],
  },
];

// Get unique categories
export const templateCategories = [...new Set(templates.map(t => t.category))];
