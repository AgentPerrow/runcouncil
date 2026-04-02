import { list, put } from "@vercel/blob";

const BLOB_KEY = "community-members.json";

export interface CommunityMember {
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

export async function getCommunityMembers(): Promise<CommunityMember[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.json();
  } catch {
    return [];
  }
}

export async function saveCommunityMembers(members: CommunityMember[]): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(members), {
    access: "public",
    addRandomSuffix: false,
  });
}

export const ADMIN_EMAILS = ["agentperrow@gmail.com", "mperrow@gmail.com"];

export const COUNCIL_OPTIONS = [
  { value: "startup", label: "Startup" },
  { value: "health", label: "Health" },
  { value: "career", label: "Career" },
  { value: "investment", label: "Investment" },
  { value: "creative", label: "Creative" },
  { value: "parenting", label: "Parenting" },
  { value: "life", label: "Life" },
  { value: "realestate", label: "Real Estate" },
  { value: "other", label: "Other" },
];
