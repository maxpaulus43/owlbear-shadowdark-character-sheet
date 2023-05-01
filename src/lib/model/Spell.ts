import type { DurationSubType, DurationType, RangeType, Roll } from "../types";
import type { Class, Stat } from "./PlayerCharacter";

export type SpellTier = 1 | 2 | 3 | 4 | 5;

export type Spell = {
  name: string;
};

export type SpellClass = Extract<Class, "Wizard" | "Priest"> | "PriestWizard";

export type SpellInfo = {
  name: string;
  class: SpellClass;
  stat?: Stat;
  tier: SpellTier;
  range: RangeType;
  duration: {
    type: DurationType;
    subType?: DurationSubType; // default to InGame time
    roll?: Roll;
    amt?: number;
  };
  editable?: boolean;
  desc: string;
};
