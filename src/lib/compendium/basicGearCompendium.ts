import type { GearInfo } from "../types";

const GEAR: GearInfo[] = [
  {
    name: "Pole",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Rope, 60'",
    cost: { gp: 1, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Oil, Flask",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Light Spell (Double Range)",
    cost: { gp: 0, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 1 },
  },
  {
    name: "Iron Spikes",
    cost: { gp: 1, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 10, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Flint and Steel",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Mirror",
    cost: { gp: 10, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Rations",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 3, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Crowbar",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Light Spell",
    cost: { gp: 0, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 1 },
  },
  {
    name: "Caltrops",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Flask",
    cost: { gp: 0, sp: 3, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Arrows",
    cost: { gp: 1, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 20, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Bottle",
    cost: { gp: 0, sp: 3, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Grappling Hook",
    cost: { gp: 1, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Crossbow Bolts",
    cost: { gp: 1, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 20, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Lantern",
    cost: { gp: 5, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Thieves' Tools",
    cost: { gp: 0, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 1 },
  },
  {
    name: "Backpack",
    cost: { gp: 2, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 1 },
  },
  {
    name: "Light Spell (Double Time)",
    cost: { gp: 0, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 1 },
  },
  {
    name: "Holy Symbol",
    cost: { gp: 0, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 1 },
  },
  {
    name: "Torch",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
  },
  {
    name: "Thieving Tools",
    cost: { gp: 0, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 0, freeCarry: 1 },
  },
  {
    name: "Holy Symbol",
    cost: { gp: 0, sp: 0, cp: 0 },
    canBeEquipped: false,
    type: "Basic",
    slots: { perSlot: 1, slotsUsed: 0, freeCarry: 1 },
  },
];

const GEAR_COMPENDIUM: { [name: string]: GearInfo } = {};
for (const g of GEAR) {
  GEAR_COMPENDIUM[g.name.toLowerCase()] = g;
}

export default GEAR_COMPENDIUM;
