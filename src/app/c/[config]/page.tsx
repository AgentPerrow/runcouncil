"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { decodeCouncilConfig } from "@/lib/share";
import { councils, CouncilType, CouncilMember, generateCouncilOutput } from "@/data/councils";

export default function SharedCouncilPage() {
  const params = useParams();
  const router = useRouter();
  const [council, setCouncil] = useState<CouncilType | null>(null);
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const encoded = params.config as string;
    const config = decodeCouncilConfig(encoded);

    if (!config) {
      setError(true);
      return;
    }

    const foundCouncil = councils.find((c) => c.id === config.councilId);
    if (!foundCouncil) {
      setError(true);
      return;
    }

    setCouncil(foundCouncil);

    const resolvedMembers: CouncilMember[] = [];
    for (const m of config.members) {
      if (m.custom) {
        resolvedMembers.push({
          id: m.id,
          name: m.custom.name,
          role: m.custom.role,
          emoji: m.custom.emoji,
          description: m.custom.description,
          prompt: m.custom.prompt,
          isDefault: false,
        });
      } else {
        const found = foundCouncil.members.find((cm) => cm.id === m.id);
        if (found) resolvedMembers.push(found);
      }
    }

    setMembers(resolvedMembers);
  }, [params.config]);

  const copyOutput = async () => {
    if (!council) return;
    await navigator.clipboard.writeText(generateCouncilOutput(council, members));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-white">Invalid Council Link</h1>
          <p className="mb-6 text-zinc-400">This council configuration couldn't be loaded.</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
          >
            Build Your Own →
          </button>
        </div>
      </main>
    );
  }

  if (!council) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-zinc-500">Loading council...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/50 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="text-lg font-semibold tracking-tight text-zinc-100 hover:text-white"
          >
            RunCouncil
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white"
          >
            Build Your Own
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-2 text-sm text-zinc-500">Shared Council</div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {council.emoji} {council.name} Council
            </h1>
            <p className="mt-1 text-zinc-400">{members.length} members</p>
          </div>
          <button
            onClick={copyOutput}
            className={`rounded-lg px-6 py-2.5 text-sm font-semibold ${
              copied
                ? "bg-green-600 text-white"
                : "bg-white text-zinc-900 hover:bg-zinc-200"
            }`}
          >
            {copied ? "✓ Copied!" : "Copy All"}
          </button>
        </div>

        {/* Members */}
        <div className="mb-8 flex flex-wrap gap-2">
          {members.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300"
            >
              {m.emoji} {m.name}
            </span>
          ))}
        </div>

        {/* Output */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-300">
            {generateCouncilOutput(council, members)}
          </pre>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/30 p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-white">Want to customize this council?</h3>
          <p className="mb-4 text-sm text-zinc-400">Add or remove members, create custom advisors, and make it yours.</p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
          >
            Build Your Own Council →
          </button>
        </div>
      </div>
    </main>
  );
}
