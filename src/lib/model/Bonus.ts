import type { Merge } from "../types";

export type BonusTo =
  | "hpRoll"
  | "attackRoll"
  | "spellcastRoll"
  | "damageRoll"
  | "gearSlots"
  | "statRoll"
  | "stat"
  | "armorClass"
  | "initiativeRoll"
  | "talentRoll"
  | "backstabDice";

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

export type BonusMetaData = WeaponBonusMetaData | ArmorBonusMetaData;

export type GenericBonus = {
  name: string;
  desc: string;
  bonusSource?: BonusSourceType;
  bonusType: "generic";
  metadata?: BonusMetaData;
};

export type ModifyBonus = Merge<
  GenericBonus,
  {
    bonusType: "modifyAmt";
    bonusTo: BonusTo;
    bonusAmount: number;
  }
>;

export type AdvantageBonus = Merge<
  GenericBonus,
  {
    bonusType: "advantage";
    bonusTo: BonusTo;
  }
>;

export type DisadvantageBonus = Merge<
  GenericBonus,
  {
    bonusTo: BonusTo;
    bonusType: "disadvantage";
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
