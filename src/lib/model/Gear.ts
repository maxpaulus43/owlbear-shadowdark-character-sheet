import type { ShieldProperty } from "./Armor";
import type { Bonus } from "./Bonus";
import type { WeaponProperty } from "./Weapon";

export type Cost = { gp: number; sp: number; cp: number };
export type Currency = keyof Cost;

export type GearProperty = ShieldProperty | WeaponProperty | "Magic";

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
