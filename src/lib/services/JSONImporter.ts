import { findAny, findSpell } from "../compendium";
import { SCHEMA_TYPE } from "../constants";
import type { Bonus, SDBonus } from "../model/Bonus";
import type { Gear } from "../model/Gear";
import type {
  Ancestry,
  Class,
  PlayerCharacter,
} from "../model/PlayerCharacter";
import type { SpellInfo } from "../model/Spell";

export function importFromJson(jsonStr: string): PlayerCharacter {
  const json = JSON.parse(jsonStr);
  if (json["schemaType"] === SCHEMA_TYPE) {
    const p = json as PlayerCharacter;
    maintainBackwardsCompat(p);
    return p;
  } else {
    return importFromShadowDarklingsJson(json);
  }
}

export function maintainBackwardsCompat(pc: PlayerCharacter) {
  if (!pc["customGear"]) {
    pc["customGear"] = [];
  }
  if (!pc["customBonuses"]) {
    pc["customBonuses"] = [];
  }
  if (!pc["customTalents"]) {
    pc["customTalents"] = [];
  }
  if (!pc["customLanguages"]) {
    pc["customLanguages"] = [];
  }

  addAncestryBonusesIfNecessary(pc.bonuses, pc.ancestry);
  addClassBonusesIfNecessary(pc.bonuses, pc.class);
  addClassGearIfNecessary(pc.gear, pc.class);
}

function addClassGearIfNecessary(gear: Gear[], c: Class) {
  if (c === "Thief" && !gear.find((g) => g.name === "Thieving Tools")) {
    gear.push({ name: "Thieving Tools", quantity: 1 });
  }
}

function addAncestryBonusesIfNecessary(bonuses: Bonus[], a: Ancestry) {
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

function addClassBonusesIfNecessary(bonuses: Bonus[], c: Class) {
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
      break;
    }
  }
}

function importFromShadowDarklingsJson(json: any): PlayerCharacter {
  const spells: SpellInfo[] = getSpellsFromJSON(json);

  const gear: Gear[] = [];

  for (const g of json.gear) {
    const foundGear = findAny(g.name);
    if (!foundGear) continue;
    gear.push({ name: foundGear.name, quantity: g.quantity });
  }

  const languages = json.languages
    .split(",")
    .map((s: string) => s.trim())
    .filter((l: string) => l !== "None");

  const bonuses: Bonus[] = json.bonuses
    .filter(
      (b: SDBonus) =>
        !b.name.includes("Spell") &&
        !b.bonusName.includes("StatBonus") &&
        !b.bonusTo.includes("Languages")
    )
    .map(mapSDBonusToBonus)
    .flat();

  addClassBonusesIfNecessary(bonuses, json.class as Class);
  addClassGearIfNecessary(gear, json.class as Class);
  addAncestryBonusesIfNecessary(bonuses, json.ancestry as Ancestry);

  const pc: PlayerCharacter = {
    name: json.name,
    ancestry: json.ancestry,
    class: json.class,
    level: json.level,
    title: json.title,
    alignment: json.alignment,
    background: json.background,
    deity: json.deity,
    gear,
    customGear: [],
    stats: json.stats,
    bonuses,
    customBonuses: [],
    customTalents: [],
    maxHitPoints: json.maxHitPoints,
    hitPoints: json.maxHitPoints,
    armorClass: json.armorClass,
    gearSlotsTotal: json.gearSlotsTotal,
    gold: json.gold,
    silver: json.silver,
    copper: json.copper,
    languages,
    customLanguages: [],
    xp: 0,
    spells,
    customSpells: [],
  };

  return pc;
}

function mapSDBonusToBonus(sdb: SDBonus): Bonus | Bonus[] {
  const commonBonusData = {
    name: sdb.name,
    bonusSource: sdb.sourceType,
  };

  if (sdb.bonusName === "Plus1ToCastingSpells") {
    return {
      bonusTo: "spellcastRoll",
      desc: "+1 to spellcasting checks",
      bonusAmount: 1,
      type: "modifyAmt",
      ...commonBonusData,
    };
  } else if (sdb.name === "WeaponMastery") {
    return [
      {
        bonusTo: "attackRoll",
        type: "modifyAmt",
        desc: `${sdb.bonusTo}: +1 to attack rolls`,
        bonusAmount: 1,
        bonusIncreaseRatePerLevel: 0.5,
        metadata: { type: "weapon", weapon: sdb.bonusTo },
        ...commonBonusData,
      },
      {
        bonusTo: "damageRoll",
        type: "modifyAmt",
        desc: `${sdb.bonusTo}: +1 to damage rolls`,
        bonusAmount: 1,
        bonusIncreaseRatePerLevel: 0.5,
        metadata: { type: "weapon", weapon: sdb.bonusTo },
        ...commonBonusData,
      },
    ];
  } else if (sdb.name === "Grit") {
    return {
      bonusTo: "statRoll",
      type: "advantage",
      desc: `Advantage on ${sdb.bonusName} checks`,
      metadata: { type: "stat", stat: "STR" },
      ...commonBonusData,
    };
  } else if (sdb.name === "ArmorMaster") {
    return {
      bonusTo: "armorClass",
      type: "modifyAmt",
      bonusAmount: 1,
      metadata: { type: "armor", armor: sdb.bonusTo },
      desc: `+1 AC from ${sdb.bonusTo} armor`,
      ...commonBonusData,
    };
  } else if (sdb.name === "BackStabIncrease") {
    return {
      bonusTo: "backstabDice",
      type: "modifyAmt",
      bonusAmount: 1,
      desc: "Your backstab deals +1 dice of damage",
      ...commonBonusData,
    };
  } else if (sdb.name === "AdvOnInitiative") {
    return {
      bonusTo: "initiativeRoll",
      type: "advantage",
      desc: "Advantage on Initiative rolls",
      ...commonBonusData,
    };
  } else if (sdb.name === "Plus1ToHit") {
    return [
      {
        bonusTo: "attackRoll",
        type: "modifyAmt",
        bonusAmount: 1,
        desc: "+1 to melee attacks",
        metadata: { type: "weaponType", weaponType: "Melee" },
        ...commonBonusData,
      },
      {
        bonusTo: "attackRoll",
        type: "modifyAmt",
        bonusAmount: 1,
        desc: "+1 to ranged attacks",
        metadata: { type: "weaponType", weaponType: "Ranged" },
        ...commonBonusData,
      },
    ];
  } else if (sdb.name === "AdvOnCastOneSpell") {
    return {
      bonusTo: "spellcastRoll",
      type: "advantage",
      desc: `Advantage to cast spell: ${sdb.bonusTo}`,
      ...commonBonusData,
    };
  }

  return [];
}

function getSpellsFromJSON(json: any): SpellInfo[] {
  const spells: SpellInfo[] = [];
  json.bonuses.forEach(async (b: any) => {
    if (b.name.includes("Spell:") || b.name === "LearnExtraSpell") {
      spells.push(findSpell(b.bonusName));
    }
  });
  return spells;
}

export function exportToJson(pc: PlayerCharacter): string {
  return JSON.stringify(pc);
}
