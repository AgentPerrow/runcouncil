import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates — RunCouncil",
  description:
    "Pre-built council templates for high-stakes decisions. Startup, health, career, investment, and more.",
  alternates: { canonical: "https://www.runcouncil.com/templates" },
  openGraph: {
    title: "Templates — RunCouncil",
    description:
      "Pre-built council templates for high-stakes decisions. Startup, health, career, investment, and more.",
    url: "https://www.runcouncil.com/templates",
    type: "website",
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
