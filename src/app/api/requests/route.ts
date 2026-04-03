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

// GET — return all requests
export async function GET() {
  const requests = await getRequests();
  return NextResponse.json(requests);
}

// POST — create a new request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, council, expertise, problem } = body;

    if (!title || !council || !expertise || !problem) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // Basic sanitization — limit lengths
    if (title.length > 100 || expertise.length > 500 || problem.length > 500) {
      return NextResponse.json({ error: "Fields too long" }, { status: 400 });
    }

    const requests = await getRequests();

    const newRequest: ExpertRequest = {
      id: crypto.randomUUID(),
      title: title.trim(),
      council,
      expertise: expertise.trim(),
      problem: problem.trim(),
      upvotes: 0,
      createdAt: new Date().toISOString(),
      status: "approved", // auto-approve for now, add moderation later
    };

    requests.push(newRequest);
    await saveRequests(requests);

    return NextResponse.json(newRequest, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
