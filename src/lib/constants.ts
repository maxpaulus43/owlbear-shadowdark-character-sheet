import type { Class } from "./types";

export const GEAR_TYPES = ["Basic", "Armor", "Weapon"] as const;
export const SHIELD_PROPERTIES = [
  "Shield",
  "OneHanded",
  "TwoHanded",
  "Magic",
] as const;
export const RANGE_TYPES = ["Self", "Close", "Near", "Far", "Unlimited"] as const;
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
] as const;

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
  "Bard",
  "Knight of St. Ydris",
  "Warlock",
  "Witch",
  "Desert Rider",
  "Pit Fighter",
  "Ras-Godai",
  "Sea Wolf",
  "Seer",
  "Wyrdling",
  "Delver",
  "Basilisk Warrior",
  "Duelist",
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
  Ranger: {
    Lawful: ["Wanderer", "Strider", "Warden", "Guardian", "Sentinel"],
    Chaotic: ["Hood", "Outlaw", "Fugitive", "Exile", "Pariah"],
    Neutral: ["Stranger", "Wayfarer", "Outlander", "Recluse", "Hermit"],
  },
  Bard: {
    Lawful: ["Storyteller", "Balladeer", "Philosopher", "Poet", "Master Poet"],
    Chaotic: ["Guttersnipe", "Charlatan", "Satirist", "Silvertongue", "Doomspeaker"],
    Neutral: ["Seeker", "Witness", "Speaker", "Voice", "Truthbearer"],
  },
  "Knight of St. Ydris": {
    Lawful: ["Arbiter", "Enforcer", "Knight Marshal", "Judge", "Justicar"],
    Chaotic: ["Traitor", "Fallen", "Oathbreaker", "Blackguard", "Demonlord"],
    Neutral: ["Brother/Sister", "Exorcist", "Reverend Knight", "Inquisitor", "Grand Inquisitor"],
  },
  Warlock: {
    Lawful: ["Favored", "Herald", "Eminent", "Exalted", "Incarnation"],
    Chaotic: ["Marked", "Zealot", "Occultist", "Champion", "Harbinger"],
    Neutral: ["Chosen", "Channeler", "Prophesied", "Transcendent", "Avatar"],
  },
  Witch: {
    Lawful: ["Fortune Teller", "Far Seer", "Prophet", "Wise One", "Baba"],
    Chaotic: ["Whisperer", "Hexer", "Hag/Elder", "Crone/Uncle", "Baba"],
    Neutral: ["Shaman", "Conjurer", "Soothsayer", "Conduit", "Baba"],
  },
  "Desert Rider": {
    Lawful: ["Outrider", "Sandrunner", "Trailblazer", "Swift Wind", "Stormrunner"],
    Chaotic: ["Bandit", "Robber", "Raider", "Scourge", "Bandit King/Queen"],
    Neutral: ["Rat", "Fox", "Wolf", "Tiger", "Dragon"],
  },
  "Pit Fighter": {
    Lawful: ["Rookie", "Gladiator", "Hero", "Champion", "Legend"],
    Chaotic: ["Ruffian", "Brawler", "Heel", "Villain", "Legend"],
    Neutral: ["Underdog", "Dark Horse", "Wild Card", "Victor", "Legend"],
  },
  "Ras-Godai": {
    Lawful: ["Acolyte", "Mirror Path", "Monk", "Master", "White Lotus"],
    Chaotic: ["Acolyte", "Shadow Path", "Monk", "Assassin", "Black Lotus"],
    Neutral: ["Acolyte", "Fire Path", "Monk", "Demon Blade", "Red Lotus"],
  },
  "Sea Wolf": {
    Lawful: ["Freefolk", "Shieldman/maiden", "Thane", "Jarl", "King/Queen"],
    Chaotic: ["Rabble", "Raider", "Reaver", "Conqueror", "Usurper"],
    Neutral: ["Wanderer", "Explorer", "Adventurer", "Renowned", "Legendary"],
  },
  Seer: {
    Lawful: ["Guide", "Chanter", "Rune Reader", "Wise One", "Seer of Odin"],
    Chaotic: ["Hedge Witch", "Whisperer", "Bone Reader", "Dreaded One", "Seer of Loki"],
    Neutral: ["Fortune Teller", "Singer", "Star Reader", "Blessed One", "Seer of Freya"],
  },
  Wyrdling: {
    Lawful: ["Chosen One", "Cursed", "Haunted", "Tortured", "Crazed One"],
    Chaotic: ["Chosen One", "Blessed", "Consecrated", "Revered", "Exalted One"],
    Neutral: ["Chosen One", "Seeker", "Listener", "Watcher", "Learned One"],
  },
  Delver: {
    Lawful: ["Explorer", "Researcher", "Antiquarian", "Archaeologist", "Professor"],
    Chaotic: ["Intruder", "Opportunist", "Larcenist", "Tomb Robber", "Defiler"],
    Neutral: ["Investigator", "Observer", "Pathfinder", "Trailblazer", "Pioneer"],
  },
  "Basilisk Warrior": {
    Lawful: ["Stone Warrior", "Strong Stone", "Protector", "Sun Serpent", "Amber Basilisk"],
    Chaotic: ["Stone Warrior", "Sharp Stone", "Slayer", "Moon Serpent", "Obsidian Basilisk"],
    Neutral: ["Stone Warrior", "Silent Stone", "Watcher", "Sky Serpent", "Sapphire Basilisk"],
  },
  Duelist: {
    Lawful: ["Fencer", "Defender", "Mongoose", "Wolf", "Swordmaster"],
    Chaotic: ["Ruffian", "Heckler", "Viper", "Cobra", "Swordmaster"],
    Neutral: ["Student", "Challenger", "Mouser", "Panther", "Swordmaster"],
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
  ...TITLE_MAP["Ranger"]["Lawful"],
  ...TITLE_MAP["Ranger"]["Chaotic"],
  ...TITLE_MAP["Ranger"]["Neutral"],
  ...TITLE_MAP["Bard"]["Lawful"],
  ...TITLE_MAP["Bard"]["Chaotic"],
  ...TITLE_MAP["Bard"]["Neutral"],
  ...TITLE_MAP["Knight of St. Ydris"]["Lawful"],
  ...TITLE_MAP["Knight of St. Ydris"]["Chaotic"],
  ...TITLE_MAP["Knight of St. Ydris"]["Neutral"],
  ...TITLE_MAP["Warlock"]["Lawful"],
  ...TITLE_MAP["Warlock"]["Chaotic"],
  ...TITLE_MAP["Warlock"]["Neutral"],
  ...TITLE_MAP["Witch"]["Lawful"],
  ...TITLE_MAP["Witch"]["Chaotic"],
  ...TITLE_MAP["Witch"]["Neutral"],
  ...TITLE_MAP["Desert Rider"]["Lawful"],
  ...TITLE_MAP["Desert Rider"]["Chaotic"],
  ...TITLE_MAP["Desert Rider"]["Neutral"],
  ...TITLE_MAP["Pit Fighter"]["Lawful"],
  ...TITLE_MAP["Pit Fighter"]["Chaotic"],
  ...TITLE_MAP["Pit Fighter"]["Neutral"],
  ...TITLE_MAP["Ras-Godai"]["Lawful"],
  ...TITLE_MAP["Ras-Godai"]["Chaotic"],
  ...TITLE_MAP["Ras-Godai"]["Neutral"],
  ...TITLE_MAP["Sea Wolf"]["Lawful"],
  ...TITLE_MAP["Sea Wolf"]["Chaotic"],
  ...TITLE_MAP["Sea Wolf"]["Neutral"],
  ...TITLE_MAP["Seer"]["Lawful"],
  ...TITLE_MAP["Seer"]["Chaotic"],
  ...TITLE_MAP["Seer"]["Neutral"],
  ...TITLE_MAP["Wyrdling"]["Lawful"],
  ...TITLE_MAP["Wyrdling"]["Chaotic"],
  ...TITLE_MAP["Wyrdling"]["Neutral"],
  ...TITLE_MAP["Delver"]["Lawful"],
  ...TITLE_MAP["Delver"]["Chaotic"],
  ...TITLE_MAP["Delver"]["Neutral"],
  ...TITLE_MAP["Basilisk Warrior"]["Lawful"],
  ...TITLE_MAP["Basilisk Warrior"]["Chaotic"],
  ...TITLE_MAP["Basilisk Warrior"]["Neutral"],
  ...TITLE_MAP["Duelist"]["Lawful"],
  ...TITLE_MAP["Duelist"]["Chaotic"],
  ...TITLE_MAP["Duelist"]["Neutral"],
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
