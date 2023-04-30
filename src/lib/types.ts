export type Merge<T, R> = Omit<T, keyof R> & R;

export const DICE_TYPES = ["d4", "d6", "d8", "d10", "d12", "d20"] as const;
export type DiceType = (typeof DICE_TYPES)[number];

export function compareDiceType(a: DiceType, b: DiceType) {
  return (
    DICE_TYPES.findIndex((d) => d === a) - DICE_TYPES.findIndex((d) => d === b)
  );
}

export type RangeType = "Self" | "Close" | "Near" | "Far";

export type TimeUnit =
  | "Second"
  | "Minute"
  | "Round"
  | "Hour"
  | "Day"
  | "Week"
  | "Month"
  | "Year";

export type DurationSubType = "InGame" | "RealTime";

export type DurationType = "Focus" | "Instant" | TimeUnit;

export type Roll = {
  diceType: DiceType;
  numDice: number;
};
