import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community — RunCouncil",
  description:
    "Browse and vote on community-submitted council members. Submit your own.",
  alternates: { canonical: "https://www.runcouncil.com/community" },
  openGraph: {
    title: "Community — RunCouncil",
    description: "Browse and vote on community-submitted council members. Submit your own.",
    url: "https://www.runcouncil.com/community",
    type: "website",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
