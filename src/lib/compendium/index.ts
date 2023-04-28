import type { ArmorInfo } from "../model/Armor";
import type { GearInfo } from "../model/Gear";
import type { PlayerCharacter } from "../model/PlayerCharacter";
import type { SpellInfo } from "../model/Spell";
import type { WeaponInfo } from "../model/Weapon";
import ARMOR_COMPENDIUM from "./armorCompendium";
import GEAR_COMPENDIUM from "./basicGearCompendium";
import MAGIC_ITEM_COMPENDIUM from "./magicItemCompendium";
import SPELL_COMPENDIUM from "./spellCompendium";
import WEAPON_COMPENDIUM from "./weaponCompendium";

let customGear: GearInfo[] = [];
let customSpells: SpellInfo[] = [];

export function setCustomGearForPlayer(pc: PlayerCharacter) {
  customGear = pc.customGear ?? [];
  customSpells = pc.customSpells ?? [];
}

export function findWeapon(name: string): WeaponInfo {
  return WEAPON_COMPENDIUM[name.toLowerCase()];
}
export function findArmor(name: string): ArmorInfo {
  return ARMOR_COMPENDIUM[name.toLowerCase()];
}
export function findGear(name: string): GearInfo {
  return (
    GEAR_COMPENDIUM[name.toLowerCase()] ||
    MAGIC_ITEM_COMPENDIUM[name.toLowerCase()]
  );
}
export function findCustomSpell(name: string): SpellInfo {
  return customSpells.find((s) => s.name.toLowerCase() === name.toLowerCase());
}
export function findSpell(name: string): SpellInfo {
  return SPELL_COMPENDIUM[name.toLowerCase()] || findCustomSpell(name);
}
export function findCustomGear(name: string): GearInfo {
  return customGear.find((g) => g.name.toLowerCase() === name.toLowerCase());
}
export function findAny(name: string): GearInfo {
  return (
    findWeapon(name) ||
    findArmor(name) ||
    findGear(name) ||
    findCustomGear(name)
  );
}
