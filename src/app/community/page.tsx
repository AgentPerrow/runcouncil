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
  user?: { name?: string; email?: string; image?: string };
  isAdmin?: boolean;
}

const COUNCIL_OPTIONS = [
  { value: "startup", label: "🚀 Startup" },
  { value: "health", label: "💪 Health" },
  { value: "career", label: "💼 Career" },
  { value: "investment", label: "📈 Investment" },
  { value: "creative", label: "🎨 Creative" },
  { value: "parenting", label: "👶 Parenting" },
  { value: "life", label: "🌍 Life" },
  { value: "realestate", label: "🏠 Real Estate" },
  { value: "other", label: "✨ Other" },
];

const EMOJI_OPTIONS = [
  "🧠", "💡", "🔮", "🎯", "🛡️", "⚡", "🔬", "📐", "🌍", "🎪",
  "🦊", "🐺", "🦅", "🧙", "👁️", "💎", "🔥", "🌊", "⭐", "🏛️",
];

export default function CommunityPage() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showSubmit, setShowSubmit] = useState(false);
  const [showMySubmissions, setShowMySubmissions] = useState(false);
  const [mySubmissions, setMySubmissions] = useState<CommunityMember[]>([]);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  // Form state
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formEmoji, setFormEmoji] = useState("🧠");
  const [formDescription, setFormDescription] = useState("");
  const [formExpertise, setFormExpertise] = useState("");
  const [formSystemPrompt, setFormSystemPrompt] = useState("");
  const [formCouncil, setFormCouncil] = useState("startup");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => setSession(s?.user ? s : null))
      .catch(() => setSession(null));
  }, []);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter) params.set("council", filter);
    const res = await fetch(`/api/community?${params}`);
    const data = await res.json();
    setMembers(data);
    setLoading(false);
  }, [filter]);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  const loadMySubmissions = useCallback(async () => {
    if (!session?.user?.email) return;
    const res = await fetch("/api/community?filter=mine");
    const data = await res.json();
    setMySubmissions(data);
  }, [session]);

  const handleVote = async (id: string) => {
    if (votedIds.has(id)) return;
    const res = await fetch("/api/community/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const { upvotes } = await res.json();
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, upvotes } : m)));
      setVotedIds((prev) => new Set([...prev, id]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          role: formRole,
          emoji: formEmoji,
          description: formDescription,
          expertise: formExpertise,
          systemPrompt: formSystemPrompt,
          council: formCouncil,
        }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setFormName(""); setFormRole(""); setFormDescription(""); setFormExpertise(""); setFormSystemPrompt("");
        setTimeout(() => { setSubmitSuccess(false); setShowSubmit(false); loadMembers(); }, 2000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const signIn = () => {
    window.location.href = "/api/auth/signin";
  };

  const filtered = members
    .filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.upvotes - a.upvotes);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="px-6 sm:px-12 py-5 border-b border-[var(--rc-border)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/">
            <PrismLogoFull height={36} />
          </a>
          <nav className="hidden sm:flex items-center gap-8">
            <a href="/" className="text-[15px] text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]">Home</a>
            <a href="/community" className="text-[15px] font-medium text-amber-600">Community</a>
            <a href="/templates" className="text-[15px] text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]">Templates</a>
            <a href="/request" className="text-[15px] text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]">Request</a>
          </nav>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--rc-text-secondary)]">{session.user.name}</span>
                {session.user.image && <img src={session.user.image} alt="" className="h-7 w-7 rounded-full" />}
              </div>
            ) : (
              <button onClick={signIn} className="rounded-full bg-[#111] px-5 py-2 text-sm font-medium text-white hover:bg-[#222]">
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        {/* Hero */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--rc-text-primary)]">
              Community Marketplace
            </h1>
            <p className="mt-1 text-[var(--rc-text-secondary)]">
              Browse and vote on council members created by the community. Add them to your councils.
            </p>
          </div>
          <div className="flex gap-2">
            {session?.user && (
              <button
                onClick={() => { setShowMySubmissions(!showMySubmissions); if (!showMySubmissions) loadMySubmissions(); }}
                className="rounded-lg border border-[var(--rc-border)] px-4 py-2.5 text-sm font-medium text-[var(--rc-text-secondary)] hover:border-[var(--rc-text-muted)] hover:text-[var(--rc-text-primary)]"
              >
                My Submissions
              </button>
            )}
            <button
              onClick={() => session?.user ? setShowSubmit(!showSubmit) : signIn()}
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-400"
            >
              + Submit a Role
            </button>
          </div>
        </div>

        {/* My Submissions */}
        {showMySubmissions && mySubmissions.length > 0 && (
          <div className="mb-8 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-surface)] p-5">
            <h3 className="mb-4 text-sm font-semibold text-[var(--rc-text-primary)]">Your Submissions</h3>
            <div className="space-y-2">
              {mySubmissions.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-[var(--rc-border)] bg-[var(--rc-card)] p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{m.emoji}</span>
                    <div>
                      <span className="font-medium text-[var(--rc-text-primary)]">{m.name}</span>
                      <span className="ml-2 text-xs text-[var(--rc-text-secondary)]">{m.role}</span>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    m.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    m.status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Form */}
        {showSubmit && (
          <div className="mb-8 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-6">
            {submitSuccess ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="text-lg font-semibold text-[var(--rc-text-primary)]">Submitted!</h3>
                <p className="text-sm text-[var(--rc-text-secondary)]">Your role is pending review.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4 text-lg font-semibold text-[var(--rc-text-primary)]">Submit a New Role</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-[var(--rc-text-secondary)]">Name *</label>
                    <input
                      type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required maxLength={80}
                      placeholder="e.g. Ontario Family Lawyer"
                      className="w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-card)] px-3 py-2 text-sm text-[var(--rc-text-primary)] placeholder-[var(--rc-text-muted)] outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[var(--rc-text-secondary)]">Role *</label>
                    <input
                      type="text" value={formRole} onChange={(e) => setFormRole(e.target.value)} required maxLength={100}
                      placeholder="e.g. Canadian Family Law & Custody Specialist"
                      className="w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-card)] px-3 py-2 text-sm text-[var(--rc-text-primary)] placeholder-[var(--rc-text-muted)] outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[var(--rc-text-secondary)]">Council *</label>
                    <select
                      value={formCouncil} onChange={(e) => setFormCouncil(e.target.value)}
                      className="w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-card)] px-3 py-2 text-sm text-[var(--rc-text-primary)] outline-none focus:border-amber-400"
                    >
                      {COUNCIL_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[var(--rc-text-secondary)]">Emoji</label>
                    <div className="flex flex-wrap gap-1">
                      {EMOJI_OPTIONS.map((e) => (
                        <button
                          key={e} type="button" onClick={() => setFormEmoji(e)}
                          className={`flex h-8 w-8 items-center justify-center rounded text-lg ${formEmoji === e ? "bg-amber-200 dark:bg-amber-900/50 ring-2 ring-amber-400" : "hover:bg-[var(--rc-surface)]"}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm text-[var(--rc-text-secondary)]">Description *</label>
                    <textarea
                      value={formDescription} onChange={(e) => setFormDescription(e.target.value)} required maxLength={500}
                      rows={2} placeholder="e.g. 15 years practicing family law in Ontario. Specializes in custody agreements, spousal support, and property division. Knows the local court system inside out."
                      className="w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-card)] px-3 py-2 text-sm text-[var(--rc-text-primary)] placeholder-[var(--rc-text-muted)] outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm text-[var(--rc-text-secondary)]">Expertise Areas (comma-separated)</label>
                    <input
                      type="text" value={formExpertise} onChange={(e) => setFormExpertise(e.target.value)}
                      placeholder="e.g. Custody law, Child support calculations, Separation agreements, Ontario family court procedures"
                      className="w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-card)] px-3 py-2 text-sm text-[var(--rc-text-primary)] placeholder-[var(--rc-text-muted)] outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm text-[var(--rc-text-secondary)]">System Prompt (optional)</label>
                    <textarea
                      value={formSystemPrompt} onChange={(e) => setFormSystemPrompt(e.target.value)}
                      rows={3} placeholder="e.g. You are an Ontario family lawyer with 15 years of experience. You advise on custody, support, and property matters. Always cite relevant Ontario statutes and case law. Flag when the user should get in-person legal counsel."
                      className="w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-card)] px-3 py-2 text-sm text-[var(--rc-text-primary)] placeholder-[var(--rc-text-muted)] outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    type="submit" disabled={submitting}
                    className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit for Review"}
                  </button>
                  <button
                    type="button" onClick={() => setShowSubmit(false)}
                    className="rounded-lg border border-[var(--rc-border)] px-4 py-2.5 text-sm text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text" placeholder="Search roles..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-[var(--rc-border)] bg-[var(--rc-card)] px-4 py-2.5 text-sm text-[var(--rc-text-primary)] placeholder-[var(--rc-text-muted)] outline-none focus:border-amber-400"
          />
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter("")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${!filter ? "bg-amber-500 text-white" : "border border-[var(--rc-border)] text-[var(--rc-text-secondary)] hover:border-[var(--rc-text-muted)]"}`}
            >
              All
            </button>
            {COUNCIL_OPTIONS.map((c) => (
              <button
                key={c.value} onClick={() => setFilter(c.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${filter === c.value ? "bg-amber-500 text-white" : "border border-[var(--rc-border)] text-[var(--rc-text-secondary)] hover:border-[var(--rc-text-muted)]"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="py-20 text-center text-[var(--rc-text-muted)]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="text-lg font-semibold text-[var(--rc-text-primary)]">No community roles yet</h3>
            <p className="text-sm text-[var(--rc-text-secondary)]">Be the first to submit one!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-[var(--rc-border)] bg-[var(--rc-card)] p-5 hover:border-[var(--rc-text-muted)] hover:shadow-md transition-all"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{member.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-[var(--rc-text-primary)]">{member.name}</h3>
                      <p className="text-xs text-[var(--rc-text-secondary)]">{member.role}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                    Community
                  </span>
                </div>
                <p className="mb-3 text-sm text-[var(--rc-text-secondary)] line-clamp-2">{member.description}</p>
                {member.expertise && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {member.expertise.split(",").slice(0, 3).map((e, i) => (
                      <span key={i} className="rounded-full bg-[var(--rc-surface)] px-2 py-0.5 text-[10px] text-[var(--rc-text-muted)]">
                        {e.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[var(--rc-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--rc-text-secondary)]">
                      {COUNCIL_OPTIONS.find((c) => c.value === member.council)?.label || member.council}
                    </span>
                  </div>
                  <button
                    onClick={() => handleVote(member.id)}
                    disabled={votedIds.has(member.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      votedIds.has(member.id)
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        : "border border-[var(--rc-border)] text-[var(--rc-text-secondary)] hover:border-amber-400 hover:text-amber-600"
                    }`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill={votedIds.has(member.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M12 4l2.5 5.5L20 10l-4 4 1 5.5L12 17l-5 2.5 1-5.5-4-4 5.5-.5z" />
                    </svg>
                    {member.upvotes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
