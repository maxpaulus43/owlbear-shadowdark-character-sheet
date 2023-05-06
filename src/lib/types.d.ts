import {
  WEAPON_TYPES,
  WEAPON_PROPERTIES,
  ALIGNMENTS,
  DEITIES,
  BACKGROUNDS,
  TIME_UNITS,
  TITLES,
  CLASSES,
  ANCESTRIES,
  LANGUAGES,
  STATS,
  BONUS_TOS,
  ROLL_BONUS_TOS,
  SHIELD_PROPERTIES,
  GEAR_TYPES,
  NUMERICAL_BONUS_TOS
} from "./constants";

export type Merge<T, R> = Omit<T, keyof R> & R;

export type DiceType = (typeof DICE_TYPES)[number];
export type RangeType = (typeof RANGE_TYPES)[number];
export type TimeUnit = (typeof TIME_UNITS)[number];
export type DurationSubType = "InGame" | "RealTime";
export type DurationType = "Focus" | "Instant" | TimeUnit;
export type Roll = {
  diceType: DiceType;
  numDice: number;
};


///// Talent
export type GenericTalent = {
  name: string;
  type: "generic";
};
export type BonusTalent = Merge<
  GenericTalent,
  {
    type: "bonus";
    bonuses: Bonus[];
  }
>;
export type ChooseBonusTalent = Merge<
  GenericTalent,
  {
    type: "chooseBonus";
    choices: (Bonus | Bonus[])[];
  }
>;
export type Talent = GenericTalent | BonusTalent | ChooseBonusTalent;

///// Spell
export type SpellTier = 1 | 2 | 3 | 4 | 5;
export type Spell = {
  name: string;
};
export type SpellClass = Extract<Class, "Wizard" | "Priest"> | "PriestWizard" | "Other";
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

///// PlayerCharacter
export type Alignment = (typeof ALIGNMENTS)[number];
export type Deity = (typeof DEITIES)[number];
export type Background = (typeof BACKGROUNDS)[number];
export type Class = (typeof CLASSES)[number];
export type Title = (typeof TITLES)[number];
export type Ancestry = (typeof ANCESTRIES)[number];
export type Language = (typeof LANGUAGES)[number];
export type Stat = (typeof STATS)[number];
export type StatBlock = {
  [key in Stat]: number;
};
export type PlayerCharacter = {
  name: string;
  ancestry: Ancestry;
  class?: Class | "";
  hasCustomClass?: boolean;
  level: number;
  title: Title;
  alignment: Alignment;
  background: Background;
  deity: Deity;
  gear: Gear[];
  customGear: GearInfo[];
  notes: string;
  stats: StatBlock;
  bonuses: Bonus[];
  customBonuses: Bonus[];
  customTalents: Talent[];
  maxHitPoints: number;
  armorClass: number;
  gearSlotsTotal: number;
  gold: number;
  silver: number;
  copper: number;
  languages: string[];
  customLanguages: string[];
  xp: number;
  spells: Spell[];
  customSpells: SpellInfo[];
  hitPoints: number;
};


/////// Bonus
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


///// ShadowDarklings
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

///// Gear
export type Cost = { gp: number; sp: number; cp: number };
export type Currency = keyof Cost;
export type GearProperty =
  | ShieldProperty
  | WeaponProperty
  | "Magic"
  | "Attackable"; // attackable means it can show up in the attacks view
export type GearType = (typeof GEAR_TYPES)[number];
export type GearInfo = {
  name: string;
  properties?: GearProperty[];
  type: GearType;
  canBeEquipped: boolean;
  slots: { perSlot: number; slotsUsed: number; freeCarry: number };
  cost: Cost;
  desc?: string;
  playerBonuses?: Bonus[];
  editable?: boolean;
};
export type Gear = {
  name: string;
  quantity: number;
  equipped?: boolean;
};

///// Weapon
export type WeaponType = (typeof WEAPON_TYPES)[number];
export type WeaponProperty = (typeof WEAPON_PROPERTIES)[number];
export type WeaponInfo = Merge<
  GearInfo,
  {
    type: "Weapon";
    properties?: WeaponProperty[];
    damage: {
      oneHanded?: Roll;
      twoHanded?: Roll;
    };
    range: RangeType | RangeType[];
    weaponType: WeaponType;
  }
>;

////// Armor
export type ShieldProperty = (typeof SHIELD_PROPERTIES)[number];
export type ArmorAC = {
  base: number;
  modifier: number;
  stat?: Stat;
};
export type ArmorInfo = Merge<
  GearInfo,
  {
    type: "Armor";
    ac: ArmorAC;
  }
>;