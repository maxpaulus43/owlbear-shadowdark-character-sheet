import { writable } from "svelte/store";
import {
  TITLE_MAP,
  type PlayerCharacter,
  type Spell,
  type Stat,
  type Title,
} from "../types";
import { clamp } from "./utils";

export const PlayerCharacterStore = writable<PlayerCharacter>();

export function calculateModifierForPlayerStat(
  pc: PlayerCharacter,
  stat: Stat
): number {
  let finalModifier = 0;
  const baseModifier = clamp(Math.floor((pc.stats[stat] - 10) / 2), -4, 4);
  finalModifier += baseModifier;
  pc.bonuses
    .filter((b) => b.bonusName === "StatBonus")
    .forEach((b) => {
      if (b.bonusTo.includes(stat)) {
        const bonusModifier = parseInt(b.bonusTo.split(":")[1]);
        finalModifier += bonusModifier;
      }
    });
  return finalModifier;
}

export function calculateArmorClassForPlayer(pc: PlayerCharacter) {
  // TODO use armor and talents to calulate ac
  return pc.armorClass;
}

export function calculateTitleForPlayer(pc: PlayerCharacter): Title {
  return TITLE_MAP[pc.class][pc.alignment][
    Math.max(0, Math.floor((pc.level - 1) / 2))
  ];
}

export function calculateSpellCastingModifierForPlayer(
  spell: string,
  pc: PlayerCharacter
): number {
  // TODO spellcasting modifier for player
  let result = 0;

  const baseModifier = calculateModifierForPlayerStat(
    pc,
    pc.class === "Priest" ? "WIS" : "INT"
  );

  result += baseModifier;

  pc.bonuses
    .filter((b) => b.bonusTo === "SpellCasting")
    .forEach((b) => (result += b.bonusAmount));

  return result;
}

export function calculateGearSlotsForPlayer(pc: PlayerCharacter) {
  const result = Math.max(10, pc.stats.STR);
  return result;
}

export function levelUpPlayer(pc: PlayerCharacter) {
  const xpCap = pc.level === 0 ? 10 : pc.level * 10;

  if (pc.xp < xpCap) return;
  if (pc.level == 10) return;

  pc.level += 1;
  pc.xp -= xpCap;
}

export function learnSpellForPlayer(spell: Spell, pc: PlayerCharacter) {
  const spells = pc.spellsKnown
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "None");
  spells.push(spell.name);
  pc.spellsKnown = spells.join(",");
}

export function unlearnSpellForPlayer(spell: Spell, pc: PlayerCharacter) {
  let spells = pc.spellsKnown.split(",").map((s) => s.trim());
  spells = spells.filter((s) => s !== spell.name);
  if (spells.length === 0) {
    pc.spellsKnown = "None";
  } else {
    pc.spellsKnown = spells.join(",");
  }
}
