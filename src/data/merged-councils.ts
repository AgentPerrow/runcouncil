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
import {
  extraStartupMembers,
  extraHealthMembers,
  extraCareerMembers,
  extraInvestmentMembers,
  extraCreativeMembers,
  extraParentingMembers,
  extraLifeMembers,
  extraUniversalMembers,
} from "./extra-members";

// Map of council id → new members to add
const newMemberMap: Record<string, CouncilMember[]> = {
  startup: [...startupNewMembers, ...extraStartupMembers],
  health: [...healthNewMembers, ...extraHealthMembers],
  career: [...careerNewMembers, ...extraCareerMembers],
  investment: [...investmentNewMembers, ...extraInvestmentMembers],
  realestate: realEstateNewMembers,
  creative: [...creativeNewMembers, ...extraCreativeMembers],
  parenting: [...parentingNewMembers, ...extraParentingMembers],
  life: [...lifeNewMembers, ...extraLifeMembers],
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
const allUniversalMembers = [...universalMembers, ...extraUniversalMembers];
export { allUniversalMembers as universalMembers, customCouncil };
export type { CouncilType, CouncilMember };

// Re-export the output generator
export { generateCouncilOutput } from "./councils";
