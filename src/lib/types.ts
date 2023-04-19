export type Merge<T, R> = Omit<T, keyof R> & R;

export type DiceType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";

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

export type DurationType = "Focus" | "Instant" | TimeUnit;

export type Roll = {
  diceType: DiceType;
  numDice: number;
};
