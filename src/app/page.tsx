"use client";

import { useState, useCallback, useEffect } from "react";
import { mergedCouncils as councils, customCouncil, universalMembers, CouncilType, CouncilMember, generateCouncilOutput } from "@/data/merged-councils";
import CustomMemberCreator from "@/components/CustomMemberCreator";
import EmailCapture from "@/components/EmailCapture";
import { buildShareUrl } from "@/lib/share";
import CouncilConfigurator, { COUNCIL_CONFIGS } from "@/components/CouncilConfigurator";
import { applyPromptModifiers, getRecommendedMembers } from "@/data/prompt-modifiers";
import { templates } from "@/data/templates";

type Step = "select" | "context" | "members" | "output";

const FEATURED_IDS = ["startup", "health", "career", "investment"];

export default function Home() {
  const [step, setStep] = useState<Step>("select");
  const [selectedCouncil, setSelectedCouncil] = useState<CouncilType | null>(null);
  const [activeMembers, setActiveMembers] = useState<CouncilMember[]>([]);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showCustomCreator, setShowCustomCreator] = useState(false);
  const [showAllCouncils, setShowAllCouncils] = useState(false);
  const [expandedOutputMember, setExpandedOutputMember] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [nextStepDone, setNextStepDone] = useState(false);
  const [configAnswers, setConfigAnswers] = useState<Record<string, string>>({});
  const [configScales, setConfigScales] = useState<Record<string, number>>({});
  const [isDark, setIsDark] = useState(false);

  // Prevent scroll restoration issues on mobile
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Load template from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get("template");
    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        // Find the council category
        const categoryMap: Record<string, string> = {
          Startup: "startup", Health: "health", Career: "career",
          Investment: "investment", Creative: "creative", Parenting: "parenting", Life: "life",
        };
        const councilId = categoryMap[template.category];
        const council = councils.find((c) => c.id === councilId);
        if (council) {
          setSelectedCouncil(council);
          // Find matching members by ID
          const allMembers = [...council.members, ...universalMembers];
          const selected = template.memberIds
            .map((id) => allMembers.find((m) => m.id === id))
            .filter(Boolean) as CouncilMember[];
          if (selected.length > 0) setActiveMembers(selected);
          setStep("members");
          // Clean URL
          window.history.replaceState({}, "", "/");
        }
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  }, []);

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

  // Clipboard fallback for non-HTTPS (LAN dev)
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback: create a textarea and use execCommand
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
        // Last resort: prompt user to copy manually
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
    <main className="min-h-screen pb-24 bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800/50 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => { setStep("select"); setSelectedCouncil(null); setActiveMembers([]); }}
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            RunCouncil
          </button>
          <div className="flex items-center gap-4">
            <a href="/templates" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
              Templates
            </a>
            <a href="/guide" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
              Guide
            </a>
            {step === "context" && (
              <button onClick={goBack} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                ← Council Types
              </button>
            )}
            {step === "members" && (
              <button onClick={goBack} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                {selectedCouncil && COUNCIL_CONFIGS[selectedCouncil.id] ? "← About You" : "← Council Types"}
              </button>
            )}
            {step === "output" && (
              <button onClick={goBack} className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                ← Edit Members
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress indicator — #8: wider connectors, #9: always show labels */}
      {step !== "select" && (
        <div className="mx-auto max-w-5xl px-6 pt-6">
          <div className="flex items-center gap-1 sm:gap-2">
            {stepLabels.map((label, i) => (
              <div key={label} className="flex items-center gap-1 sm:gap-2">
                <div className={`flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium whitespace-nowrap ${
                  i <= adjustedIndex
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                }`}>
                  <span>{i + 1}</span>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label === "About You" ? "You" : label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`h-px w-4 sm:w-10 ${i < adjustedIndex ? "bg-zinc-400 dark:bg-zinc-500" : "bg-zinc-200 dark:bg-zinc-800"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-5 sm:py-8">
        {/* Step 1: Select */}
        {step === "select" && (
          <div>
            <div className="mb-5 sm:mb-8 text-center">
              <h1 className="mb-1.5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                Build your council
              </h1>
              <p className="mx-auto max-w-xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                Pick your advisors. Ask the hard question. Let them argue.
              </p>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {featuredCouncils.map((council) => (
                <button
                  key={council.id}
                  onClick={() => selectCouncil(council)}
                  className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3 sm:p-4 text-left hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <div className="mb-1.5 sm:mb-2 text-2xl sm:text-3xl">{council.emoji}</div>
                  <h3 className="text-sm sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {council.name}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm italic text-zinc-400 sm:text-zinc-500 line-clamp-1 sm:line-clamp-none">&ldquo;{council.description}&rdquo;</p>
                  <p className="hidden sm:block mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {council.tagline}
                  </p>
                  <div className="mt-2 text-xs text-zinc-300 dark:text-zinc-700 text-right">→</div>
                </button>
              ))}
            </div>

            {/* #6: Browse all as outlined pill button */}
            {!showAllCouncils ? (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAllCouncils(true)}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 dark:hover:text-zinc-100 dark:hover:border-zinc-600"
                >
                  See all {councils.length} councils →
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                  {otherCouncils.map((council) => (
                    <button
                      key={council.id}
                      onClick={() => selectCouncil(council)}
                      className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3 sm:p-4 text-left hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <div className="mb-1 sm:mb-2 text-2xl sm:text-3xl">{council.emoji}</div>
                      <h3 className="text-sm sm:text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                        {council.name}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm italic text-zinc-400 sm:text-zinc-500 line-clamp-1 sm:line-clamp-none">&ldquo;{council.description}&rdquo;</p>
                      <p className="hidden sm:block mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        {council.tagline}
                      </p>
                      <div className="mt-2 text-xs text-zinc-300 dark:text-zinc-700 text-right">→</div>
                    </button>
                  ))}
                  <button
                    onClick={() => selectCouncil(customCouncil)}
                    className="group rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent p-3 sm:p-4 text-left hover:border-zinc-400 dark:hover:border-zinc-600"
                  >
                    <div className="mb-1 sm:mb-2 text-2xl sm:text-3xl">{customCouncil.emoji}</div>
                    <h3 className="text-sm sm:text-lg font-semibold tracking-tight text-zinc-500">{customCouncil.name}</h3>
                    <p className="hidden sm:block text-sm text-zinc-400 dark:text-zinc-600">{customCouncil.description}</p>
                    <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-600">{customCouncil.tagline}</p>
                  </button>
                </div>
              </div>
            )}

            {/* #7: mt-10, bold brand names */}
            {/* How it works */}
            <div className="mt-16 mb-12">
              <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                How it works
              </h2>
              <div className="grid gap-8 sm:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">1</div>
                  <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">Pick a council</h3>
                  <p className="text-sm text-zinc-500">Startup, health, career, investing — or build your own from scratch.</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">2</div>
                  <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">Customize your advisors</h3>
                  <p className="text-sm text-zinc-500">Add, remove, or create members. Tune how aggressive or conservative they think.</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">3</div>
                  <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">Copy → Paste → Done</h3>
                  <p className="text-sm text-zinc-500">Grab the prompt and drop it into ChatGPT, Claude, or Gemini. Your council is ready.</p>
                </div>
              </div>
            </div>

            {/* Guide CTA */}
            <div className="mb-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">See what a council actually looks like</h3>
                <p className="text-sm text-zinc-500">Real examples, best practices, and the mistakes that make councils useless.</p>
              </div>
              <a href="/guide" className="shrink-0 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                Read the Guide →
              </a>
            </div>

            <div className="mt-10 text-center text-sm text-zinc-400 dark:text-zinc-600">
              <p>Works with <span className="font-medium">ChatGPT</span>, <span className="font-medium">Claude</span>, <span className="font-medium">Gemini</span> — bring your own model.</p>
            </div>
          </div>
        )}

        {/* Step 2: About You — #10: consistent spacing */}
        {step === "context" && selectedCouncil && (
          <div key={`context-${selectedCouncil.id}`}>
            <div className="mb-8">
              <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {selectedCouncil.emoji} What&apos;s the decision?
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
                  // Auto-add recommended members based on config answers
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
                className="rounded-lg bg-zinc-900 px-8 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Next: Choose Members →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Members — #11: card shadows */}
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
                  {member.isRequired && (
                    <span className="mt-2 inline-block rounded-full bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">
                      Required
                    </span>
                  )}
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

              // Suggested: council specialists not yet added
              const suggested = selectedCouncil.members
                .filter((m) => !activeIds.has(m.id))
                .filter(matchSearch);

              // All: every member across all councils + universal, deduplicated, excluding active + suggested
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

              const memberBtn = (member: CouncilMember) => (
                <button
                  key={member.id}
                  onClick={() => addMember(member)}
                  disabled={activeMembers.length >= MAX_MEMBERS}
                  className="flex items-center gap-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3 text-left hover:border-zinc-400 dark:hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">{member.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{member.name}</p>
                    <p className="text-xs text-zinc-500">{member.description}</p>
                  </div>
                </button>
              );

              return (
              <div className="mb-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-4">
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

                {suggested.length > 0 && (
                  <>
                    <h4 className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Suggested</h4>
                    <div className="grid gap-2 sm:grid-cols-2 mb-5">
                      {suggested.map(memberBtn)}
                    </div>
                  </>
                )}

                <h4 className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">All <span className="text-xs text-zinc-400 dark:text-zinc-600">— {allFiltered.length + suggested.length} available</span></h4>
                <div className="grid gap-2 sm:grid-cols-2 max-h-80 overflow-y-auto">
                  {allFiltered.map(memberBtn)}
                  {allFiltered.length === 0 && suggested.length === 0 && (
                    <p className="text-sm text-zinc-400 dark:text-zinc-600 col-span-2">No members match &ldquo;{memberSearch}&rdquo;</p>
                  )}
                </div>
              </div>
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

        {/* Step 4: Output — #13: bigger copy button, #14: quieter New Council */}
        {step === "output" && selectedCouncil && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Your {selectedCouncil.name} council is ready to work
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                {activeMembers.length} advisors · Review, copy, paste into your AI tool.
              </p>
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

            {/* Actions — #13: Copy All is hero, #14: New Council is quiet */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={copyOutput}
                className={`rounded-lg px-8 py-3 text-sm font-semibold ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy All"}
              </button>
              <button
                onClick={downloadOutput}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-6 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                ↓ Download .md
              </button>
              <button
                onClick={copyShareLink}
                className={`rounded-lg border px-6 py-2.5 text-sm ${
                  shareCopied
                    ? "border-green-600 text-green-600 dark:text-green-400"
                    : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {shareCopied ? "✓ Link Copied!" : "Share Council"}
              </button>
              <button
                onClick={() => setStep("members")}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-6 py-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
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

      {/* Sticky Generate — #12: stronger shadow */}
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
              className="rounded-lg bg-zinc-900 px-8 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Generate Council →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
