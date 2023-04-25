import type { ArmorInfo } from "../model/Armor";
import type { GearInfo } from "../model/Gear";
import type { SpellInfo } from "../model/Spell";
import type { WeaponInfo } from "../model/Weapon";
import ARMOR_COMPENDIUM from "./armorCompendium";
import GEAR_COMPENDIUM from "./basicGearCompendium";
import MAGIC_ITEM_COMPENDIUM from "./magicItemCompendium";
import SPELL_COMPENDIUM from "./spellCompendium";
import WEAPON_COMPENDIUM from "./weaponCompendium";
import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";
import type { PlayerCharacter } from "../model/PlayerCharacter";

let customGear: GearInfo[] = [];

export function subscribeToCustomGearForPlayer() {
  pc.subscribe((pc) => {
    customGear = pc.customGear ?? [];
  });
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
export function findSpell(name: string): SpellInfo {
  return SPELL_COMPENDIUM[name.toLowerCase()];
}
export function findCustom(name: string): GearInfo {
  return customGear.find((g) => g.name.toLowerCase() === name.toLowerCase());
}
export function findAny(name: string): GearInfo {
  return (
    findWeapon(name) || findArmor(name) || findGear(name) || findCustom(name)
  );
}
