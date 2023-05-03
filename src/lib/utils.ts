import { findAny } from "./compendium";
import { ValueForDiceType } from "./constants";
import type { Gear, GearInfo } from "./model/Gear";
import type { DiceType } from "./types";

export function clamp(n: number, min: number, max: number): number {
  return Math.max(Math.min(max, n), min);
}

export function rollDice(diceType: DiceType, numDice = 1): number {
  let result = 0;
  for (let i = 0; i < numDice; i++) {
    result += Math.floor(Math.random() * ValueForDiceType[diceType]) + 1;
  }
  return result;
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

// eslint-disable-next-line
export function debounce<F extends (...args: any[]) => any>(fn: F, ms = 500) {
  let timer: NodeJS.Timeout;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        resolve(fn(...args));
      }, ms);
    });
}

// eslint-disable-next-line
export function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}
