import { describe, it, expect } from "vitest";
import { defaultPC, calculateGearSlotsForPlayer, addBonusToPlayer } from "./PlayerCharacter";

describe("PlayerCharacter Gear Slots", () => {
  it("should calculate gear slots based on base strength if strength is unmodified", () => {
    const pc = defaultPC();
    pc.stats.STR = 12;
    expect(calculateGearSlotsForPlayer(pc)).toBe(12);
  });

  it("should have at least 10 gear slots even if strength is less than 10", () => {
    const pc = defaultPC();
    pc.stats.STR = 8;
    expect(calculateGearSlotsForPlayer(pc)).toBe(10);
  });

  it("should increase gear slots when strength is modified by a custom bonus or talent", () => {
    const pc = defaultPC();
    pc.stats.STR = 12;
    
    // Add a custom bonus modifying STR
    addBonusToPlayer(pc, {
      name: "Belt of Giant Strength",
      desc: "+2 Strength",
      type: "modifyAmt",
      bonusTo: "stat",
      bonusAmount: 2,
      metadata: {
        type: "stat",
        stat: "STR",
      },
    });

    // Modified strength is 14, so gear slots should be 14
    expect(calculateGearSlotsForPlayer(pc)).toBe(14);
  });
});
