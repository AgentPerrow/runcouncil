"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { mergedCouncils as councils, customCouncil, universalMembers, CouncilType, CouncilMember, generateCouncilOutput } from "@/data/merged-councils";
import CustomMemberCreator from "@/components/CustomMemberCreator";
import EmailCapture from "@/components/EmailCapture";
import { buildShareUrl } from "@/lib/share";
import CouncilConfigurator, { COUNCIL_CONFIGS } from "@/components/CouncilConfigurator";
import { applyPromptModifiers, getRecommendedMembers } from "@/data/prompt-modifiers";
import { templates } from "@/data/templates";
import { PrismLogoFull } from "@/components/PrismLogo";
import { Suspense } from "react";

type Step = "select" | "context" | "members" | "output";

const FEATURED_IDS = ["startup", "health", "career", "investment"];

interface CommunityMemberData {
  id: string;
  name: string;
  role: string;
  emoji: string;
  description: string;
  expertise: string;
  systemPrompt: string;
  council: string;
  upvotes: number;
}

function BuildPageInner() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("select");
  const [selectedCouncil, setSelectedCouncil] = useState<CouncilType | null>(null);
  const [activeMembers, setActiveMembers] = useState<CouncilMember[]>([]);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((s) => { if (s?.user) setUser(s.user); })
      .catch(() => {});
  }, []);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showCustomCreator, setShowCustomCreator] = useState(false);
  const [showAllCouncils, setShowAllCouncils] = useState(false);
  const [expandedOutputMember, setExpandedOutputMember] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [nextStepDone, setNextStepDone] = useState(false);
  const [configAnswers, setConfigAnswers] = useState<Record<string, string>>({});
  const [communityMembers, setCommunityMembers] = useState<CommunityMemberData[]>([]);
  const [configScales, setConfigScales] = useState<Record<string, number>>({});

  // Fetch approved community members
  useEffect(() => {
    fetch("/api/community")
      .then((res) => res.ok ? res.json() : [])
      .then((data: CommunityMemberData[]) => setCommunityMembers(data))
      .catch(() => {});
  }, []);

  // Prevent scroll restoration issues on mobile
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Load council from URL params (?council=startup) or template
  useEffect(() => {
    const councilParam = searchParams.get("council");
    if (councilParam) {
      const council = councils.find((c) => c.id === councilParam);
      if (council) {
        setSelectedCouncil(council);
        setActiveMembers(council.members.filter((m) => m.isDefault));
        setStep(COUNCIL_CONFIGS[council.id] ? "context" : "members");
        return;
      }
    }

    const templateId = searchParams.get("template");
    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        const categoryMap: Record<string, string> = {
          Startup: "startup", Health: "health", Career: "career",
          Investment: "investment", Creative: "creative", Parenting: "parenting", Life: "life",
        };
        const councilId = categoryMap[template.category];
        const council = councils.find((c) => c.id === councilId);
        if (council) {
          setSelectedCouncil(council);
          const allMembers = [...council.members, ...universalMembers];
          const selected = template.memberIds
            .map((id) => allMembers.find((m) => m.id === id))
            .filter(Boolean) as CouncilMember[];
          if (selected.length > 0) setActiveMembers(selected);
          setStep("members");
        }
      }
    }
  }, [searchParams]);

  const featuredCouncils = councils.filter((c) => FEATURED_IDS.includes(c.id));
  const otherCouncils = councils.filter((c) => !FEATURED_IDS.includes(c.id));

  const selectCouncil = useCallback((council: CouncilType) => {
    setSelectedCouncil(council);
    setConfigAnswers({});
    setConfigScales({});
    if (council.id === "custom") {
      setActiveMembers([]);
      setShowCustomCreator(true);
      setStep("members");
    } else {
      setActiveMembers(council.members.filter((m) => m.isDefault));
      setShowCustomCreator(false);
      setStep(COUNCIL_CONFIGS[council.id] ? "context" : "members");
    }
  }, []);

  const removeMember = useCallback((memberId: string) => {
    setActiveMembers((prev) => {
      const member = prev.find((m) => m.id === memberId);
      if (member?.isRequired) return prev;
      return prev.filter((m) => m.id !== memberId);
    });
  }, []);

  const MAX_MEMBERS = 12;
  const addMember = useCallback((member: CouncilMember) => {
    setActiveMembers((prev) => {
      if (prev.find((m) => m.id === member.id)) return prev;
      if (prev.length >= MAX_MEMBERS) return prev;
      return [...prev, member];
    });
    setShowAddPanel(false);
  }, []);

  const generate = useCallback(() => {
    setStep("output");
    setNextStepDone(false);
  }, []);

  const getCustomizedMembers = useCallback((): CouncilMember[] => {
    if (!selectedCouncil) return activeMembers;
    const config = { answers: configAnswers, scales: configScales };
    return activeMembers.map((m) => ({
      ...m,
      prompt: applyPromptModifiers(selectedCouncil.id, m, config),
    }));
  }, [activeMembers, selectedCouncil, configAnswers, configScales]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        return true;
      } catch {
        prompt("Copy this text:", text.slice(0, 500) + (text.length > 500 ? "\n\n[Full output — use Download instead]" : ""));
        return false;
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }, []);

  const copyOutput = useCallback(async () => {
    if (!selectedCouncil) return;
    const output = generateCouncilOutput(selectedCouncil, getCustomizedMembers());
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      setNextStepDone(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [selectedCouncil, getCustomizedMembers, copyToClipboard]);

  const downloadOutput = useCallback(() => {
    if (!selectedCouncil) return;
    const output = generateCouncilOutput(selectedCouncil, getCustomizedMembers());
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedCouncil.id}-council.md`;
    a.click();
    URL.revokeObjectURL(url);
    setNextStepDone(true);
  }, [selectedCouncil, getCustomizedMembers]);

  const copyShareLink = useCallback(async () => {
    if (!selectedCouncil) return;
    const url = buildShareUrl(selectedCouncil.id, getCustomizedMembers());
    const ok = await copyToClipboard(url);
    if (ok) {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }, [selectedCouncil, getCustomizedMembers, copyToClipboard]);

  const goBack = useCallback(() => {
    if (step === "output") setStep("members");
    else if (step === "members") {
      if (selectedCouncil && COUNCIL_CONFIGS[selectedCouncil.id]) {
        setStep("context");
      } else {
        setStep("select");
        setSelectedCouncil(null);
        setActiveMembers([]);
      }
    } else if (step === "context") {
      setStep("select");
      setSelectedCouncil(null);
      setActiveMembers([]);
    }
  }, [step, selectedCouncil]);

  const hasDA = activeMembers.some((m) => m.isRequired || m.id.includes("-da"));

  const stepIndex = step === "select" ? 0 : step === "context" ? 1 : step === "members" ? 2 : 3;
  const stepLabels = selectedCouncil && COUNCIL_CONFIGS[selectedCouncil.id]
    ? ["Choose", "About You", "Members", "Output"]
    : ["Choose", "Members", "Output"];
  const adjustedIndex = selectedCouncil && COUNCIL_CONFIGS[selectedCouncil.id]
    ? stepIndex
    : step === "select" ? 0 : step === "members" ? 1 : 2;

  return (
    <main className="min-h-screen pb-24 bg-[var(--background)]">
      {/* Header */}
      <header className="px-6 sm:px-12 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/">
            <PrismLogoFull height={36} />
          </a>

          {step === "select" && (
            <nav className="hidden lg:flex items-center gap-10">
              <a href="/guide" className="text-[15px] text-[#4A4A5A] hover:text-[#111]">Guide</a>
              <a href="/templates" className="text-[15px] text-[#4A4A5A] hover:text-[#111]">Templates</a>
              <a href="/community" className="text-[15px] text-[#4A4A5A] hover:text-[#111]">Community</a>
              <a href="/faq" className="text-[15px] text-[#4A4A5A] hover:text-[#111]">FAQ</a>
            </nav>
          )}

          <div className="flex items-center gap-3">
            {user ? (
              <button onClick={() => window.location.href = "/api/auth/signout"} className="text-sm text-[var(--rc-text-secondary)] hover:text-red-400">
                Sign Out
              </button>
            ) : (
              <a href="/api/auth/signin" className="text-sm text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]">
                Sign In
              </a>
            )}
            {step === "select" && (
              <a href="/" className="text-sm text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]">
                ← Home
              </a>
            )}
            {step === "context" && (
              <button onClick={goBack} className="text-sm text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]">
                ← Council Types
              </button>
            )}
            {step === "members" && (
              <button onClick={goBack} className="text-sm text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]">
                {selectedCouncil && COUNCIL_CONFIGS[selectedCouncil.id] ? "← About You" : "← Council Types"}
              </button>
            )}
            {step === "output" && (
              <button onClick={goBack} className="text-sm text-[var(--rc-text-secondary)] hover:text-[var(--rc-text-primary)]">
                ← Edit Members
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      {step !== "select" && (
        <div className="mx-auto max-w-5xl px-6 pt-6">
          <div className="flex items-center gap-1 sm:gap-2">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-1 sm:gap-2">
                <div className={`flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium whitespace-nowrap ${
                  i <= adjustedIndex
                    ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]"
                    : "bg-[var(--rc-surface)] text-[var(--rc-text-secondary)] dark:bg-[var(--rc-surface)]"
                }`}>
                  <span>{i + 1}</span>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label === "About You" ? "You" : label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`h-px w-4 sm:w-10 ${i < adjustedIndex ? "bg-[#111111] dark:bg-white" : "bg-[var(--rc-border)]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Select council */}
      {step === "select" && (
        <div className="bg-[var(--rc-surface)] border-y border-[var(--rc-border)] mt-8">
          <div id="councils" className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-[var(--rc-text-primary)] sm:text-4xl">Choose your council</h1>
              <p className="mt-2 text-[var(--rc-text-secondary)]">Pick a category to get started, or build one from scratch.</p>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {featuredCouncils.map((council) => {
                const cardCopy: Record<string, { q: string; desc: string }> = {
                  startup: { q: "Should I raise, cut burn, or buy time?", desc: "A CFO, growth strategist, and devil\u2019s advocate pressure-test your next move." },
                  health: { q: "Am I training smart, or running myself into the ground?", desc: "A sports doc, nutritionist, and recovery specialist review the plan." },
                  career: { q: "Should I take the offer, stay put, or negotiate?", desc: "Multiple perspectives before you make the call." },
                  investment: { q: "Is this conviction, or am I rationalizing a bad trade?", desc: "A bull, a bear, and a tax-aware strategist stress-test the thesis." },
                };
                const copy = cardCopy[council.id];
                return (
                  <button
                    key={council.id}
                    onClick={() => selectCouncil(council)}
                    className="group rounded-xl border border-[var(--rc-border)] bg-[var(--rc-card)] p-3 sm:p-4 text-left hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="mb-1.5 sm:mb-2 text-2xl sm:text-3xl">{council.emoji}</div>
                    <h3 className="text-sm sm:text-lg font-semibold tracking-tight text-[var(--rc-text-primary)]">
                      {council.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm italic text-[var(--rc-text-muted)] sm:text-[var(--rc-text-secondary)] line-clamp-2 sm:line-clamp-none">
                      &ldquo;{copy ? copy.q : council.description}&rdquo;
                    </p>
                    <p className="hidden sm:block mt-2 text-xs text-[var(--rc-text-secondary)]">
                      {copy ? copy.desc : council.tagline}
                    </p>
                    <div className="mt-2 text-xs text-[var(--rc-text-secondary)] font-medium text-right opacity-0 group-hover:opacity-100 transition-opacity">Build →</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <button
                onClick={() => selectCouncil(customCouncil)}
                className="group col-span-2 lg:col-span-4 rounded-xl border-2 border-dashed border-[var(--rc-border)] bg-transparent p-4 text-center hover:border-amber-400 hover:bg-amber-50/50 transition-all duration-200"
              >
                <span className="text-2xl">✨</span>
                <h3 className="mt-1 text-lg font-semibold text-[var(--rc-text-primary)]">Start from scratch</h3>
                <p className="text-sm text-[var(--rc-text-secondary)]">Build a fully custom council with any combination of advisors</p>
              </button>
            </div>

            {!showAllCouncils ? (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAllCouncils(true)}
                  className="rounded-full border border-[var(--rc-border)] px-5 py-2 text-sm font-medium text-[var(--rc-text-secondary)] hover:border-[var(--rc-text-muted)] hover:text-[var(--rc-text-primary)]"
                >
                  Explore all councils →
                </button>
              </div>
            ) : (
              <div className="mt-8">
                <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                  {otherCouncils.map((council) => (
                    <button
                      key={council.id}
                      onClick={() => selectCouncil(council)}
                      className="group rounded-xl border border-[var(--rc-border)] bg-[var(--rc-card)] p-3 sm:p-4 text-left hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="mb-1 sm:mb-2 text-2xl sm:text-3xl">{council.emoji}</div>
                      <h3 className="text-sm sm:text-lg font-semibold tracking-tight text-[var(--rc-text-primary)]">
                        {council.name}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm italic text-[var(--rc-text-muted)] sm:text-[var(--rc-text-secondary)] line-clamp-1 sm:line-clamp-none">&ldquo;{council.description}&rdquo;</p>
                      <p className="hidden sm:block mt-2 text-xs text-[var(--rc-text-secondary)]">
                        {council.tagline}
                      </p>
                      <div className="mt-2 text-xs text-[var(--rc-text-secondary)] font-medium text-right opacity-0 group-hover:opacity-100 transition-opacity">Build →</div>
                    </button>
                  ))}
                  <button
                    onClick={() => selectCouncil(customCouncil)}
                    className="group rounded-xl border border-dashed border-[var(--rc-border)] bg-transparent p-3 sm:p-4 text-left hover:border-[var(--rc-text-muted)]"
                  >
                    <div className="mb-1 sm:mb-2 text-2xl sm:text-3xl">{customCouncil.emoji}</div>
                    <h3 className="text-sm sm:text-lg font-semibold tracking-tight text-[var(--rc-text-muted)]">{customCouncil.name}</h3>
                    <p className="hidden sm:block text-sm text-[var(--rc-text-muted)]">{customCouncil.description}</p>
                    <p className="mt-2 text-xs text-[var(--rc-text-muted)]">{customCouncil.tagline}</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-5 sm:py-8">
        {/* Step 2: About You */}
        {step === "context" && selectedCouncil && (
          <div key={`context-${selectedCouncil.id}`}>
            <div className="mb-8">
              <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {selectedCouncil.emoji} About you
              </h2>
              <p className="text-sm text-zinc-500">
                Give your {selectedCouncil.name.toLowerCase()} council the context it needs to be useful.
              </p>
            </div>

            <CouncilConfigurator
              councilId={selectedCouncil.id}
              answers={configAnswers}
              scaleValues={configScales}
              onAnswerChange={(qId, val) => setConfigAnswers((prev) => ({ ...prev, [qId]: val }))}
              onScaleChange={(sId, val) => setConfigScales((prev) => ({ ...prev, [sId]: val }))}
            />

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  if (selectedCouncil) {
                    const recs = getRecommendedMembers(selectedCouncil.id, { answers: configAnswers, scales: configScales });
                    const currentIds = new Set(activeMembers.map(m => m.id));
                    const newMembers = recs
                      .filter(id => !currentIds.has(id))
                      .map(id => selectedCouncil.members.find(m => m.id === id))
                      .filter((m): m is CouncilMember => m !== undefined);
                    if (newMembers.length > 0) {
                      setActiveMembers(prev => [...prev, ...newMembers]);
                    }
                  }
                  setStep("members");
                }}
                className="rounded-lg bg-amber-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-amber-400"
              >
                Next: Choose Members →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Members */}
        {step === "members" && selectedCouncil && (
          <div>
            <div className="mb-6">
              <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {selectedCouncil.emoji} Meet your council
              </h2>
              <p className="text-sm text-zinc-500">
                {activeMembers.length}/{MAX_MEMBERS} members
                {hasDA && <span className="text-zinc-400 dark:text-zinc-600"> · Devil&apos;s Advocate included ✓</span>}
                {activeMembers.length >= MAX_MEMBERS && <span className="text-amber-500"> · Council full</span>}
              </p>
            </div>

            <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeMembers.map((member) => (
                <div
                  key={member.id}
                  className="group relative rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 shadow-sm dark:shadow-none"
                >
                  {!member.isRequired && (
                    <button
                      onClick={() => removeMember(member.id)}
                      className="absolute right-2 top-2 rounded-full bg-zinc-100 dark:bg-zinc-800 p-1.5 text-zinc-500 dark:text-zinc-400 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                      </svg>
                    </button>
                  )}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xl">{member.emoji}</span>
                    <div>
                      <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{member.name}</h4>
                      <p className="text-xs text-zinc-500">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{member.description}</p>
                  <div className="mt-2 flex gap-1.5">
                    {member.isRequired && (
                      <span className="inline-block rounded-full bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">
                        Required
                      </span>
                    )}
                    {member.id.startsWith("community-") && (
                      <span className="inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                        Community
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {selectedCouncil.id !== "custom" && (
                <button
                  onClick={() => { setShowAddPanel(!showAddPanel); setShowCustomCreator(false); }}
                  className="flex items-center justify-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent p-4 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M5 12h14" /><path d="M12 5v14" />
                  </svg>
                  Add Member
                </button>
              )}

              <button
                onClick={() => { setShowCustomCreator(!showCustomCreator); setShowAddPanel(false); }}
                className="flex items-center justify-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent p-4 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
                </svg>
                Create Custom
              </button>
            </div>

            {showAddPanel && selectedCouncil.id !== "custom" && (() => {
              const activeIds = new Set(activeMembers.map((m) => m.id));
              const matchSearch = (m: CouncilMember) => !memberSearch || m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.role.toLowerCase().includes(memberSearch.toLowerCase()) || m.description.toLowerCase().includes(memberSearch.toLowerCase());

              const suggested = selectedCouncil.members
                .filter((m) => !activeIds.has(m.id))
                .filter(matchSearch);

              const seenAll = new Set([...activeIds, ...selectedCouncil.members.map((m) => m.id)]);
              const allPool: CouncilMember[] = [];
              for (const c of councils) {
                if (c.id === "custom") continue;
                for (const m of c.members) {
                  if (!seenAll.has(m.id)) { allPool.push(m); seenAll.add(m.id); }
                }
              }
              for (const m of universalMembers) {
                if (!seenAll.has(m.id)) { allPool.push(m); seenAll.add(m.id); }
              }
              const allFiltered = allPool.filter(matchSearch);

              const communityPool: CouncilMember[] = communityMembers
                .filter((cm) => !activeIds.has(`community-${cm.id}`))
                .filter((cm) => !memberSearch || cm.name.toLowerCase().includes(memberSearch.toLowerCase()) || cm.role.toLowerCase().includes(memberSearch.toLowerCase()) || cm.description.toLowerCase().includes(memberSearch.toLowerCase()))
                .sort((a, b) => b.upvotes - a.upvotes)
                .map((cm) => ({
                  id: `community-${cm.id}`,
                  name: cm.name,
                  role: cm.role,
                  emoji: cm.emoji,
                  description: cm.description,
                  isDefault: false,
                  isRequired: false,
                  prompt: cm.systemPrompt || `You are ${cm.name}, a ${cm.role}. ${cm.description}\n\nFocus areas: ${cm.expertise}`,
                }));

              const isCommunityMember = (id: string) => id.startsWith("community-");

              const memberBtn = (member: CouncilMember) => (
                <button
                  key={member.id}
                  onClick={() => addMember(member)}
                  disabled={activeMembers.length >= MAX_MEMBERS}
                  className="flex items-center gap-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3 text-left hover:border-zinc-400 dark:hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">{member.emoji}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{member.name}</p>
                      {isCommunityMember(member.id) && (
                        <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                          Community
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">{member.description}</p>
                  </div>
                </button>
              );

              return (
              <>
              {/* Mobile: full-screen overlay */}
              <div className="fixed inset-0 z-50 flex flex-col bg-zinc-50 dark:bg-zinc-950 sm:hidden">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Add Member</h3>
                  <button
                    onClick={() => { setShowAddPanel(false); setMemberSearch(""); }}
                    className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 text-zinc-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Search all members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    autoFocus
                  />
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <div className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Official</h4>
                      <span className="text-xs text-zinc-400 dark:text-zinc-600">Curated</span>
                    </div>
                    {suggested.length > 0 && (
                      <>
                        <p className="mb-2 text-xs text-zinc-500">Suggested for this council</p>
                        <div className="grid gap-2 mb-4">
                          {suggested.map(memberBtn)}
                        </div>
                        {allFiltered.length > 0 && <p className="mb-2 text-xs text-zinc-500">All others</p>}
                      </>
                    )}
                    <div className="grid gap-2">
                      {allFiltered.map(memberBtn)}
                    </div>
                    {allFiltered.length === 0 && suggested.length === 0 && (
                      <p className="text-sm text-zinc-400 dark:text-zinc-600">No official members match &ldquo;{memberSearch}&rdquo;</p>
                    )}
                  </div>
                  {communityPool.length > 0 && (
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">Community</h4>
                        <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                          User Submitted
                        </span>
                      </div>
                      <div className="grid gap-2">
                        {communityPool.map(memberBtn)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop: inline panel */}
              <div className="mb-8 hidden sm:block rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-4">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search all members..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                    autoFocus
                  />
                </div>
                <div className="mb-5">
                  <div className="mb-3 flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Official</h4>
                    <span className="text-xs text-zinc-400 dark:text-zinc-600">Curated · {allFiltered.length + suggested.length} available</span>
                  </div>
                  {suggested.length > 0 && (
                    <>
                      <p className="mb-2 text-xs text-zinc-500">Suggested for this council</p>
                      <div className="grid gap-2 sm:grid-cols-2 mb-4">
                        {suggested.map(memberBtn)}
                      </div>
                      {allFiltered.length > 0 && <p className="mb-2 text-xs text-zinc-500">All others</p>}
                    </>
                  )}
                  <div className="grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto">
                    {allFiltered.map(memberBtn)}
                  </div>
                  {allFiltered.length === 0 && suggested.length === 0 && (
                    <p className="text-sm text-zinc-400 dark:text-zinc-600">No official members match &ldquo;{memberSearch}&rdquo;</p>
                  )}
                </div>
                {communityPool.length > 0 && (
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400">Community</h4>
                      <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                        User Submitted
                      </span>
                      <span className="text-xs text-amber-500/60">· {communityPool.length} available</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto">
                      {communityPool.map(memberBtn)}
                    </div>
                  </div>
                )}
              </div>
              </>
              );
            })()}

            {showCustomCreator && (
              <div className="mb-8">
                <CustomMemberCreator
                  onAdd={(member) => {
                    setActiveMembers((prev) => [...prev, member]);
                    setShowCustomCreator(false);
                  }}
                  onCancel={() => setShowCustomCreator(false)}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Output */}
        {step === "output" && selectedCouncil && (
          <div className="animate-fade-in">
            <div className="mb-6 text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                {getCustomizedMembers().map((m) => (
                  <span key={m.id} className="text-2xl" title={m.name}>{m.emoji}</span>
                ))}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Your Council
              </h2>
              <p className="text-zinc-500">
                {activeMembers.length} advisors ready to work · Copy and paste into your AI tool
              </p>
            </div>

            <div className="mb-6 flex justify-center">
              <button
                onClick={copyOutput}
                className={`rounded-lg px-10 py-3.5 text-base font-semibold transition-all duration-200 active:scale-95 ${
                  copied
                    ? "bg-green-600 text-white scale-105"
                    : "bg-amber-500 text-white hover:bg-amber-400"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy All"}
              </button>
            </div>

            <div className="mb-6 space-y-2">
              {getCustomizedMembers().map((m) => (
                <div key={m.id} className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                  <button
                    onClick={() => setExpandedOutputMember(expandedOutputMember === m.id ? null : m.id)}
                    className="flex w-full items-center justify-between p-3.5 text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{m.emoji}</span>
                      <div>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{m.name}</span>
                        <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-600">{m.role}</span>
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-zinc-400 dark:text-zinc-600 transition-transform ${expandedOutputMember === m.id ? "rotate-180" : ""}`}>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {expandedOutputMember === m.id && (
                    <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-3">
                      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{m.prompt}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-3">
              <button
                onClick={downloadOutput}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                ↓ Download .md
              </button>
              <button
                onClick={copyShareLink}
                className={`rounded-lg border px-4 sm:px-6 py-2.5 text-sm ${
                  shareCopied
                    ? "border-green-600 text-green-600 dark:text-green-400"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {shareCopied ? "✓ Link Copied!" : "Share Council"}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just built a ${selectedCouncil.name} advisory council on RunCouncil`)}&url=${encodeURIComponent("https://runcouncil.com")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-800 dark:border-zinc-200 bg-zinc-900 dark:bg-white px-4 sm:px-6 py-2.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 flex items-center gap-1.5"
              >
                𝕏 Share
              </a>
              <button
                onClick={() => setStep("members")}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Edit Members
              </button>
              <button
                onClick={() => { setStep("select"); setSelectedCouncil(null); setActiveMembers([]); }}
                className="text-sm text-zinc-500 underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300 hover:underline"
              >
                New Council
              </button>
            </div>

            {nextStepDone && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-5 dark:border-green-900/50 dark:bg-green-950/20">
                <h3 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-400">✓ Copied. Now paste it into ChatGPT, Claude, or whatever you use.</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "ChatGPT", url: "https://chat.openai.com" },
                    { name: "Claude", url: "https://claude.ai" },
                    { name: "Gemini", url: "https://gemini.google.com" },
                  ].map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      Open {tool.name} →
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Get more out of every session</h3>
                <p className="text-sm text-zinc-500">How to prompt your council, when to push back, and what most people miss.</p>
              </div>
              <a href="/guide" className="shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100">
                Read the Guide →
              </a>
            </div>

            <div className="mt-8">
              <EmailCapture />
            </div>
          </div>
        )}
      </div>

      {/* Sticky Generate */}
      {step === "members" && selectedCouncil && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {activeMembers.length}/{MAX_MEMBERS} members
              {activeMembers.length < 2 && <span className="text-zinc-400 dark:text-zinc-600"> · Add at least 2</span>}
              {activeMembers.length >= MAX_MEMBERS && <span className="text-amber-500"> · Council full</span>}
            </p>
            <button
              onClick={generate}
              disabled={activeMembers.length < 2}
              className="rounded-lg bg-amber-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Generate Council →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function BuildPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <BuildPageInner />
    </Suspense>
  );
}
