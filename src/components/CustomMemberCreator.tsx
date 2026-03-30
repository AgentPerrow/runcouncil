"use client";

import { useState } from "react";
import { CouncilMember } from "@/data/councils";

interface Props {
  onAdd: (member: CouncilMember) => void;
  onCancel: () => void;
}

const EMOJI_OPTIONS = [
  "🧠", "💡", "🔮", "🎯", "🛡️", "⚡", "🔬", "📐", "🌍", "🎪",
  "🦊", "🐺", "🦅", "🧙", "👁️", "💎", "🔥", "🌊", "⭐", "🏛️",
];

const ROLE_SUGGESTIONS = [
  "Industry Expert",
  "Customer Advocate", 
  "Operations Manager",
  "Brand Strategist",
  "Data Scientist",
  "Product Manager",
  "HR / People Lead",
  "Partnerships Lead",
  "Supply Chain Expert",
  "Investor Relations",
  "Community Manager",
  "Ethics Advisor",
  "Futurist",
  "Customer Success",
  "Pricing Strategist",
];

export default function CustomMemberCreator({ onAdd, onCancel }: Props) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [emoji, setEmoji] = useState("🧠");
  const [description, setDescription] = useState("");
  const [expertise, setExpertise] = useState("");
  const [question, setQuestion] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [step, setStep] = useState<"info" | "details" | "preview">("info");

  const generatePrompt = () => {
    const expertiseList = expertise
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    return `You are the ${name} on this advisory council. ${description}

## Your Question
"${question || `What does ${role.toLowerCase()} expertise tell us about this?`}"

## Focus
${expertiseList.length > 0 ? expertiseList.map((e) => `- ${e}`).join("\n") : `- ${role} strategy and best practices\n- Risk assessment in your domain\n- Actionable recommendations\n- Industry-specific insights`}

## Output Format
1. **Assessment** — your expert read on the situation
2. **Recommendation** — specific, actionable guidance from your domain
3. **Risks** — what could go wrong in your area of expertise
4. **Key insight** — the one thing others might miss

## Rules
- Stay in your lane — only advise on ${role.toLowerCase()} matters
- Be specific and actionable, not generic
- Maximum 5 bullets per section
- End every response with Confidence (High/Medium/Low) and what would change the answer`;
  };

  const handleCreate = () => {
    const member: CouncilMember = {
      id: `custom-${Date.now()}`,
      name,
      role,
      emoji,
      description: description || `Custom ${role} advisor.`,
      isDefault: false,
      isRequired: false,
      prompt: generatePrompt(),
    };
    onAdd(member);
  };

  const canProceedToDetails = name.trim() && role.trim();
  const canProceedToPreview = canProceedToDetails;

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Create Custom Member</h3>
        <button
          onClick={onCancel}
          className="text-zinc-500 hover:text-zinc-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Step indicators */}
      <div className="mb-6 flex gap-2">
        {["info", "details", "preview"].map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${
              (s === "info" && step === "info") ||
              (s === "details" && (step === "details" || step === "preview")) ||
              (s === "preview" && step === "preview")
                ? "bg-white"
                : "bg-zinc-800"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === "info" && (
        <div className="space-y-4">
          {/* Emoji Picker */}
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">Icon</label>
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-2xl hover:border-zinc-500"
              >
                {emoji}
              </button>
              {showEmojiPicker && (
                <div className="absolute left-0 top-14 z-10 grid grid-cols-10 gap-1 rounded-lg border border-zinc-700 bg-zinc-800 p-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      onClick={() => {
                        setEmoji(e);
                        setShowEmojiPicker(false);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded hover:bg-zinc-700"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">Member Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Supply Chain Expert"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">Role / Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Logistics & Operations"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ROLE_SUGGESTIONS.slice(0, 8).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setRole(suggestion);
                    if (!name) setName(suggestion);
                  }}
                  className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep("details")}
            disabled={!canProceedToDetails}
            className="mt-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === "details" && (
        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">
              Description <span className="text-zinc-600">(what does this member do?)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`e.g. Brings deep expertise in ${role.toLowerCase() || "their domain"}, focusing on practical, actionable advice.`}
              rows={2}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500"
            />
          </div>

          {/* Core Question */}
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">
              Core Question <span className="text-zinc-600">(what do they ask themselves?)</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`e.g. "What does the ${role.toLowerCase() || "data"} tell us?"`}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500"
            />
          </div>

          {/* Expertise Areas */}
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">
              Focus Areas <span className="text-zinc-600">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="e.g. Logistics optimization, Vendor management, Cost reduction"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("info")}
              className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm text-zinc-300 hover:border-zinc-500"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep("preview")}
              disabled={!canProceedToPreview}
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Preview →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === "preview" && (
        <div className="space-y-4">
          {/* Preview Card */}
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">{emoji}</span>
              <div>
                <h4 className="font-semibold text-white">{name}</h4>
                <p className="text-sm text-zinc-400">{role}</p>
              </div>
            </div>
            <p className="mb-3 text-sm text-zinc-400">
              {description || `Custom ${role} advisor.`}
            </p>
          </div>

          {/* Prompt Preview */}
          <div>
            <label className="mb-1.5 block text-sm text-zinc-400">Generated Prompt</label>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-400">
                {generatePrompt()}
              </pre>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("details")}
              className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm text-zinc-300 hover:border-zinc-500"
            >
              ← Edit
            </button>
            <button
              onClick={handleCreate}
              className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
            >
              ✓ Add to Council
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
