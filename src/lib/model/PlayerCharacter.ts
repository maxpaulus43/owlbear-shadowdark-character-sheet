import { writable } from "svelte/store";
import { findAny } from "../compendium";
import { TITLE_MAP } from "../constants";
import {
  ensureAncestryBonuses,
  ensureClassBonuses,
  ensureClassGear,
  ensureLanguages,
} from "../services/AncestryClassEnsurer";
import { createUndoRedoStore } from "../services/PlayerHistoryTracker";
import type {
  Ancestry,
  ArmorInfo,
  Bonus,
  Class,
  CustomBonus,
  DiceType,
  DiceTypeBonus,
  Gear,
  GearInfo,
  ModifyBonus,
  PlayerCharacter,
  SpellInfo,
  Stat,
  Title,
  WeaponInfo,
} from "../types";
import { alphabetically, clamp, compareDiceType, toInfo } from "../utils";
import { slotsForGear } from "./Gear";

export const PlayerCharacterStore = createUndoRedoStore(
  writable<PlayerCharacter>(defaultPC()),
);
export const pc = PlayerCharacterStore;

export function defaultPC(): PlayerCharacter {
  return {
    name: "",
    ancestry: "Human",
    class: "",
    level: 0,
    title: "Rook",
    alignment: "Lawful",
    background: "Scout",
    deity: "Gede",
    notes: "",
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

export function resolveChoices(bonuses: Bonus[]): Bonus[] {
  if (!bonuses) return [];
  return bonuses.map((b) => {
    if (b.type === "choice" && b.choices && b.selectedChoiceId) {
      const selected = b.choices.find((c) => c.id === b.selectedChoiceId);
      if (selected) {
        return {
          ...selected.bonus,
          name: b.name,
          bonusSource: b.bonusSource,
          choices: b.choices,
          selectedChoiceId: b.selectedChoiceId,
          desc: selected.bonus.desc || b.desc,
        } as Bonus;
      }
    }
    return b;
  });
}

export function calculateModifierForPlayerStat(
  pc: PlayerCharacter,
  stat: Stat,
): number {
  let finalModifier = 0;
  const baseModifier = clamp(
    Math.floor((calculateStatValueForPlayerStat(pc, stat) - 10) / 2),
    -4,
    4,
  );
  finalModifier += baseModifier;
  return finalModifier;
}

export function setClassForPlayer(pc: PlayerCharacter, c: Class) {
  pc.class = c;
  ensureClassBonuses(pc);
  ensureClassGear(pc);
}

export function setAncestryForPlayer(pc: PlayerCharacter, a: Ancestry | "") {
  pc.ancestry = a;
  ensureAncestryBonuses(pc);
  ensureLanguages(pc);
}

export function calculateStatValueForPlayerStat(
  pc: PlayerCharacter,
  stat: Stat,
): number {
  const baseStat = pc.stats[stat];
  return baseStat + calculateBonusForPlayerStat(pc, stat);
}

function doesBonusApplyToWeapon(b: Bonus, w: WeaponInfo): boolean {
  const appliesToAllWeapons = !b.metadata;

  const appliesToWeaponType =
    b.metadata?.type === "weaponType" &&
    w.weaponType.includes(b.metadata.weaponType);

  const appliesToWeapon =
    b.metadata?.type === "weapon" && b.metadata.weapon === w.name;

  return appliesToAllWeapons || appliesToWeaponType || appliesToWeapon;
}

export function calculateDamageDiceTypeForPlayerWeapon(
  pc: PlayerCharacter,
  w: WeaponInfo,
  handedness: "oneHanded" | "twoHanded",
): DiceType {
  let result = w.damage[handedness].diceType;

  const allActiveBonuses = [
    ...resolveChoices(pc.bonuses),
    ...resolveChoices(getActiveGearBonuses(pc)),
    ...resolveChoices(getActiveCustomBonuses(pc)),
  ];
  const diceTypeBonuses = allActiveBonuses
    .filter(
      (b) =>
        b.type === "diceType" &&
        b.bonusTo === "damageRoll" &&
        doesBonusApplyToWeapon(b, w),
    )
    .map((b: DiceTypeBonus) => b.diceType)
    .sort(compareDiceType)
    .reverse();

  if (diceTypeBonuses[0] && compareDiceType(diceTypeBonuses[0], result) > 0) {
    // this will be the greatest diceType among all bonuses.
    result = diceTypeBonuses[0];
  }

  return result;
}

export function calculateBonusForPlayerStat(
  pc: PlayerCharacter,
  stat: Stat,
): number {
  const allActiveBonuses = [
    ...resolveChoices(pc.bonuses),
    ...resolveChoices(getActiveGearBonuses(pc)),
    ...resolveChoices(getActiveCustomBonuses(pc)),
  ];
  return allActiveBonuses
    .filter(
      (b) =>
        b.type === "modifyAmt" &&
        b.bonusTo === "stat" &&
        b.metadata?.type === "stat" &&
        b.metadata.stat === stat,
    )
    .reduce((acc, b: ModifyBonus) => acc + calculateBonusAmount(pc, b), 0);
}

export function isPlayerHoldingShield(pc: PlayerCharacter): boolean {
  return Boolean(
    pc.gear
      .filter((g) => g.equipped)
      .map(toInfo<ArmorInfo>)
      .find((g) => g.type === "Armor" && g.properties?.includes("OneHanded")),
  );
}

export function calculateArmorClassForPlayer(pc: PlayerCharacter) {
  let baseAC = pc.armorClass;
  let modsFromStat = calculateModifierForPlayerStat(pc, "DEX"); // default to DEX

  let modsFromUnrestrictedBonuses = 0;
  const allActiveBonuses = [...resolveChoices(pc.bonuses), ...resolveChoices(getActiveCustomBonuses(pc))];
  for (const b of allActiveBonuses) {
    if (b.type === "modifyAmt" && b.bonusTo === "armorClass" && !b.metadata) {
      modsFromUnrestrictedBonuses += calculateBonusAmount(pc, b);
    }
  }

  const gearBonuses = resolveChoices(getActiveGearBonuses(pc));

  let modsFromGearBonuses = 0;
  for (const b of gearBonuses) {
    if (b.type === "modifyAmt" && b.bonusTo === "armorClass") {
      modsFromGearBonuses += calculateBonusAmount(pc, b);
    }
  }

  let modsFromShields = 0;
  const shields = pc.gear
    .filter((g) => g.equipped)
    .map(toInfo<ArmorInfo>)
    .filter((g) => g.type === "Armor" && g.properties?.includes("OneHanded"));

  for (const s of shields) {
    modsFromShields += s.ac.modifier;
  }

  const armor = pc.gear
    .filter((g) => g.equipped)
    .map(toInfo<ArmorInfo>)
    .filter((g) => g.type === "Armor" && !g.properties?.includes("OneHanded"));

  let modsFromArmor = 0;
  let shouldAddStat = true;
  for (const a of armor) {
    if (a.ac.stat && a.ac.stat !== "DEX") {
      modsFromStat = calculateModifierForPlayerStat(pc, a.ac.stat);
    }

    modsFromArmor += a.ac.modifier;

    modsFromArmor += allActiveBonuses
      .filter(
        (b) =>
          b.type === "modifyAmt" &&
          b.metadata?.type === "armor" &&
          b.metadata.armor === a.name,
      )
      .reduce((acc, b: ModifyBonus) => acc + b.bonusAmount, 0);

    if (a.ac.base > 0) {
      shouldAddStat = Boolean(a.ac.stat);
      baseAC = Math.max(a.ac.base, baseAC);
    }
  }

  return (
    baseAC +
    modsFromUnrestrictedBonuses +
    modsFromGearBonuses +
    modsFromShields +
    modsFromArmor +
    (shouldAddStat ? modsFromStat : 0)
  );
}

export function calculateTitleForPlayer(pc: PlayerCharacter): Title | null {
  if (pc.level === 0 || pc.class === "") return null;
  try {
    return TITLE_MAP[pc.class][pc.alignment][
      Math.max(0, Math.floor((pc.level - 1) / 2))
    ];
  } catch {
    return null;
  }
}

export function calculateSpellCastingModifierForPlayer(
  pc: PlayerCharacter,
  spell: SpellInfo,
): number {
  let result = 0;
  const stat = spell.stat ?? (pc.class === "Priest" ? "WIS" : "INT");
  const baseModifier = calculateModifierForPlayerStat(pc, stat);
  result += baseModifier;

  // from bonuses
  const allActiveBonuses = [...resolveChoices(pc.bonuses), ...resolveChoices(getActiveCustomBonuses(pc))];
  const bonuses = allActiveBonuses
    .filter((b) => b.type === "modifyAmt" && b.bonusTo === "spellcastRoll")
    .reduce((acc: number, b: ModifyBonus) => {
      if (
        !b.metadata ||
        (b.metadata.type === "spell" && b.metadata.spell === spell.name)
      ) {
        acc += calculateBonusAmount(pc, b);
      }
      return acc;
    }, 0);

  result += bonuses;

  // from gear
  const gearBonuses = resolveChoices(getActiveGearBonuses(pc))
    .filter((b) => b.type === "modifyAmt" && b.bonusTo === "spellcastRoll")
    .reduce((acc: number, b: ModifyBonus) => {
      if (
        !b.metadata ||
        (b.metadata.type === "spell" && b.metadata.spell === spell.name)
      ) {
        acc += calculateBonusAmount(pc, b);
      }
      return acc;
    }, 0);

  result += gearBonuses;

  return result;
}

export function calculateDamageBonusForPlayerWeapon(
  pc: PlayerCharacter,
  w: WeaponInfo,
): number {
  let result = 0;

  const allActiveBonuses = [...resolveChoices(pc.bonuses), ...resolveChoices(getActiveCustomBonuses(pc))];
  const bonuses = allActiveBonuses
    .filter((b) => b.type === "modifyAmt" && b.bonusTo === "damageRoll")
    .reduce((acc: number, b: ModifyBonus) => {
      if (doesBonusApplyToWeapon(b, w)) {
        acc += calculateBonusAmount(pc, b);
      }
      return acc;
    }, 0);
  result += bonuses;

  // gear bonuses
  const gearBonuses = resolveChoices(getActiveGearBonuses(pc))
    // only apply bonuses to damageRoll
    .filter((b) => b.type === "modifyAmt" && b.bonusTo === "damageRoll")
    .reduce((acc: number, b: ModifyBonus) => {
      if (doesBonusApplyToWeapon(b, w)) {
        acc += calculateBonusAmount(pc, b);
      }
      return acc;
    }, 0);
  result += gearBonuses;

  return result;
}

export function calculateAttackBonusForPlayerWeapon(
  pc: PlayerCharacter,
  w: WeaponInfo,
): number {
  let result = 0;
  // melee vs ranged
  const strMod = calculateModifierForPlayerStat(pc, "STR");
  const dexMod = calculateModifierForPlayerStat(pc, "DEX");
  if (w.properties?.includes("Finesse") || w.weaponType === "MeleeRanged") {
    result += Math.max(strMod, dexMod);
  } else {
    result += w.weaponType === "Melee" ? strMod : dexMod;
  }

  // pc bonuses
  const allActiveBonuses = [...resolveChoices(pc.bonuses), ...resolveChoices(getActiveCustomBonuses(pc))];
  const bonuses = allActiveBonuses
    .filter((b) => b.type === "modifyAmt" && b.bonusTo === "attackRoll")
    .reduce((acc: number, b: ModifyBonus) => {
      if (doesBonusApplyToWeapon(b, w)) {
        acc += calculateBonusAmount(pc, b);
      }
      return acc;
    }, 0);
  result += bonuses;

  // gear bonuses
  const gearBonuses = resolveChoices(getActiveGearBonuses(pc))
    // only apply bonuses to attackRoll
    .filter((b) => b.type === "modifyAmt" && b.bonusTo === "attackRoll")
    .reduce((acc: number, b: ModifyBonus) => {
      if (doesBonusApplyToWeapon(b, w)) {
        acc += calculateBonusAmount(pc, b);
      }
      return acc;
    }, 0);
  result += gearBonuses;

  return result;
}

export function calculateGearSlotsForPlayer(pc: PlayerCharacter) {
  const base = Math.max(10, calculateStatValueForPlayerStat(pc, "STR"));

  const allActiveBonuses = [
    ...resolveChoices(pc.bonuses),
    ...resolveChoices(getActiveGearBonuses(pc)),
    ...resolveChoices(getActiveCustomBonuses(pc)),
  ];

  const bonuses = allActiveBonuses.reduce((acc: number, b: Bonus) => {
    if (b.type === "modifyAmt" && b.bonusTo === "gearSlots") {
      if (b.metadata?.type === "stat") {
        return (
          acc +
          Math.max(
            b.bonusAmount,
            calculateModifierForPlayerStat(pc, b.metadata.stat),
          )
        );
      } else {
        return acc + calculateBonusAmount(pc, b);
      }
    } else {
      return acc;
    }
  }, 0);

  return base + bonuses;
}

export function calculateFreeSlotsForPlayer(pc: PlayerCharacter): number {
  const costlyGear = pc.gear
    .filter((g) => findAny(g.name)?.slots?.freeCarry === 0)
    .sort((a, b) => alphabetically(a.name, b.name));

  const totalSlots = calculateGearSlotsForPlayer(pc);

  const freeSlots =
    totalSlots -
    costlyGear.reduce((acc, curr) => {
      return acc + slotsForGear(curr);
    }, 0);

  return freeSlots;
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
  return (
    pc.hasCustomClass ||
    spell.class.toLowerCase().includes(pc.class.toLowerCase())
  );
}

export function learnSpellForPlayer(pc: PlayerCharacter, spell: SpellInfo) {
  if (playerHasSpell(pc, spell)) return;
  pc.spells.push({ name: spell.name });
}

export function unlearnSpellForPlayer(pc: PlayerCharacter, spell: SpellInfo) {
  pc.spells = pc.spells.filter((s) => s.name !== spell.name);
}

export function getActiveGearBonuses(pc: PlayerCharacter): Bonus[] {
  return pc.gear
    .map((g) => ({ isEquipped: g.equipped, g: findAny(g.name) }))
    .filter(({ isEquipped, g }) => {
      return g && (!g.canBeEquipped || isEquipped);
    })
    .map(({ g }) => g.playerBonuses)
    .filter(Boolean)
    .flat();
}

export function getActiveCustomBonuses(pc: PlayerCharacter): Bonus[] {
  return (pc.customBonuses ?? [])
    .map((cb) => cb.bonuses)
    .filter(Boolean)
    .flat();
}

export function addCustomBonusToPlayer(pc: PlayerCharacter, cb: CustomBonus) {
  if (!pc.customBonuses) pc.customBonuses = [];
  pc.customBonuses.push(cb);
}

export function deleteCustomBonusForPlayer(
  pc: PlayerCharacter,
  theCustomBonus: CustomBonus,
) {
  pc.customBonuses = (pc.customBonuses ?? []).filter(
    (cb) => cb.name !== theCustomBonus.name,
  );
}

export function addBonusToPlayer(pc: PlayerCharacter, b: Bonus) {
  pc.bonuses.push(b);
}

export function deleteBonusForPlayer(pc: PlayerCharacter, theBonus: Bonus) {
  pc.bonuses = pc.bonuses.filter((b) => b !== theBonus);
}

export function calculateTotalHitPointsForPlayer(pc: PlayerCharacter): number {
  const baseMaxHP = pc.maxHitPoints;
  const allActiveBonuses = [
    ...resolveChoices(pc.bonuses),
    ...resolveChoices(getActiveGearBonuses(pc)),
    ...resolveChoices(getActiveCustomBonuses(pc)),
  ];
  const bonuses = allActiveBonuses
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
  b: ModifyBonus,
): number {
  let result = b.bonusAmount;

  if (b.bonusTo !== "stat" && b.metadata?.type === "stat") {
    result = Math.max(
      result,
      calculateModifierForPlayerStat(pc, b.metadata.stat),
    );
  }
  const levelRateBonus = Math.floor(
    pc.level * (b.bonusIncreaseRatePerLevel ?? 0),
  );
  return result + levelRateBonus;
}

export function deleteCustomPlayerSpell(pc: PlayerCharacter, spell: SpellInfo) {
  pc.spells = pc.spells.filter((s) => s.name !== spell.name);
  pc.bonuses = pc.bonuses.filter((b) => {
    if (b.metadata?.type === "spell" && b.metadata.spell === spell.name)
      return false;
    return true;
  });
  pc.customSpells = pc.customSpells.filter((s) => s.name !== spell.name);
}

function isArmorShield(g: GearInfo): boolean {
  return g.type === "Armor" && g.properties?.includes("OneHanded");
}

function isWearableArmor(g: GearInfo): boolean {
  return g.type === "Armor" && !g.properties?.includes("OneHanded");
}

export function canPlayerAffordGear(pc: PlayerCharacter, g: GearInfo) {
  const { gp, sp, cp } = g.cost;
  const convertedCost = gp * 100 + sp * 10 + cp;
  const pcConverted = pc.gold * 100 + pc.silver * 10 + pc.copper;
  return pcConverted >= convertedCost;
}

export function canPlayerEquipGear(pc: PlayerCharacter, gear: Gear) {
  if (gear.equipped) return false;
  const g = findAny(gear.name);
  if (!g || !g.canBeEquipped) return false;

  if (isWearableArmor(g)) {
    const equippedArmor = pc.gear
      .filter((a) => a.equipped)
      .map((a) => findAny(a.name))
      .filter(isWearableArmor);
    return equippedArmor.length === 0; // must not be wearing armor
  }

  const freeHands = calculateFreeHands(pc);

  if (freeHands <= 0) return false;
  if (freeHands == 2) return true;

  // we know the pc has only 1 free hand here
  if (g.type === "Weapon") {
    const w = g as WeaponInfo;
    return Boolean(w.damage.oneHanded);
  } else if (isArmorShield(g)) {
    return freeHands >= 1;
  }

  // custom equippable gear can always be equipped
  return true;
}

export function calculateFreeHands(pc: PlayerCharacter): number {
  let freeHands = 2;

  const equippedWeapons = pc.gear
    .filter((w) => w.equipped)
    .map((w) => findAny(w.name))
    .filter((w) => w.type === "Weapon")
    .map((w) => w as WeaponInfo);

  const equippedArmor = pc.gear
    .filter((a) => a.equipped)
    .map((a) => findAny(a.name))
    .filter((a) => a.type === "Armor");

  // shields and weapons take up hands
  freeHands -= equippedWeapons.reduce((acc, w) => {
    const isWeaponOneHandable = Boolean(w.damage.oneHanded);
    return acc + (isWeaponOneHandable ? 1 : 2);
  }, 0);

  freeHands -= equippedArmor.filter(
    (a) => a.properties?.includes("OneHanded"),
  ).length;

  return freeHands;
}
