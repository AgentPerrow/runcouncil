import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RunCouncil — Build Your AI Advisory Board in 60 Seconds",
  description:
    "Assemble a custom AI advisory council for your startup, career, health, investments, or life decisions. Free, no signup, works with ChatGPT, Claude, and Gemini.",
  metadataBase: new URL("https://runcouncil.com"),
  openGraph: {
    title: "RunCouncil — Build Your AI Advisory Board in 60 Seconds",
    description:
      "Stop asking one AI one question. Assemble a council of specialized advisors who debate your decisions from every angle. Free, instant, no account needed.",
    url: "https://runcouncil.com",
    siteName: "RunCouncil",
    type: "website",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "RunCouncil — Build Your AI Advisory Board",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RunCouncil — Build Your AI Advisory Board in 60 Seconds",
    description:
      "Stop asking one AI one question. Assemble a council of specialized advisors who debate your decisions from every angle.",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`${GeistSans.className} bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
