import { writable } from "svelte/store";
import { findAny } from "../compendium";
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
import { createUndoRedoStore } from "../services/PlayerHistoryTracker";
import { clamp, toInfo } from "../utils";
import type { ArmorInfo } from "./Armor";
import type { Bonus, ModifyBonus } from "./Bonus";
import type { Gear, GearInfo } from "./Gear";
import type { SpellInfo } from "./Spell";
import type { Talent } from "./Talent";
import type { WeaponInfo } from "./Weapon";

export const PlayerCharacterStore = createUndoRedoStore(
  writable<PlayerCharacter>(defaultPC())
);

export type Alignment = (typeof ALIGNMENTS)[number];
export type Deity = (typeof DEITIES)[number];
export type Background = (typeof BACKGROUNDS)[number];
export type Class = (typeof CLASSES)[number];
export type Title = (typeof TITLES)[number];
export type Ancestry = (typeof ANCESTRIES)[number];
export type Language = (typeof LANGUAGES)[number];

export const STATS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
export type Stat = (typeof STATS)[number];
export type StatBlock = {
  [key in Stat]: number;
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
  customGear: GearInfo[];
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
  spells: SpellInfo[];
  customSpells: SpellInfo[];
  hitPoints: number;
};

export function calculateModifierForPlayerStat(
  pc: PlayerCharacter,
  stat: Stat
): number {
  let finalModifier = 0;
  const baseModifier = clamp(
    Math.floor((calculateStatValueForPlayerStat(pc, stat) - 10) / 2),
    -4,
    4
  );
  finalModifier += baseModifier;
  return finalModifier;
}

export function calculateStatValueForPlayerStat(
  pc: PlayerCharacter,
  stat: Stat
): number {
  const baseStat = pc.stats[stat];
  return baseStat + calculateBonusForPlayerStat(pc, stat);
}

export function calculateBonusForPlayerStat(
  pc: PlayerCharacter,
  stat: Stat
): number {
  return pc.bonuses
    .filter(
      (b) =>
        b.type === "modifyAmt" &&
        b.bonusTo === "stat" &&
        b.metadata?.type === "stat" &&
        b.metadata.stat === stat
    )
    .reduce((acc, b: ModifyBonus) => acc + calculateBonusAmount(pc, b), 0);
}

export function calculateArmorClassForPlayer(pc: PlayerCharacter) {
  let acModifier = 0;
  for (const b of pc.bonuses) {
    if (b.type === "modifyAmt" && b.bonusTo === "armorClass") {
      acModifier += calculateBonusAmount(pc, b);
    }
  }

  const gearBonuses = pc.gear
    .map((g) => ({ isEquipped: g.equipped, g: findAny(g.name) }))
    .filter(({ isEquipped, g }) => {
      return !g.canBeEquipped || isEquipped;
    })
    .map(({ g }) => g.playerBonuses)
    .filter(Boolean)
    .flat();

  for (const b of gearBonuses) {
    if (b.type === "modifyAmt" && b.bonusTo === "armorClass") {
      acModifier += calculateBonusAmount(pc, b);
    }
  }

  const armor = pc.gear
    .filter((g) => g.equipped)
    .map(toInfo<ArmorInfo>)
    .filter((g) => g.type === "Armor");

  for (const a of armor) {
    let statModifier = 0;
    if (a.ac.stat) {
      statModifier = calculateModifierForPlayerStat(pc, a.ac.stat);
    }

    acModifier += a.ac.modifier + statModifier;

    acModifier += pc.bonuses
      .filter(
        (b) =>
          b.type === "modifyAmt" &&
          b.metadata?.type === "armor" &&
          b.metadata.armor === a.name
      )
      .reduce((acc, b: ModifyBonus) => acc + b.bonusAmount, 0);

    if (a.ac.base > 0) {
      return Math.max(a.ac.base, pc.armorClass) + acModifier;
    }
  }

  return pc.armorClass + acModifier;
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

  // TODO spellcasting bonuses

  return result;
}

export function calculateAttackBonusForPlayerWeapon(
  pc: PlayerCharacter,
  w: WeaponInfo
): number {
  return 0;
}

export function calculateGearSlotsForPlayer(pc: PlayerCharacter) {
  const base = Math.max(10, pc.stats.STR);

  // TODO Hauler talent

  const bonuses = pc.bonuses.reduce((acc: number, b: Bonus) => {
    if (b.type === "modifyAmt" && b.bonusTo === "gearSlots") {
      return acc + calculateBonusAmount(pc, b);
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

export function learnSpellForPlayer(pc: PlayerCharacter, spell: SpellInfo) {
  if (playerHasSpell(pc, spell)) return;
  pc.spells.push(spell);
}

export function unlearnSpellForPlayer(pc: PlayerCharacter, spell: SpellInfo) {
  pc.spells = pc.spells.filter((s) => s.name !== spell.name);
}

export function addBonusToPlayer(pc: PlayerCharacter, b: Bonus) {
  pc.bonuses.push(b);
}

export function deleteBonusForPlayer(pc: PlayerCharacter, theBonus: Bonus) {
  pc.bonuses = pc.bonuses.filter((b) => b.name !== theBonus.name);
}

export function calculateTotalHitPointsForPlayer(pc: PlayerCharacter): number {
  const baseMaxHP = pc.maxHitPoints;
  const bonuses = pc.bonuses
    .filter((b) => {
      return b.type === "modifyAmt" && b.bonusTo === "hp";
    })
    .reduce((acc, b: ModifyBonus) => {
      return acc + calculateBonusAmount(pc, b);
    }, 0);
  return baseMaxHP + bonuses;
}

export function calculateBonusAmount(
  pc: PlayerCharacter,
  b: ModifyBonus
): number {
  if (b.bonusIncreaseRatePerLevel) {
    return b.bonusAmount + Math.floor(pc.level * b.bonusIncreaseRatePerLevel);
  }
  return b.bonusAmount;
}

export function defaultPC(): PlayerCharacter {
  return {
    name: "",
    ancestry: "Human",
    class: "Thief",
    level: 0,
    title: "Rook",
    alignment: "Lawful",
    background: "Scout",
    deity: "Gede",
    gear: [],
    customGear: [],
    stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    bonuses: [],
    customBonuses: [],
    customTalents: [],
    maxHitPoints: 1,
    armorClass: 10,
    gearSlotsTotal: 10,
    gold: 0,
    silver: 0,
    copper: 0,
    languages: ["Common"],
    customLanguages: [],
    xp: 0,
    spells: [],
    customSpells: [],
    hitPoints: 1,
  };
}
