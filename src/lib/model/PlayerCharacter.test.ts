import { describe, it, expect } from "vitest";
import {
  defaultPC,
  calculateGearSlotsForPlayer,
  calculateStatValueForPlayerStat,
  calculateTotalHitPointsForPlayer,
  calculateArmorClassForPlayer,
  addBonusToPlayer,
  addCustomBonusToPlayer,
  setAncestryForPlayer,
  calculateSpellCastingModifierForPlayer,
  calculateAttackBonusForPlayerWeapon,
} from "./PlayerCharacter";
import { ensureAncestryBonuses } from "../services/AncestryClassEnsurer";
import { setCustomGearForPlayer } from "../compendium";
import { ShadowdarkCharacterSchema } from "../services/sync/SyncTypes";

describe("PlayerCharacter Multi-Bonus calculations", () => {
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

  it("should increase gear slots when strength is modified by a custom bonus or talent in legacy pc.bonuses", () => {
    const pc = defaultPC();
    pc.stats.STR = 12;
    
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

    expect(calculateGearSlotsForPlayer(pc)).toBe(14);
  });

  it("should increase stats, HP, AC, and gear slots from nested bonuses inside pc.customBonuses", () => {
    const pc = defaultPC();
    pc.stats.STR = 12;

    // Create a CustomBonus that has multiple sub-bonuses
    addCustomBonusToPlayer(pc, {
      name: "Artifact of Power",
      desc: "Grants +2 STR, +5 HP, and +1 AC",
      editable: true,
      bonuses: [
        {
          type: "modifyAmt",
          bonusTo: "stat",
          bonusAmount: 2,
          metadata: {
            type: "stat",
            stat: "STR",
          },
        },
        {
          type: "modifyAmt",
          bonusTo: "hp",
          bonusAmount: 5,
        },
        {
          type: "modifyAmt",
          bonusTo: "armorClass",
          bonusAmount: 1,
        },
      ],
    });

    // 1. Stat value should be 12 + 2 = 14
    expect(calculateStatValueForPlayerStat(pc, "STR")).toBe(14);
    // 2. HP should be base (1) + 5 = 6
    expect(calculateTotalHitPointsForPlayer(pc)).toBe(6);
    // 3. AC should be base (10) + DEX modifier (0) + 1 = 11
    expect(calculateArmorClassForPlayer(pc)).toBe(11);
    // 4. Gear slots should equal modified Strength (14)
    expect(calculateGearSlotsForPlayer(pc)).toBe(14);
  });

  it("should increase stats, HP, and AC from bonuses on equipped custom gear", () => {
    const pc = defaultPC();
    pc.stats.STR = 10;
    pc.stats.DEX = 10;

    // Create a custom gear and add it to character
    const magicRing = {
      name: "Ring of Protection",
      type: "Basic" as const,
      canBeEquipped: true,
      slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
      cost: { gp: 100, sp: 0, cp: 0 },
      playerBonuses: [
        {
          type: "modifyAmt" as const,
          bonusTo: "armorClass" as const,
          bonusAmount: 2,
        },
        {
          type: "modifyAmt" as const,
          bonusTo: "hp" as const,
          bonusAmount: 3,
        },
      ],
    };

    // Add to custom gear compendium lookup simulation
    pc.customGear.push(magicRing);
    setCustomGearForPlayer(pc);

    // Add to inventory, but NOT equipped
    pc.gear.push({
      name: "Ring of Protection",
      quantity: 1,
      equipped: false,
    });

    // Bonuses should NOT apply yet since it's not equipped
    expect(calculateArmorClassForPlayer(pc)).toBe(10);
    expect(calculateTotalHitPointsForPlayer(pc)).toBe(1);

    // Equip the ring
    pc.gear[0].equipped = true;

    // Bonuses should now apply
    expect(calculateArmorClassForPlayer(pc)).toBe(12);
    expect(calculateTotalHitPointsForPlayer(pc)).toBe(4);
  });

  it("should validate successfully against ShadowdarkCharacterSchema for sync functions", () => {
    const pc = defaultPC();
    
    // Add custom bonus with nested nameless bonuses
    addCustomBonusToPlayer(pc, {
      name: "Artifact of Power",
      desc: "Grants +2 STR and +5 HP",
      editable: true,
      bonuses: [
        {
          type: "modifyAmt",
          bonusTo: "stat",
          bonusAmount: 2,
          metadata: {
            type: "stat",
            stat: "STR",
          },
        },
        {
          type: "modifyAmt",
          bonusTo: "hp",
          bonusAmount: 5,
        },
      ],
    });

    // Add custom gear with nested nameless bonuses
    pc.customGear.push({
      name: "Ring of Protection",
      type: "Basic",
      canBeEquipped: true,
      slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 },
      cost: { gp: 100, sp: 0, cp: 0 },
      playerBonuses: [
        {
          type: "modifyAmt",
          bonusTo: "armorClass",
          bonusAmount: 2,
        },
      ],
    });

    // Verify it parses cleanly without throwing ZodError
    expect(() => ShadowdarkCharacterSchema.parse(pc)).not.toThrow();
  });

  describe("Ancestry bonuses and choices", () => {
    it("should set up languages and unselected Knack choice bonus for Kobold", () => {
      const pc = defaultPC();
      setAncestryForPlayer(pc, "Kobold");
      expect(pc.languages).toContain("Common");
      expect(pc.languages).toContain("Draconic");
      
      const knack = pc.bonuses.find((b) => b.name === "Knack");
      expect(knack).toBeDefined();
      expect(knack?.type).toBe("choice");
      expect(knack?.selectedChoiceId).toBe("");
    });

    it("should resolve choices correctly when selected", () => {
      const pc = defaultPC();
      setAncestryForPlayer(pc, "Elf");
      
      const farsight = pc.bonuses.find((b) => b.name === "Farsight");
      expect(farsight).toBeDefined();
      expect(farsight?.type).toBe("choice");
      expect(farsight?.selectedChoiceId).toBe("");

      // With no choice selected, spellcast bonus should be 0
      const spell = { name: "Magic Missile", class: "Wizard" as const, tier: 1 as const, range: "Near" as const, duration: { type: "Instant" as const }, desc: "" };
      expect(calculateSpellCastingModifierForPlayer(pc, spell)).toBe(0);

      // Select spellcasting
      farsight!.selectedChoiceId = "spellcasting";
      expect(calculateSpellCastingModifierForPlayer(pc, spell)).toBe(1);

      // Select ranged attacks
      farsight!.selectedChoiceId = "ranged";
      expect(calculateSpellCastingModifierForPlayer(pc, spell)).toBe(0);
      
      const bow = { name: "Longbow", type: "Weapon" as const, canBeEquipped: true, slots: { perSlot: 1, slotsUsed: 1, freeCarry: 0 }, cost: { gp: 8, sp: 0, cp: 0 }, damage: { twoHanded: { diceType: "d8" as const, numDice: 1 } }, range: "Far" as const, weaponType: "Ranged" as const };
      expect(calculateAttackBonusForPlayerWeapon(pc, bow)).toBe(1); // DEX is 10, modifier is 0, bonus is 1
    });

    it("should preserve selected choice when ensuring ancestry bonuses", () => {
      const pc = defaultPC();
      setAncestryForPlayer(pc, "Elf");
      
      const farsight = pc.bonuses.find((b) => b.name === "Farsight");
      farsight!.selectedChoiceId = "spellcasting";

      // Re-ensure bonuses (e.g. during load/sync)
      ensureAncestryBonuses(pc);

      const resolved = pc.bonuses.find((b) => b.name === "Farsight");
      expect(resolved).toBeDefined();
      expect(resolved?.selectedChoiceId).toBe("spellcasting");
    });

    it("should eliminate bonus when changing ancestry", () => {
      const pc = defaultPC();
      setAncestryForPlayer(pc, "Elf");
      expect(pc.bonuses.find((b) => b.name === "Farsight")).toBeDefined();

      setAncestryForPlayer(pc, "Dwarf");
      expect(pc.bonuses.find((b) => b.name === "Farsight")).toBeUndefined();
      expect(pc.bonuses.find((b) => b.name === "Stout")).toBeDefined();
    });
  });
});
