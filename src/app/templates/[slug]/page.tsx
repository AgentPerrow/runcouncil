import { Metadata } from "next";
import Link from "next/link";
import { templates } from "@/data/templates";
import { mergedCouncils as councils, universalMembers } from "@/data/merged-councils";
import { notFound } from "next/navigation";

const categoryToCouncilId: Record<string, string> = {
  Startup: "startup",
  Health: "health",
  Career: "career",
  Investment: "investment",
  Creative: "creative",
  Parenting: "parenting",
  Life: "life",
};

function getTemplateMembers(template: (typeof templates)[0]) {
  const councilId = categoryToCouncilId[template.category];
  const council = councils.find((c) => c.id === councilId);
  if (!council) return [];
  const allMembers = [...council.members, ...universalMembers];
  return template.memberIds
    .map((id) => allMembers.find((m) => m.id === id))
    .filter(Boolean);
}

export async function generateStaticParams() {
  return templates.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = templates.find((t) => t.id === slug);
  if (!template) return { title: "Template Not Found" };
  return {
    title: `${template.emoji} ${template.title} — RunCouncil`,
    description: template.description,
    openGraph: {
      title: `${template.emoji} ${template.title} — RunCouncil`,
      description: template.description,
      url: `https://runcouncil.com/templates/${template.id}`,
      siteName: "RunCouncil",
      type: "website",
      images: [{ url: "/og", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${template.emoji} ${template.title} — RunCouncil`,
      description: template.description,
    },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = templates.find((t) => t.id === slug);
  if (!template) notFound();

  const members = getTemplateMembers(template);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            RunCouncil
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/templates"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Templates
            </Link>
            <Link
              href="/guide"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Guide
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-2">
          <Link
            href="/templates"
            className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            ← All Templates
          </Link>
        </div>

        <div className="mb-1 flex items-center gap-3">
          <span className="text-4xl">{template.emoji}</span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {template.category}
          </span>
        </div>

        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {template.title}
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          {template.description}
        </p>

        <Link
          href={`/?template=${template.id}`}
          className="mt-8 inline-block rounded-lg bg-amber-500 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-400 transition-colors"
        >
          Build This Council →
        </Link>

        {/* Council Members */}
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Your {members.length} Advisors
          </h2>
          <div className="space-y-3">
            {members.map((m) =>
              m ? (
                <div
                  key={m.id}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{m.emoji}</span>
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                        {m.name}
                      </h3>
                      <p className="text-xs text-zinc-500">{m.role}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {m.description}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/?template=${template.id}`}
            className="inline-block rounded-lg bg-amber-500 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-400 transition-colors"
          >
            Start Building →
          </Link>
          <p className="mt-3 text-xs text-zinc-400">
            Free · No signup · Works with ChatGPT, Claude, Gemini
          </p>
        </div>
      </div>
    </main>
  );
}
