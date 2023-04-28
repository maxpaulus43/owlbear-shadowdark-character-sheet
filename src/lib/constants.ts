export const SCHEMA_VERSION = "1.0.0";
export const SCHEMA_TYPE = "sd-char-sheet";

export const ALIGNMENTS = ["Neutral", "Lawful", "Chaotic"] as const;

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
