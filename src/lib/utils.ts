import { findAny } from "./compendium";
import { ValueForDiceType } from "./constants";
import type { Gear, GearInfo } from "./model/Gear";
import type { DiceType } from "./types";

export function clamp(n: number, min: number, max: number): number {
  return Math.max(Math.min(max, n), min);
}

export function rollDice(diceType: DiceType): number {
  return Math.floor(Math.random() * ValueForDiceType[diceType]) + 1;
}

export function addSign(n: number): string {
  return `${n >= 0 ? "+" : ""}${n}`;
}

export function alphabetically(a: string, b: string): number {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

export function toInfo<T extends GearInfo>(g: Gear): T {
  return findAny(g.name) as T;
}
