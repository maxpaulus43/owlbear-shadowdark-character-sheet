import type { Merge } from "../types";
import type { Stat } from "./PlayerCharacter";
import type { WeaponType } from "./Weapon";

export const BONUS_TOS = [
  "hpRoll",
  "attackRoll",
  "spellcastRoll",
  "damageRoll",
  "gearSlots",
  "statRoll",
  "stat",
  "armorClass",
  "initiativeRoll",
  "talentRoll",
  "backstabDice",
  "hp",
] as const;

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
  }
>;

export type AdvantageBonus = Merge<
  GenericBonus,
  {
    type: "advantage";
    bonusTo: BonusTo;
  }
>;

export type DisadvantageBonus = Merge<
  GenericBonus,
  {
    bonusTo: BonusTo;
    type: "disadvantage";
  }
>;

export type Bonus =
  | GenericBonus
  | ModifyBonus
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
