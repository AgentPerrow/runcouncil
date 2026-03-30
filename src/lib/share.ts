import { CouncilMember } from "@/data/councils";

interface ShareableConfig {
  councilId: string;
  members: {
    id: string;
    // Custom members need full data
    custom?: {
      name: string;
      role: string;
      emoji: string;
      description: string;
      prompt: string;
    };
  }[];
}

export function encodeCouncilConfig(
  councilId: string,
  members: CouncilMember[]
): string {
  const config: ShareableConfig = {
    councilId,
    members: members.map((m) => {
      if (m.id.startsWith("custom-")) {
        return {
          id: m.id,
          custom: {
            name: m.name,
            role: m.role,
            emoji: m.emoji,
            description: m.description,
            prompt: m.prompt,
          },
        };
      }
      return { id: m.id };
    }),
  };

  const json = JSON.stringify(config);
  // Use base64url encoding for URL safety
  const encoded = btoa(json)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return encoded;
}

export function decodeCouncilConfig(encoded: string): ShareableConfig | null {
  try {
    // Restore base64 padding
    const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    return JSON.parse(json) as ShareableConfig;
  } catch {
    return null;
  }
}

export function buildShareUrl(councilId: string, members: CouncilMember[]): string {
  const encoded = encodeCouncilConfig(councilId, members);
  return `${window.location.origin}/c/${encoded}`;
}
