import type { DurationType, RangeType, Roll } from "../types";
import type { Class } from "./PlayerCharacter";

export type SpellTier = 1 | 2 | 3 | 4 | 5;

export type Spell = {
  name: string;
};

export type SpellInfo = {
  name: string;
  class: Extract<Class, "Wizard" | "Priest"> | "PriestWizard";
  tier: SpellTier;
  range: RangeType;
  duration: {
    type: DurationType;
    subType?: "InGame" | "RealTime"; // default to InGame time
    roll?: Roll;
    amt?: number;
  };
  desc: string;
};
