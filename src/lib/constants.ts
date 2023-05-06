import type { Class } from "./types";

export const GEAR_TYPES = ["Basic", "Armor", "Weapon"] as const;
export const SHIELD_PROPERTIES = ["Shield", "OneHanded", "TwoHanded"] as const;
export const RANGE_TYPES = ["Self", "Close", "Near", "Far"] as const;
export const DICE_TYPES = ["d4", "d6", "d8", "d10", "d12", "d20"] as const;
export const SCHEMA_VERSION = "1.0.0";
export const SCHEMA_TYPE = "sd-char-sheet";
export const STATS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
export const ALIGNMENTS = ["Neutral", "Lawful", "Chaotic"] as const;
export const WEAPON_TYPES = ["Melee", "Ranged", "MeleeRanged"] as const;
export const WEAPON_PROPERTIES = [
  "Finesse",
  "Loading",
  "Thrown",
  "Versatile",
  "Magic",
] as const;

export const TIME_UNITS = [
  "Second",
  "Minute",
  "Round",
  "Hour",
  "Day",
  "Week",
  "Month",
  "Year",
];

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

export const DEITIES = [
  "None",
  "Saint Terragnis",
  "Gede",
  "Madeera the Covenant",
  "Ord",
  "Memnon",
  "Ramlaat",
  "Shune the Vile",
  "The Lost",
] as const;

export const BACKGROUNDS = [
  "Urchin",
  "Wanted",
  "Cult Initiate",
  "Thieves' Guild",
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
  "Chirurgeon",
] as const;

export const CLASSES = [
  "Fighter",
  "Priest",
  "Wizard",
  "Thief",
  "Ranger",
] as const;

export const TITLE_MAP: {
  [key in Class]: {
    [key in "Lawful" | "Neutral" | "Chaotic"]: readonly string[];
  };
} = {
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
  // TODO Ranger Titles
  Ranger: {
    Lawful: ["Squire", "Cavalier", "Knight", "Thane", "Lord/Lady"],
    Chaotic: ["Knave", "Bandit", "Slayer", "Reaver", "Warlord"],
    Neutral: ["Warrior", "Bararian", "Battlerager", "Warchief", "Chieftain"],
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

export const ANCESTRIES = [
  "Elf",
  "Human",
  "Goblin",
  "Halfling",
  "Half-Orc",
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
  "Celestial",
  "Diabolic",
  "Draconic",
  "Primordial",
] as const;

export const ValueForDiceType = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
} as const;
