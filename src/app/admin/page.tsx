"use client";

import { useState, useEffect, useCallback } from "react";
import { PrismLogoFull } from "@/components/PrismLogo";

interface CommunityMember {
  id: string;
  name: string;
  role: string;
  emoji: string;
  description: string;
  expertise: string;
  systemPrompt: string;
  council: string;
  status: "pending" | "approved" | "rejected";
  upvotes: number;
  submittedBy: string;
  submittedAt: string;
}

interface Session {
  user?: { name?: string; email?: string };
  isAdmin?: boolean;
}

const ADMIN_EMAILS = ["agentperrow@gmail.com", "mperrow@gmail.com"];

export default function AdminPage() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => setSession(s?.user ? s : null))
      .catch(() => setSession(null));
  }, []);

  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/community?filter=all");
    const data = await res.json();
    setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) loadMembers();
    else setLoading(false);
  }, [isAdmin, loadMembers]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/community/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = members.filter((m) => m.status === tab);

  if (!isAdmin && !loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--rc-text-primary)] mb-2">Admin Access Required</h1>
          <p className="text-[var(--rc-text-secondary)] mb-4">Sign in with an admin account.</p>
          <a href="/api/auth/signin" className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-400">
            Sign In
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <header className="px-6 sm:px-12 py-5 border-b border-[var(--rc-border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a href="/"><PrismLogoFull height={36} /></a>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-amber-600">Admin Panel</span>
            <button onClick={() => window.location.href = "/api/auth/signout"} className="text-sm text-[var(--rc-text-secondary)] hover:text-red-400">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-[var(--rc-text-primary)] mb-6">Community Submissions</h1>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {(["pending", "approved", "rejected"] as const).map((t) => {
            const count = members.filter((m) => m.status === t).length;
            return (
              <button
                key={t} onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                  tab === t ? "bg-amber-500 text-white" : "border border-[var(--rc-border)] text-[var(--rc-text-secondary)] hover:border-[var(--rc-text-muted)]"
                }`}
              >
                {t} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="py-20 text-center text-[var(--rc-text-muted)]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[var(--rc-text-muted)]">No {tab} submissions.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((m) => (
              <div key={m.id} className="rounded-xl border border-[var(--rc-border)] bg-[var(--rc-card)]">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-[var(--rc-text-primary)]">{m.name}</h3>
                      <p className="text-xs text-[var(--rc-text-secondary)]">{m.role} · {m.council} · ▲ {m.upvotes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(m.id, "approve")}
                          disabled={actionLoading === m.id}
                          className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-500 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(m.id, "reject")}
                          disabled={actionLoading === m.id}
                          className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                      className="text-xs text-[var(--rc-text-muted)] hover:text-[var(--rc-text-primary)]"
                    >
                      {expanded === m.id ? "Hide" : "Details"}
                    </button>
                  </div>
                </div>
                {expanded === m.id && (
                  <div className="border-t border-[var(--rc-border)] p-4 space-y-2 text-sm text-[var(--rc-text-secondary)]">
                    <p><strong>Description:</strong> {m.description}</p>
                    {m.expertise && <p><strong>Expertise:</strong> {m.expertise}</p>}
                    {m.systemPrompt && (
                      <div>
                        <strong>System Prompt:</strong>
                        <pre className="mt-1 whitespace-pre-wrap rounded bg-[var(--rc-surface)] p-3 text-xs">{m.systemPrompt}</pre>
                      </div>
                    )}
                    <p className="text-xs text-[var(--rc-text-muted)]">By {m.submittedBy} · {new Date(m.submittedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
