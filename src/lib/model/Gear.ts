import { findAny } from "../compendium";
import type { ShieldProperty } from "./Armor";
import type { Bonus } from "./Bonus";
import type { WeaponProperty } from "./Weapon";

export type Cost = { gp: number; sp: number; cp: number };
export type Currency = keyof Cost;

export type GearProperty =
  | ShieldProperty
  | WeaponProperty
  | "Magic"
  | "Attackable"; // attackable means it can show up in the attacks view

export type GearType = "Basic" | "Armor" | "Sundry" | "Weapon";

export type GearInfo = {
  name: string;
  properties?: GearProperty[];
  type: GearType;
  canBeEquipped: boolean;
  slots: { perSlot: number; slotsUsed: number; freeCarry: number };
  cost: Cost;
  desc?: string;
  playerBonuses?: Bonus[];
  editable?: boolean;
};

export type Gear = {
  name: string;
  quantity: number;
  equipped?: boolean;
};

export function slotsForGear(g: Gear): number {
  const foundGear = findAny(g.name);
  if (!foundGear) {
    console.log("Cannot find gear: " + g.name);
    return 0;
  }
  return (
    Math.ceil(g.quantity / foundGear.slots.perSlot) * foundGear.slots.slotsUsed
  );
}
