import type { DiceType, Merge } from "../types";
import type { Stat } from "./PlayerCharacter";
import type { WeaponType } from "./Weapon";

export const NUMERICAL_BONUS_TOS = [
  "gearSlots",
  "stat",
  "armorClass",
  "backstabDice",
  "hp",
] as const;

export const ROLL_BONUS_TOS = [
  "hpRoll",
  "attackRoll",
  "spellcastRoll",
  "damageRoll",
  "statRoll",
  "initiativeRoll",
  "talentRoll",
] as const;

export const BONUS_TOS = [...NUMERICAL_BONUS_TOS, ...ROLL_BONUS_TOS] as const;

export type NumericalBonusTo = (typeof NUMERICAL_BONUS_TOS)[number];
export type RollBonusTo = (typeof ROLL_BONUS_TOS)[number];
export type BonusTo = (typeof BONUS_TOS)[number];

export type BonusSourceCategory = "Ability" | "Talent";
export type BonusSourceType = "Ancestry" | "Class" | "Gear";

export type WeaponBonusMetaData = {
  type: "weapon";
  weapon: string;
};

export type ArmorBonusMetaData = {
  type: "armor";
  armor: string;
};

export type WeaponTypeBonusMetaData = {
  type: "weaponType";
  weaponType: WeaponType;
};

export type StatBonusMetaData = {
  type: "stat";
  stat: Stat;
};

export type SpellBonusMetaData = {
  type: "spell";
  spell: string;
};

export type BonusMetaData =
  | WeaponBonusMetaData
  | WeaponTypeBonusMetaData
  | ArmorBonusMetaData
  | StatBonusMetaData
  | SpellBonusMetaData;

export type GenericBonus = {
  name: string;
  desc: string;
  bonusSource?: BonusSourceType;
  type: "generic";
  metadata?: BonusMetaData;
  editable?: boolean;
};

export type ModifyBonus = Merge<
  GenericBonus,
  {
    type: "modifyAmt";
    bonusTo: BonusTo;
    bonusAmount: number;
    bonusIncreaseRatePerLevel?: number; // bonus amount increases at this rate per level (rounded down)
  }
>;

export type DiceTypeBonus = Merge<
  GenericBonus,
  {
    type: "diceType";
    bonusTo: RollBonusTo;
    diceType: DiceType;
  }
>;

export type AdvantageBonus = Merge<
  GenericBonus,
  {
    type: "advantage";
    bonusTo: RollBonusTo;
  }
>;

export type DisadvantageBonus = Merge<
  GenericBonus,
  {
    bonusTo: RollBonusTo;
    type: "disadvantage";
  }
>;

export type Bonus =
  | GenericBonus
  | ModifyBonus
  | DiceTypeBonus
  | AdvantageBonus
  | DisadvantageBonus;

// shadowdarklings
export type SDBonus = {
  sourceType: BonusSourceType;
  sourceName: string;
  sourceCategory: BonusSourceCategory;
  gainedAtLevel: number;
  name: string;
  bonusName: string;
  bonusTo: string;
  bonusAmount: number;
};

function byType(b: Bonus, t: Bonus["type"]): boolean {
  return b.type === t;
}

export function groupBonusesByType(bonuses: Bonus[]) {
  return {
    diceType: bonuses.filter((b) => byType(b, "diceType")) as DiceTypeBonus[],
    generic: bonuses.filter((b) => byType(b, "generic")) as GenericBonus[],
    modifyAmt: bonuses.filter((b) => byType(b, "modifyAmt")) as ModifyBonus[],
    advantage: bonuses.filter((b) =>
      byType(b, "advantage")
    ) as AdvantageBonus[],
    disadvantage: bonuses.filter((b) =>
      byType(b, "disadvantage")
    ) as DisadvantageBonus[],
  };
}

export function isEqual(a: Bonus, b: Bonus) {
  return JSON.stringify(a) === JSON.stringify(b);
}
