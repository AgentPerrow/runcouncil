import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCommunityMembers, saveCommunityMembers, CommunityMember } from "@/lib/community";

// GET — return community members (public: approved only, authed: include user's own)
export async function GET(req: NextRequest) {
  let session = null;
  try { session = await auth(); } catch {}
  const members = await getCommunityMembers();
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter"); // "mine" | "all" | "pending"
  const council = searchParams.get("council");

  let filtered = members;

  if (filter === "mine" && session?.user?.email) {
    filtered = filtered.filter((m) => m.submittedBy === session.user!.email);
  } else if (filter === "pending") {
    filtered = filtered.filter((m) => m.status === "pending");
  } else if (filter === "all") {
    // admin sees all — no filter
  } else {
    // Public: approved only
    filtered = filtered.filter((m) => m.status === "approved");
  }

  if (council) {
    filtered = filtered.filter((m) => m.council === council);
  }

  return NextResponse.json(filtered);
}

// POST — submit a new community member (requires auth)
export async function POST(req: NextRequest) {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    return NextResponse.json({ error: "Auth error: " + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
  }
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, role, emoji, description, expertise, systemPrompt, council } = body;

    if (!name || !role || !emoji || !description || !council) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    if (name.length > 80 || role.length > 100 || description.length > 500) {
      return NextResponse.json({ error: "Fields too long" }, { status: 400 });
    }

    const members = await getCommunityMembers();

    const newMember: CommunityMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role: role.trim(),
      emoji: emoji.trim(),
      description: description.trim(),
      expertise: (expertise || "").trim(),
      systemPrompt: (systemPrompt || "").trim(),
      council,
      status: "pending",
      upvotes: 0,
      submittedBy: session.user.email,
      submittedAt: new Date().toISOString(),
    };

    members.push(newMember);
    await saveCommunityMembers(members);

    return NextResponse.json(newMember, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
