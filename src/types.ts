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
] as const;

export type Alignment = (typeof ALIGNMENTS)[number];
export type Deity = (typeof DEITIES)[number];
export type Background = (typeof BACKGROUNDS)[number];
export type Class = (typeof CLASSES)[number];
export type Title = (typeof TITLES)[number];
export type Ancestry = (typeof ANCESTRIES)[number];
export type Currency = "gp" | "sp" | "cp";
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

export type Spell = {
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

export type Gear = {
  gearId: string;
  name: string;
  type: string;
  quantity: number;
  totalUnits: number;
  slots: number;
  cost: number;
  currency: Currency;
};

export type Bonus = {
  sourceType: BonusSourceType;
  sourceName: string;
  sourceCategory: BonusSourceCategory;
  ganedAtLevel: number;
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
  gearSlotsUsed: number;
  gold: number;
  silver: number;
  copper: number;
  spellsKnown: string;
  languages: string;

  xp?: number;
  xpCap?: number;
  talents?: Talent[];
  spells?: Spell[];
  attacks?: Attack[];
  hitPoints?: number;
};

export const SPELLS: Spell[] = [
  {
    name: "Acid Arrow",
    tier: 2,
    class: "Wizard",
    duration: {
      type: "Focus",
    },
    range: "Far",
    desc: "You conjure a corrosive bolt that hits one foe, dealing 1d6 damage a round. The bolt remains in the target for as long as you focus.",
  },
  {
    name: "Alarm",
    tier: 1,
    class: "Wizard",
    duration: {
      type: "Day",
      amt: 1,
    },
    range: "Close",
    desc: "You touch one object, such as a door threshold, setting a magical alarm on it. If any creature you do not designate while casting the spell touches or crosses past the object, a magical bell sounds in your head.",
  },
  {
    name: "Burning Hands",
    tier: 1,
    class: "Wizard",
    duration: {
      type: "Instant",
    },
    range: "Close",
    desc: "You spread your fingers with thumbs touching, unleashing a circle of flame that fills a close area around where you stand. Creatures within the area of effect take 1d6 damage. Unattended flammable objects ignite.",
  },
];
