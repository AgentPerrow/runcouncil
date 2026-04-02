import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request an Expert — RunCouncil",
  description:
    "Can't find the advisor you need? Request a hyper-specific expert and the community votes. Top requests become real council members.",
  openGraph: {
    title: "Request an Expert — RunCouncil",
    description:
      "Request the exact niche expert you need. Community votes, top requests get built.",
  },
};

export default function RequestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
