import type { WeaponInfo } from "../model/Weapon";

export const WEAPONS: WeaponInfo[] = [
  {
    name: "Bastard Sword",
    type: "Weapon",
    cost: { gp: 10, sp: 0, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 2 },
    properties: ["Versatile"],
    range: "Close",
    weaponType: "Melee",
    damage: {
      oneHanded: { diceType: "d8", numDice: 1 },
      twoHanded: { diceType: "d10", numDice: 1 },
    },
  },
  {
    name: "Greataxe",
    type: "Weapon",
    cost: { gp: 10, sp: 0, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 2 },
    properties: ["Versatile"],
    range: "Close",
    weaponType: "Melee",
    damage: {
      oneHanded: { diceType: "d8", numDice: 1 },
      twoHanded: { diceType: "d10", numDice: 1 },
    },
  },
  {
    name: "Staff",
    type: "Weapon",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    properties: ["Versatile"],
    range: "Close",
    weaponType: "Melee",
    damage: {
      twoHanded: { diceType: "d4", numDice: 1 },
    },
  },
  {
    name: "Javelin",
    type: "Weapon",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    properties: ["Thrown"],
    range: ["Close", "Far"],
    weaponType: "MeleeRanged",
    damage: {
      oneHanded: { diceType: "d4", numDice: 1 },
    },
  },
  {
    name: "Dagger",
    type: "Weapon",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    properties: ["Finesse", "Thrown"],
    range: ["Close", "Near"],
    weaponType: "MeleeRanged",
    damage: {
      oneHanded: { diceType: "d4", numDice: 1 },
    },
  },
  {
    name: "Longbow",
    type: "Weapon",
    cost: { gp: 8, sp: 0, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    range: ["Far"],
    weaponType: "Ranged",
    damage: {
      twoHanded: { diceType: "d8", numDice: 1 },
    },
  },
  {
    name: "Shortbow",
    type: "Weapon",
    cost: { gp: 6, sp: 0, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    range: ["Far"],
    weaponType: "Ranged",
    damage: {
      twoHanded: { diceType: "d4", numDice: 1 },
    },
  },
  {
    name: "Club",
    type: "Weapon",
    cost: { gp: 0, sp: 0, cp: 5 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    range: ["Close"],
    weaponType: "Melee",
    damage: {
      oneHanded: { diceType: "d4", numDice: 1 },
    },
  },
  {
    name: "Greatsword",
    type: "Weapon",
    cost: { gp: 12, sp: 0, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 2 },
    range: ["Close"],
    weaponType: "Melee",
    damage: {
      twoHanded: { diceType: "d8", numDice: 1 },
    },
  },
  {
    name: "Longsword",
    type: "Weapon",
    cost: { gp: 9, sp: 0, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    range: ["Close"],
    weaponType: "Melee",
    damage: {
      oneHanded: { diceType: "d8", numDice: 1 },
    },
  },
  {
    name: "Shortsword",
    type: "Weapon",
    cost: { gp: 7, sp: 0, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    range: ["Close"],
    weaponType: "Melee",
    damage: {
      oneHanded: { diceType: "d6", numDice: 1 },
    },
  },
  {
    name: "Spear",
    type: "Weapon",
    cost: { gp: 0, sp: 5, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    properties: ["Thrown"],
    range: ["Close", "Near"],
    weaponType: "MeleeRanged",
    damage: {
      oneHanded: { diceType: "d6", numDice: 1 },
    },
  },
  {
    name: "Crossbow",
    type: "Weapon",
    cost: { gp: 8, sp: 0, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    properties: ["Loading"],
    range: ["Far"],
    weaponType: "Ranged",
    damage: {
      twoHanded: { diceType: "d6", numDice: 1 },
    },
  },
  {
    name: "Mace",
    type: "Weapon",
    cost: { gp: 5, sp: 0, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 1 },
    range: ["Close"],
    weaponType: "Melee",
    damage: {
      oneHanded: { diceType: "d6", numDice: 1 },
    },
  },
  {
    name: "Warhammer",
    type: "Weapon",
    cost: { gp: 10, sp: 0, cp: 0 },
    canBeEquipped: true,
    slots: { freeCarry: 0, perSlot: 1, slotsUsed: 2 },
    range: ["Close"],
    weaponType: "Melee",
    damage: {
      twoHanded: { diceType: "d10", numDice: 1 },
    },
  },
];

const WEAPON_COMPENDIUM: { [name: string]: WeaponInfo } = {};
for (const w of WEAPONS) {
  WEAPON_COMPENDIUM[w.name.toLowerCase()] = w;
}
export default WEAPON_COMPENDIUM;
