import { writable } from "svelte/store";
import {
  TITLE_MAP,
  type Attack,
  type PlayerCharacter,
  type SpellInfo,
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

export function calculateModifierForPlayerAttack(
  pc: PlayerCharacter,
  attack: Attack
): number {
  // elves might get +1 to ranged weapons
  // orc get +1 bonus to attack with melee weapons
  // fighters get x weapon mastery for chosen weapon types
  // fighters might get +1 * x to melee and ranged attacks
  return 0;
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
  spellName: SpellInfo,
  pc: PlayerCharacter
): number {
  // TODO spellcasting modifier for player
  let result = 0;

  const baseModifier = calculateModifierForPlayerStat(
    pc,
    pc.class === "Priest" ? "WIS" : "INT"
  );

  result += baseModifier;

  // elves might get +1 to spellcasting

  pc.bonuses
    .filter((b) => b.bonusTo === "SpellCasting")
    .forEach((b) => (result += b.bonusAmount));

  return result;
}

export function calculateGearSlotsForPlayer(pc: PlayerCharacter) {
  let result = Math.max(10, pc.stats.STR);
  if (pc.talents.find((t) => t.name === "Hauler")) {
    result += Math.max(0, calculateModifierForPlayerStat(pc, "CON"));
  }
  return result;
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
