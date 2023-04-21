import type { Merge } from "../types";
import type { Bonus } from "./Bonus";

export type GenericTalent = {
  name: string;
  type: "generic";
};

export type BonusTalent = Merge<
  GenericTalent,
  {
    type: "bonus";
    bonuses: Bonus[];
  }
>;

export type Talent = GenericTalent | BonusTalent;
