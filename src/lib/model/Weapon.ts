import type { Merge, RangeType, Roll } from "../types";
import type { GearInfo } from "./Gear";

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
