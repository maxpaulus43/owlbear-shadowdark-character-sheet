import type { LANGUAGES } from "../constants";
import type { Bonus } from "../model/Bonus";
import type { Gear } from "../model/Gear";
import type {
  Ancestry,
  Class,
  PlayerCharacter,
} from "../model/PlayerCharacter";

export function ensureLanguages(pc: PlayerCharacter) {
  const languages: (typeof LANGUAGES)[number][] = ["Common"];
  switch (pc.ancestry) {
    case "Elf":
      languages.push("Elvish", "Sylvan");
      break;
    case "Human":
      break;
    case "Dwarf": {
      languages.push("Dwarvish");
      break;
    }
    case "Goblin": {
      languages.push("Goblin");
      break;
    }
    case "Halfling": {
      break;
    }
    case "Half-Orc": {
      languages.push("Orcish");
      break;
    }
  }
  for (const l of languages) {
    if (!pc.languages.includes(l)) {
      pc.languages.push(l);
    }
  }
}

export function ensureAncestryBonuses(pc: PlayerCharacter) {
  clearAncestryBonuses(pc);
  addAncestryBonuses(pc.bonuses, pc.ancestry);
}

export function ensureClassBonuses(pc: PlayerCharacter) {
  clearClassBonuses(pc);
  if (pc.class === "") return;
  addClassBonuses(pc.bonuses, pc.class);
}

export function ensureClassGear(pc: PlayerCharacter) {
  clearClassGear(pc);
  if (pc.class === "") return;
  addClassGear(pc.gear, pc.class);
}

function clearAncestryBonuses(pc: PlayerCharacter) {
  pc.bonuses = pc.bonuses.filter(
    (b) =>
      ![
        "Stout",
        "Keen senses",
        "Stealthy",
        "Mighty Attack ancestry",
        "Mighty Damage ancestry",
      ].includes(b.name)
  );
}

function clearClassBonuses(pc: PlayerCharacter) {
  pc.bonuses = pc.bonuses.filter(
    (b) =>
      !["Thievery", "Backstab", "Learning Spells", "Hauler"].includes(b.name) &&
      !b.name.includes("Thievery:")
  );
}

function clearClassGear(pc: PlayerCharacter) {
  pc.gear = pc.gear.filter((g) => !["Thieving Tools"].includes(g.name));
}

function addClassGear(gear: Gear[], c: Class) {
  if (c === "Thief" && !gear.find((g) => g.name === "Thieving Tools")) {
    gear.push({ name: "Thieving Tools", quantity: 1 });
  }
}

function addAncestryBonuses(bonuses: Bonus[], a: Ancestry) {
  switch (a) {
    case "Elf":
      break;
    case "Human":
      break;
    case "Dwarf": {
      const name = "Stout";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push({
          name,
          bonusSource: "Ancestry",
          desc: "Roll your hit point gains with advantage",
          type: "advantage",
          bonusTo: "hpRoll",
        });
      }
      break;
    }
    case "Goblin": {
      const name = "Keen senses";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push({
          name,
          bonusSource: "Ancestry",
          desc: "You can't be surprised",
          type: "generic",
        });
      }
      break;
    }
    case "Halfling": {
      const name = "Stealthy";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push({
          name,
          bonusSource: "Ancestry",
          desc: "Once per day, you can become invisible for 3 rounds",
          type: "generic",
        });
      }
      break;
    }
    case "Half-Orc": {
      const nameAtk = "Mighty Attack ancestry";
      const nameDmg = "Mighty Damage ancestry";
      if (!bonuses.find((b) => b.name === nameAtk || b.name === nameDmg)) {
        bonuses.push(
          {
            name: nameAtk,
            desc: "You have a +1 bonus to attack rolls with melee weapons",
            bonusSource: "Ancestry",
            type: "modifyAmt",
            bonusTo: "attackRoll",
            bonusAmount: 1,
            metadata: {
              type: "weaponType",
              weaponType: "Melee",
            },
          },
          {
            name: nameDmg,
            desc: "You have a +1 bonus to damage rolls with melee weapons",
            bonusSource: "Ancestry",
            type: "modifyAmt",
            bonusTo: "damageRoll",
            bonusAmount: 1,
            metadata: {
              type: "weaponType",
              weaponType: "Melee",
            },
          }
        );
      }
      break;
    }
  }
}

function addClassBonuses(bonuses: Bonus[], c: Class) {
  switch (c) {
    case "Thief": {
      let name = "Thievery";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name,
            bonusSource: "Class",
            desc: "Advantage on Climbing",
            type: "generic",
          },
          {
            name: name + ": Sneaking/Hiding",
            bonusSource: "Class",
            desc: "Advantage on Sneaking/Hiding",
            type: "generic",
          },
          {
            name: name + ": disguises",
            bonusSource: "Class",
            desc: "Advantage on applying disguises",
            type: "generic",
          },
          {
            name: name + ": traps",
            bonusSource: "Class",
            desc: "Advantage on disabling traps",
            type: "generic",
          },
          {
            name: name + ": delicate",
            bonusSource: "Class",
            desc: "Advantage on picking pockets/opening locks",
            type: "generic",
          }
        );
      }

      name = "Backstab";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push({
          name,
          bonusSource: "Class",
          desc: "+1 additional weapon dice of damage on unaware enemies",
          type: "modifyAmt",
          bonusTo: "backstabDice",
          bonusAmount: 1,
          bonusIncreaseRatePerLevel: 0.5,
        });
      }
      break;
    }
    case "Priest": {
      break;
    }
    case "Wizard": {
      const name = "Learning Spells";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push({
          name,
          bonusSource: "Class",
          desc: "Study a scroll (1 Day) + DC 15 check to permanently learn scroll",
          type: "generic",
        });
      }
      break;
    }
    case "Fighter": {
      const name = "Hauler";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push({
          name,
          bonusSource: "Class",
          desc: "Add Your CON Modifer, if positive, to your total gear slots",
          type: "modifyAmt",
          bonusTo: "gearSlots",
          bonusAmount: 0,
          metadata: {
            type: "stat",
            stat: "CON",
          },
        });
      }
      break;
    }
  }
}
