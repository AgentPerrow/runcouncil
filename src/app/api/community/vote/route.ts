import { NextRequest, NextResponse } from "next/server";
import { getCommunityMembers, saveCommunityMembers } from "@/lib/community";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const members = await getCommunityMembers();
    const idx = members.findIndex((m) => m.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    members[idx].upvotes += 1;
    await saveCommunityMembers(members);

    return NextResponse.json({ upvotes: members[idx].upvotes });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
