import type { Merge, RangeType, Roll } from "../types";
import { rollToString } from "../types";
import type { GearInfo } from "./Gear";
import { calculateDamageBonusForPlayerWeapon } from "./PlayerCharacter";
import type { PlayerCharacter } from "./PlayerCharacter";
import { addSign } from "../utils";

export type WeaponType = "Melee" | "Ranged" | "MeleeRanged";

export type WeaponProperty =
  | "Finesse"
  | "Loading"
  | "Thrown"
  | "Versatile"
  | "Magic";

export type WeaponInfo = Merge<
  GearInfo,
  {
    type: "Weapon";
    properties?: WeaponProperty[];
    damage: {
      oneHanded?: Roll;
      twoHanded?: Roll;
    };
    range: RangeType | RangeType[];
    weaponType: WeaponType;
  }
>;

export function damageStringForPlayerWeapon(
  pc: PlayerCharacter,
  w: WeaponInfo
): string {
  let result = "";
  if (w.damage.oneHanded) result += rollToString(w.damage.oneHanded);
  if (w.damage.twoHanded) {
    result += `${result.length > 0 ? "/" : ""}${rollToString(
      w.damage.twoHanded
    )}`;
  }
  const modifier = calculateDamageBonusForPlayerWeapon(pc, w);
  if (modifier !== 0) result = `(${result})${addSign(modifier)}`;
  return result;
}
