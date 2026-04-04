import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide — RunCouncil",
  description:
    "Why councils work, how to build one, and the mistakes to avoid.",
  alternates: { canonical: "https://runcouncil.com/guide" },
  openGraph: {
    title: "Guide — RunCouncil",
    description: "Why councils work, how to build one, and the mistakes to avoid.",
    url: "https://runcouncil.com/guide",
    type: "website",
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
