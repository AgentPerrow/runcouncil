import { list, put, get } from "@vercel/blob";

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
    const blob = await get(blobs[0].url, { access: "private" });
    if (!blob || blob.statusCode !== 200) return [];
    const resp = new Response(blob.stream!);
    return resp.json();
  } catch (e) {
    console.error("getCommunityMembers error:", e);
    return [];
  }
}

export async function saveCommunityMembers(members: CommunityMember[]): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(members), {
    access: "private",
    addRandomSuffix: false, allowOverwrite: true,
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
