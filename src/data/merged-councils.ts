// Merged council data — combines original councils with expanded specialist roster
import { councils as baseCouncils, customCouncil, CouncilType, CouncilMember } from "./councils";
import {
  startupNewMembers,
  healthNewMembers,
  careerNewMembers,
  investmentNewMembers,
  realEstateNewMembers,
  creativeNewMembers,
  parentingNewMembers,
  lifeNewMembers,
  universalMembers,
} from "./new-members";

// Map of council id → new members to add
const newMemberMap: Record<string, CouncilMember[]> = {
  startup: startupNewMembers,
  health: healthNewMembers,
  career: careerNewMembers,
  investment: investmentNewMembers,
  realestate: realEstateNewMembers,
  creative: creativeNewMembers,
  parenting: parentingNewMembers,
  life: lifeNewMembers,
};

// Merge new members into each council
export const mergedCouncils: CouncilType[] = baseCouncils.map((council) => {
  const additional = newMemberMap[council.id] || [];
  return {
    ...council,
    members: [...council.members, ...additional],
  };
});

// Export universal members for cross-council use
export { universalMembers, customCouncil };
export type { CouncilType, CouncilMember };

// Re-export the output generator
export { generateCouncilOutput } from "./councils";
