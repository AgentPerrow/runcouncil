import { NextRequest, NextResponse } from "next/server";
import { list, put, get } from "@vercel/blob";

const BLOB_KEY = "requests.json";

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

async function getRequests(): Promise<ExpertRequest[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return [];
    const blob = await get(blobs[0].url, { access: "private" });
    if (!blob || blob.statusCode !== 200) return [];
    const resp = new Response(blob.stream!);
    return resp.json();
  } catch {
    return [];
  }
}

async function saveRequests(requests: ExpertRequest[]): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(requests), {
    access: "private",
    addRandomSuffix: false, allowOverwrite: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const requests = await getRequests();
    const idx = requests.findIndex((r) => r.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    requests[idx].upvotes += 1;
    await saveRequests(requests);

    return NextResponse.json({ upvotes: requests[idx].upvotes });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
