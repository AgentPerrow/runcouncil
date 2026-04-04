import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Council — RunCouncil",
  description:
    "Pick your experts, configure the conversation, and generate your council prompt.",
  alternates: { canonical: "https://runcouncil.com/build" },
  openGraph: {
    title: "Build Your Council — RunCouncil",
    description:
      "Pick your experts, configure the conversation, and generate your council prompt.",
    url: "https://runcouncil.com/build",
    type: "website",
  },
};

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
