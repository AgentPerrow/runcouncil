import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community — RunCouncil",
  description:
    "Browse and vote on community-submitted council members. Submit your own.",
  alternates: { canonical: "https://runcouncil.com/community" },
  openGraph: {
    title: "Community — RunCouncil",
    description: "Browse and vote on community-submitted council members. Submit your own.",
    url: "https://runcouncil.com/community",
    type: "website",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
