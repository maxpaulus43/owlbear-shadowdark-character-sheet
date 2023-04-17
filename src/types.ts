import armor from "./compendium/armor";
import basicGear from "./compendium/basic-gear";
import spells from "./compendium/spells";
import talents from "./compendium/talents";
import weapons from "./compendium/weapons";

export const ALIGNMENTS = ["Neutral", "Lawful", "Chaotic"] as const;

export const DEITIES = [
  "Saint Terragnis",
  "Gede",
  "Maderra The Covenant",
  "Ord",
  "Memnon",
  "Ramlaat",
  "Shune The Vile",
  "The Lost",
] as const;

export const BACKGROUNDS = [
  "Urchin",
  "Wanted",
  "Cult Initiate",
  "Thieve's Guild",
  "Banished",
  "Orphaned",
  "Wizard's Apprentice",
  "Jeweler",
  "Herbalist",
  "Barbarian",
  "Mercenary",
  "Sailor",
  "Acolyte",
  "Soldier",
  "Ranger",
  "Scout",
  "Minstrel",
  "Scholar",
  "Noble",
  "Surgeon",
] as const;

export const CLASSES = ["Fighter", "Priest", "Wizard", "Thief"] as const;

export const TITLE_MAP = {
  Fighter: {
    Lawful: ["Squire", "Cavalier", "Knight", "Thane", "Lord/Lady"],
    Chaotic: ["Knave", "Bandit", "Slayer", "Reaver", "Warlord"],
    Neutral: ["Warrior", "Bararian", "Battlerager", "Warchief", "Chieftain"],
  },
  Priest: {
    Lawful: ["Acolyte", "Crusader", "Templar", "Champion", "Paladin"],
    Chaotic: ["Initiate", "Zealot", "Cultist", "Scourge", "Chaos Knight"],
    Neutral: ["Seeker", "Invoker", "Haruspex", "Mystic", "Oracle"],
  },
  Thief: {
    Lawful: ["Footpad", "Burglar", "Rook", "Underboss", "Boss"],
    Chaotic: ["Thug", "Cutthroat", "Shadow", "Assassin", "Wraith"],
    Neutral: ["Robber", "Outlaw", "Rogue", "Renegade", "Bandit King/Queen"],
  },
  Wizard: {
    Lawful: ["Apprentice", "Conjurer", "Arcanist", "Mage", "Archmage"],
    Chaotic: ["Adept", "Channeler", "Witch/Warlock", "Diabolist", "Sorcerer"],
    Neutral: ["Shaman", "Seer", "Warden", "sage", "Druid"],
  },
} as const;

export const TITLES = [
  ...TITLE_MAP["Fighter"]["Lawful"],
  ...TITLE_MAP["Fighter"]["Chaotic"],
  ...TITLE_MAP["Fighter"]["Neutral"],
  ...TITLE_MAP["Wizard"]["Lawful"],
  ...TITLE_MAP["Wizard"]["Chaotic"],
  ...TITLE_MAP["Wizard"]["Neutral"],
  ...TITLE_MAP["Thief"]["Lawful"],
  ...TITLE_MAP["Thief"]["Chaotic"],
  ...TITLE_MAP["Thief"]["Neutral"],
  ...TITLE_MAP["Priest"]["Lawful"],
  ...TITLE_MAP["Priest"]["Chaotic"],
  ...TITLE_MAP["Priest"]["Neutral"],
] as const;

export type StatBlock = {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
};

export type Stat = keyof StatBlock;

export const ANCESTRIES = [
  "Elf",
  "Human",
  "Goblin",
  "Halfling",
  "Half-orc",
  "Dwarf",
] as const;

export const LANGUAGES = [
  "Common",
  "Dwarvish",
  "Elvish",
  "Giant",
  "Goblin",
  "Merran",
  "Orcish",
  "Reptillian",
  "Sylvan",
  "Thanian",
] as const;

export type Alignment = (typeof ALIGNMENTS)[number];
export type Deity = (typeof DEITIES)[number];
export type Background = (typeof BACKGROUNDS)[number];
export type Class = (typeof CLASSES)[number];
export type Title = (typeof TITLES)[number];
export type Ancestry = (typeof ANCESTRIES)[number];
export type Language = (typeof LANGUAGES)[number];
export type Cost = { gp: number; sp: number; cp: number };
export type Currency = keyof Cost;
export type BonusSourceType = "Ancestry" | "Class" | "Gear";
export type BonusSourceCategory = "Ability" | "Talent";
export type DiceType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";
export const ValueForDiceType = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
} as const;
export type RangeType = "Self" | "Close" | "Near" | "Far";
export type TimeUnit =
  | "Second"
  | "Minute"
  | "Round"
  | "Hour"
  | "Day"
  | "Week"
  | "Month"
  | "Year";
export type DurationType = "Focus" | "Instant" | TimeUnit;
export type Tier = 1 | 2 | 3 | 4 | 5;

export type Attack = {
  dice: DiceType;
};

export type Talent = {
  name: string;
};

export type SpellInfo = {
  name: string;
  class: Extract<Class, "Wizard" | "Priest">;
  tier: Tier;
  range: RangeType;
  duration: {
    type: DurationType;
    diceType?: DiceType;
    amt?: number;
  };
  desc: string;
};

export type HandednessProperty = "oneHanded" | "twoHanded";
export type ArmorProperty = "disadvStealth" | "noSwim" | "disadvSwim";
export type ShieldProperty = "shield" | HandednessProperty;
export type WeaponProperty = HandednessProperty;

export type GearProperty =
  | ArmorProperty
  | ShieldProperty
  | WeaponProperty
  | "magic";

export type ArmorAC = {
  base: number;
  modifier: number;
  attribute?: Stat;
};

export type GearType = "Basic" | "Armor" | "Sundry" | "Weapon";

export type GearInfo = {
  gearId: string;
  properties: GearProperty[];
  name: string;
  type: GearType;
  canBeEquipped: boolean;
  equipped: boolean;
  quantity: number;
  slots: { perSlot: number; slotsUsed: number; freeCarry: number };
  cost: Cost;
  desc?: string;
  ac?: ArmorAC;
};

export type WeaponType = "melee" | "ranged";

export type WeaponInfo = GearInfo & {
  attackBonus: number;
  properties: WeaponProperty[];
  damage: {
    bonus: number;
    oneHanded: DiceType;
    twoHanded: DiceType;
    numDice: number;
  };
  range: RangeType;
  weaponType: WeaponType;
  weaponMastery: boolean;
  baseWeapon: string;
};

export type ArmorInfo = GearInfo & {
  properties: ArmorProperty[];
  ac: { base: number; modifier: number; attribute?: Stat };
  baseArmor: string;
};

export type Gear = {
  name: string;
  quantity: number;
  equipped?: boolean;
};

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

export type PlayerCharacter = {
  name: string;
  ancestry: Ancestry;
  class: Class;
  level: number;
  title: Title;
  alignment: Alignment;
  background: Background;
  deity: Deity;
  gear: Gear[];
  stats: StatBlock;
  bonuses: Bonus[];
  maxHitPoints: number;
  armorClass: number;
  gearSlotsTotal: number;
  gold: number;
  silver: number;
  copper: number;
  languages: string[];
  xp: number;
  talents: Talent[];
  spells: SpellInfo[];
  attacks: Attack[];
  hitPoints: number;
};

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

export type GenericBonus = {
  name: string;
  desc: string;
  bonusSource?: BonusSourceType;
  bonusType: "generic";
  metadata?: Record<string, string>;
};

export type ModifyBonus = {
  name: string;
  desc: string;
  bonusSource?: BonusSourceType;
  bonusType: "modifyAmt";
  bonusTo: BonusTo;
  bonusAmount: number;
  metadata?: Record<string, string>;
};

export type AdvantageBonus = {
  name: string;
  desc: string;
  bonusSource?: BonusSourceType;
  bonusType: "advantage";
  bonusTo: BonusTo;
  metadata?: Record<string, string>;
};

export type DisadvantageBonus = {
  name: string;
  desc: string;
  bonusSource?: BonusSourceType;
  bonusTo: BonusTo;
  bonusType: "disadvantage";
  metadata?: Record<string, string>;
};

export type Bonus =
  | GenericBonus
  | ModifyBonus
  | AdvantageBonus
  | DisadvantageBonus;

export const BASIC_GEAR: { [key: string]: GearInfo } = {};

basicGear.forEach((g) => {
  BASIC_GEAR[g.name.toLowerCase()] = {
    name: g.name,
    cost: g.system.cost,
    canBeEquipped: g.system.canBeEquipped,
    equipped: g.system.equipped,
    properties: g.system.properties,
    quantity: g.system.quantity,
    type: g.type as GearType,
    slots: {
      perSlot: g.system.slots.per_slot,
      slotsUsed: g.system.slots.slots_used,
      freeCarry: g.system.slots.free_carry,
    },
    gearId: g._id,
  };
});

export const ARMOR_GEAR: { [key: string]: ArmorInfo } = {};

armor.forEach((a) => {
  ARMOR_GEAR[a.name.toLowerCase()] = {
    gearId: a._id,
    name: a.name,
    cost: a.system.cost,
    canBeEquipped: a.system.canBeEquipped,
    equipped: a.system.equipped,
    properties: a.system.properties as ArmorProperty[],
    quantity: a.system.quantity,
    type: a.type as GearType,
    slots: {
      perSlot: a.system.slots.per_slot,
      slotsUsed: a.system.slots.slots_used,
      freeCarry: a.system.slots.free_carry,
    },
    ac: {
      base: a.system.ac.base,
      modifier: a.system.ac.modifier,
      attribute: a.system.ac.attribute as Stat,
    },
    baseArmor: a.system.baseArmor,
  };
});

export const WEAPON_GEAR: { [key: string]: WeaponInfo } = {};

weapons.forEach((w) => {
  WEAPON_GEAR[w.name.toLowerCase()] = {
    gearId: w._id,
    name: w.name,
    cost: w.system.cost,
    canBeEquipped: w.system.canBeEquipped,
    equipped: w.system.equipped,
    properties: w.system.properties as WeaponProperty[],
    quantity: w.system.quantity,
    type: w.type as GearType,
    slots: {
      perSlot: w.system.slots.per_slot,
      slotsUsed: w.system.slots.slots_used,
      freeCarry: w.system.slots.free_carry,
    },
    attackBonus: w.system.attackBonus,
    damage: {
      bonus: w.system.damage.bonus,
      numDice: w.system.damage.numDice,
      oneHanded: w.system.damage.oneHanded as DiceType,
      twoHanded: w.system.damage.twoHanded as DiceType,
    },
    range: w.system.range as RangeType,
    weaponMastery: w.system.weaponMastery,
    weaponType: w.system.type as "melee" | "ranged",
    baseWeapon: w.system.baseWeapon,
  };
});

export function findGear(
  name: string
): WeaponInfo | ArmorInfo | GearInfo | undefined {
  name = name.toLowerCase();
  return WEAPON_GEAR[name] ?? ARMOR_GEAR[name] ?? BASIC_GEAR[name];
}

export const SPELL_GEAR: { [key: string]: SpellInfo } = {};

spells.forEach((s) => {
  const durationVal = s.system.duration.value;

  const convert: { [key: string]: DurationType } = {
    days: "Day",
    instant: "Instant",
    rounds: "Round",
  };

  SPELL_GEAR[s.name.toLowerCase()] = {
    name: s.name,
    range: s.system.range as RangeType,
    class: s.system.class[0] as "Wizard" | "Priest",
    tier: s.system.tier as Tier,
    desc: s.system.description.replaceAll("<p>", "").replaceAll("</p>", ""),
    duration: {
      type:
        convert[s.system.duration.type] ??
        (s.system.duration.type as DurationType),
      diceType:
        typeof durationVal === "string" ? (durationVal as DiceType) : undefined,
      amt: typeof durationVal === "number" ? durationVal : undefined,
    },
  };
});

export function findSpell(name: string): SpellInfo {
  return SPELL_GEAR[name.toLowerCase()];
}

export const TALENTS: { [key: string]: Talent } = {};

talents.forEach((t) => {
  TALENTS[t.name] = {
    name: t.name,
  };
});
