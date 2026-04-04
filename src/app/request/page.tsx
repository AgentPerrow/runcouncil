"use client";

import { useState, useEffect, useCallback } from "react";
import { PrismLogoFull } from "@/components/PrismLogo";
import SiteNav from "@/components/SiteNav";

interface ExpertRequest {
  id: string;
  title: string;
  council: string;
  expertise: string;
  problem: string;
  upvotes: number;
  createdAt: string;
  status: "pending" | "approved" | "built";
}

const COUNCIL_OPTIONS = [
  { id: "startup", name: "Startup", emoji: "🚀" },
  { id: "health", name: "Health", emoji: "🏥" },
  { id: "career", name: "Career", emoji: "💼" },
  { id: "investment", name: "Investment", emoji: "📈" },
  { id: "realestate", name: "Real Estate", emoji: "🏠" },
  { id: "creative", name: "Creative", emoji: "🎨" },
  { id: "parenting", name: "Parenting", emoji: "👶" },
  { id: "life", name: "Life", emoji: "🧭" },
  { id: "new", name: "New Council", emoji: "✨" },
];

type SortBy = "newest" | "popular";
type FilterCouncil = "all" | string;

export default function RequestPage() {
  const [requests, setRequests] = useState<ExpertRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [filterCouncil, setFilterCouncil] = useState<FilterCouncil>("all");
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [council, setCouncil] = useState("");
  const [expertise, setExpertise] = useState("");
  const [problem, setProblem] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("rc-voted-ids");
    if (stored) setVotedIds(new Set(JSON.parse(stored)));
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !council || !expertise.trim() || !problem.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), council, expertise: expertise.trim(), problem: problem.trim() }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTitle("");
        setCouncil("");
        setExpertise("");
        setProblem("");
        setTimeout(() => {
          setShowForm(false);
          setSubmitted(false);
        }, 2000);
        fetchRequests();
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id: string) => {
    if (votedIds.has(id)) return;
    const newVoted = new Set(votedIds);
    newVoted.add(id);
    setVotedIds(newVoted);
    localStorage.setItem("rc-voted-ids", JSON.stringify([...newVoted]));

    // Optimistic update
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r)));

    try {
      await fetch("/api/requests/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // revert on error
      newVoted.delete(id);
      setVotedIds(newVoted);
      localStorage.setItem("rc-voted-ids", JSON.stringify([...newVoted]));
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes - 1 } : r)));
    }
  };

  const filtered = requests
    .filter((r) => r.status === "approved" || r.status === "built")
    .filter((r) => filterCouncil === "all" || r.council === filterCouncil)
    .sort((a, b) => {
      if (sortBy === "popular") return b.upvotes - a.upvotes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const councilEmoji = (id: string) => COUNCIL_OPTIONS.find((c) => c.id === id)?.emoji || "🔮";
  const councilName = (id: string) => COUNCIL_OPTIONS.find((c) => c.id === id)?.name || id;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SiteNav activePage="request" />

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-[var(--rc-text-primary)] sm:text-4xl">
            Request an Expert
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--rc-text-secondary)]">
            Can&apos;t find the exact advisor you need? Tell us what&apos;s missing.
            The community votes, and top requests become real council members.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] p-1">
            <button
              onClick={() => setSortBy("popular")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                sortBy === "popular"
                  ? "bg-[var(--rc-card)] text-[var(--rc-text-primary)] shadow-sm"
                  : "text-[var(--rc-text-muted)] hover:text-[var(--rc-text-secondary)]"
              }`}
            >
              🔥 Popular
            </button>
            <button
              onClick={() => setSortBy("newest")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                sortBy === "newest"
                  ? "bg-[var(--rc-card)] text-[var(--rc-text-primary)] shadow-sm"
                  : "text-[var(--rc-text-muted)] hover:text-[var(--rc-text-secondary)]"
              }`}
            >
              🕐 Newest
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCouncil("all")}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                filterCouncil === "all"
                  ? "bg-[var(--rc-text-primary)] text-[var(--background)]"
                  : "border border-[var(--rc-border)] text-[var(--rc-text-secondary)] hover:border-[var(--rc-text-muted)]"
              }`}
            >
              All
            </button>
            {COUNCIL_OPTIONS.filter((c) => c.id !== "new").map((c) => (
              <button
                key={c.id}
                onClick={() => setFilterCouncil(c.id)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                  filterCouncil === c.id
                    ? "bg-[var(--rc-text-primary)] text-[var(--background)]"
                    : "border border-[var(--rc-border)] text-[var(--rc-text-secondary)] hover:border-[var(--rc-text-muted)]"
                }`}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Request Cards */}
        {loading ? (
          <div className="py-20 text-center text-[var(--rc-text-muted)]">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-2 text-lg text-[var(--rc-text-secondary)]">No requests yet</p>
            <p className="text-sm text-[var(--rc-text-muted)]">Be the first to request an expert</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => (
              <div
                key={req.id}
                className="group flex gap-4 rounded-xl border border-[var(--rc-border)] bg-[var(--rc-card)] p-5 transition-colors hover:border-[var(--rc-text-muted)]"
              >
                {/* Vote button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleVote(req.id)}
                    disabled={votedIds.has(req.id)}
                    className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg border transition-all ${
                      votedIds.has(req.id)
                        ? "border-orange-500/30 bg-orange-500/10 text-orange-500"
                        : "border-[var(--rc-border)] text-[var(--rc-text-muted)] hover:border-orange-500/50 hover:text-orange-500"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill={votedIds.has(req.id) ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-sm font-semibold">{req.upvotes}</span>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-[var(--rc-text-primary)]">{req.title}</h3>
                    {req.status === "built" && (
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                        ✅ Built
                      </span>
                    )}
                  </div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-[var(--rc-text-muted)]">
                    <span className="rounded-full bg-[var(--rc-surface)] px-2 py-0.5">
                      {councilEmoji(req.council)} {councilName(req.council)}
                    </span>
                  </div>
                  <p className="mb-1 text-sm text-[var(--rc-text-secondary)]">
                    <span className="font-medium text-[var(--rc-text-primary)]">Expertise:</span> {req.expertise}
                  </p>
                  <p className="text-sm text-[var(--rc-text-secondary)]">
                    <span className="font-medium text-[var(--rc-text-primary)]">Why:</span> {req.problem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Submit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => !submitting && setShowForm(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-[var(--rc-border)] bg-[var(--rc-card)] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mb-3 text-4xl">🎉</div>
                <h3 className="mb-1 text-lg font-semibold text-[var(--rc-text-primary)]">Request Submitted</h3>
                <p className="text-sm text-[var(--rc-text-secondary)]">It&apos;ll show up once approved. Thanks for making RunCouncil better.</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--rc-text-primary)]">Request an Expert</h2>
                  <button onClick={() => setShowForm(false)} className="text-[var(--rc-text-muted)] hover:text-[var(--rc-text-primary)]">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--rc-text-primary)]">
                      What would you call this expert?
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='e.g. "Ontario Family Lawyer" or "DTC Pricing Strategist"'
                      className="w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2.5 text-sm text-[var(--rc-text-primary)] placeholder:text-[var(--rc-text-muted)] focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--rc-text-primary)]">
                      Which council?
                    </label>
                    <select
                      value={council}
                      onChange={(e) => setCouncil(e.target.value)}
                      className="w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2.5 text-sm text-[var(--rc-text-primary)] focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                      required
                    >
                      <option value="">Select a council</option>
                      {COUNCIL_OPTIONS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.emoji} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--rc-text-primary)]">
                      What should they know?
                    </label>
                    <textarea
                      value={expertise}
                      onChange={(e) => setExpertise(e.target.value)}
                      placeholder="The specific knowledge, jurisdiction, niche, or specialization that matters"
                      rows={3}
                      className="w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2.5 text-sm text-[var(--rc-text-primary)] placeholder:text-[var(--rc-text-muted)] focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--rc-text-primary)]">
                      Why do you need this?
                    </label>
                    <textarea
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="What's the real situation? The more specific you are, the more upvotes you'll get."
                      rows={3}
                      className="w-full rounded-lg border border-[var(--rc-border)] bg-[var(--rc-surface)] px-3 py-2.5 text-sm text-[var(--rc-text-primary)] placeholder:text-[var(--rc-text-muted)] focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/50 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-gradient-to-r from-[var(--rc-gradient-start)] via-[var(--rc-gradient-mid)] to-[var(--rc-gradient-end)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
