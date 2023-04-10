import { writable } from "svelte/store";
import type { PlayerCharacter, Stat } from "../model";
import { clamp } from "./utils";

export const PlayerCharacterStore = writable<PlayerCharacter>();

export function calculateModifierForPlayerStat(
  pc: PlayerCharacter,
  stat: Stat
): number {
  // TODO use talents and items to calculate stats

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

export function levelUpPlayer(pc: PlayerCharacter) {
  const xpCap = pc.level === 0 ? 10 : pc.level * 10;

  if (pc.xp < xpCap) return;
  if (pc.level == 10) return;

  pc.level += 1;
  pc.xp -= xpCap;
}
