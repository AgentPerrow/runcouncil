import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCommunityMembers, saveCommunityMembers, ADMIN_EMAILS } from "@/lib/community";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id, action } = await req.json();
    if (!id || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const members = await getCommunityMembers();
    const idx = members.findIndex((m) => m.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    members[idx].status = action === "approve" ? "approved" : "rejected";
    await saveCommunityMembers(members);

    return NextResponse.json(members[idx]);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
