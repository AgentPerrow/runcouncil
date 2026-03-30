import { NextRequest, NextResponse } from "next/server";

// Simple email capture — stores in Vercel KV or falls back to in-memory for now
// Swap this for Loops.so / Resend / Buttondown when ready

const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // For now, log to stdout (Vercel captures this in logs)
    // Replace with Loops/Resend/Buttondown API call
    console.log(`[SUBSCRIBE] ${trimmed} at ${new Date().toISOString()}`);
    subscribers.add(trimmed);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
