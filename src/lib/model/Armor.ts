import type { Merge } from "../types";
import type { GearInfo } from "./Gear";
import type { Stat } from "./PlayerCharacter";

export const SHIELD_PROPERTIES = ["Shield", "OneHanded", "TwoHanded"] as const;

export type ShieldProperty = (typeof SHIELD_PROPERTIES)[number];

export type ArmorAC = {
  base: number;
  modifier: number;
  stat?: Stat;
};

export type ArmorInfo = Merge<
  GearInfo,
  {
    type: "Armor";
    ac: ArmorAC;
  }
>;
