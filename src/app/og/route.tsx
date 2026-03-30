import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Council emoji row */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "32px",
            fontSize: "48px",
          }}
        >
          <span>🚀</span>
          <span>💪</span>
          <span>🎨</span>
          <span>💼</span>
          <span>📈</span>
          <span>👶</span>
          <span>⚖️</span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.03em",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            RunCouncil
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#a1a1aa",
              margin: 0,
              textAlign: "center",
            }}
          >
            Build your AI advisory board in 60 seconds.
          </p>
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px", color: "#52525b" }}>
            Free · No signup · Works with ChatGPT, Claude & Gemini
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
