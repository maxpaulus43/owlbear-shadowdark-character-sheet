import type { DiceType } from "../model";

export function clamp(n: number, min: number, max: number): number {
  return Math.max(Math.min(max, n), min);
}

export function rollDice(diceType: DiceType): number {
  return Math.floor(Math.random() * diceType) + 1;
}
