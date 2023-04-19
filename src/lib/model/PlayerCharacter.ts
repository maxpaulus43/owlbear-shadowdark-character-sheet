import { writable } from "svelte/store";
import {
  ALIGNMENTS,
  ANCESTRIES,
  BACKGROUNDS,
  CLASSES,
  DEITIES,
  LANGUAGES,
  TITLES,
  TITLE_MAP,
} from "../constants";
import { clamp } from "../utils";
import type { Bonus } from "./Bonus";
import type { Gear } from "./Gear";
import type { SpellInfo } from "./Spell";

export const PlayerCharacterStore = writable<PlayerCharacter>();

export type Alignment = (typeof ALIGNMENTS)[number];
export type Deity = (typeof DEITIES)[number];
export type Background = (typeof BACKGROUNDS)[number];
export type Class = (typeof CLASSES)[number];
export type Title = (typeof TITLES)[number];
export type Ancestry = (typeof ANCESTRIES)[number];
export type Language = (typeof LANGUAGES)[number];

export type StatBlock = {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
};

export type Stat = keyof StatBlock;

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
  spells: SpellInfo[];
  hitPoints: number;
};

export function calculateModifierForPlayerStat(
  pc: PlayerCharacter,
  stat: Stat
): number {
  let finalModifier = 0;
  const baseModifier = clamp(Math.floor((pc.stats[stat] - 10) / 2), -4, 4);
  finalModifier += baseModifier;
  return finalModifier;
}

export function calculateArmorClassForPlayer(pc: PlayerCharacter) {
  // TODO use armor and talents to calulate ac
  // fighters +1 AC for armor type
  return pc.armorClass;
}

export function calculateTitleForPlayer(pc: PlayerCharacter): Title {
  return TITLE_MAP[pc.class][pc.alignment][
    Math.max(0, Math.floor((pc.level - 1) / 2))
  ];
}

export function calculateSpellCastingModifierForPlayer(
  pc: PlayerCharacter
): number {
  let result = 0;
  const baseModifier = calculateModifierForPlayerStat(
    pc,
    pc.class === "Priest" ? "WIS" : "INT"
  );
  result += baseModifier;

  // TODO bonuses

  return result;
}

export function calculateGearSlotsForPlayer(pc: PlayerCharacter) {
  const base = Math.max(10, pc.stats.STR);

  // TODO Hauler talent

  const bonuses = pc.bonuses.reduce((acc: number, b: Bonus) => {
    if (b.bonusType === "modifyAmt" && b.bonusTo === "gearSlots") {
      return acc + b.bonusAmount;
    } else {
      return acc;
    }
  }, 0);

  return base + bonuses;
}

export function levelUpPlayer(pc: PlayerCharacter) {
  const xpCap = pc.level === 0 ? 10 : pc.level * 10;

  if (pc.xp < xpCap) return;
  if (pc.level == 10) return;

  pc.level += 1;
  pc.xp -= xpCap;
}

export function playerHasSpell(pc: PlayerCharacter, spell: SpellInfo) {
  return pc.spells.findIndex((s) => s.name === spell.name) > -1;
}

export function playerCanLearnSpell(pc: PlayerCharacter, spell: SpellInfo) {
  return pc.class.toLowerCase() === spell.class.toLowerCase();
}

export function learnSpellForPlayer(spell: SpellInfo, pc: PlayerCharacter) {
  if (playerHasSpell(pc, spell)) return;
  pc.spells.push(spell);
}

export function unlearnSpellForPlayer(spell: SpellInfo, pc: PlayerCharacter) {
  pc.spells = pc.spells.filter((s) => s.name !== spell.name);
}
