import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
});

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
  alternates: {
    canonical: "https://runcouncil.com",
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
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-903C86JSL9" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-903C86JSL9');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "RunCouncil",
              "url": "https://runcouncil.com",
              "description": "Build a custom AI advisory council for your startup, career, health, investments, or life decisions. Works with ChatGPT, Claude, and Gemini.",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Perrow",
                "url": "https://x.com/perrow"
              }
            }),
          }}
        />
      </head>
      <body className={`${GeistSans.className} ${playfair.variable} bg-[var(--background)] text-[var(--foreground)] antialiased`}>
        {children}
        <footer className="border-t border-[var(--rc-border)] bg-[var(--background)] px-6 py-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-600">
              <span>Built by <a href="https://x.com/perrow" target="_blank" rel="noopener noreferrer" className="text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200">Perrow</a></span>
              <span>·</span>
              <a href="/community" className="text-zinc-500 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400">Community</a>
              <span>·</span>
              <a href="/request" className="text-zinc-500 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400">Request an Expert</a>
              <span>·</span>
              <a href="https://x.com/perrow" target="_blank" rel="noopener noreferrer" className="text-zinc-500 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-400">𝕏</a>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-700">130+ AI advisors · 8 councils</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
