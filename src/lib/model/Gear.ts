import { findAny } from "../compendium";
import type { Gear } from "../types";

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
