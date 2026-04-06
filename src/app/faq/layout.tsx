import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — RunCouncil",
  description:
    "Common questions about RunCouncil.",
  alternates: {
    canonical: "https://www.runcouncil.com/faq",
  },
  openGraph: {
    title: "FAQ — RunCouncil",
    description:
      "Everything you need to know about building your AI advisory council.",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is RunCouncil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RunCouncil lets you build a custom AI advisory council — a group of specialized AI advisors who debate your decisions from different angles. Pick your advisors, customize them to your situation, and copy the prompt into ChatGPT, Claude, Gemini, or any AI tool you use.",
      },
    },
    {
      "@type": "Question",
      name: "How does RunCouncil work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pick a council type (startup, health, career, etc.), answer a few questions about your situation, then choose your advisors. RunCouncil generates a detailed system prompt that turns your AI into a multi-perspective advisory board. Copy it, paste it into your AI tool, and start asking questions.",
      },
    },
    {
      "@type": "Question",
      name: "Which AI tools does RunCouncil work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any AI tool that accepts a system prompt or custom instructions. ChatGPT, Claude, Gemini, Copilot, Perplexity, Grok — if you can paste text into it, it works.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. No signup, no login, no email required. Just pick your council, copy the prompt, and go.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from just asking ChatGPT a question?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "When you ask one AI one question, you get one perspective. RunCouncil gives you 4-8 specialized advisors who each respond from their domain — a CFO thinks about money, a lawyer thinks about risk, a Devil's Advocate pokes holes in everything. You get structured disagreement instead of a single answer.",
      },
    },
    {
      "@type": "Question",
      name: "How many advisors should I use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2-3 for quick, low-stakes decisions. 4-5 for meaningful ones. 6+ for major, irreversible, or high-stakes decisions. More advisors means more perspectives but longer responses.",
      },
    },
  ],
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      {children}
    </>
  );
}
