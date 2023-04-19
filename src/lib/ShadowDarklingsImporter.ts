import type { comment } from "svelte/internal";
import { findGear } from "./compendium";
import type { Bonus, SDBonus } from "./model/Bonus";
import type { PlayerCharacter } from "./model/PlayerCharacter";

export function importFromJson(json: any): PlayerCharacter {
  const spells: SpellInfo[] = getSpellsFromJSON(json);

  const gear = [];

  for (const g of json.gear) {
    const foundGear = findGear(g.name);
    if (!foundGear) continue;
    foundGear.quantity = g.quantity;
    gear.push(foundGear);
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
    stats: json.stats,
    bonuses,
    maxHitPoints: json.maxHitPoints,
    hitPoints: json.maxHitPoints,
    armorClass: json.armorClass,
    gearSlotsTotal: json.gearSlotsTotal,
    gold: json.gold,
    silver: json.silver,
    copper: json.copper,
    languages,
    xp: 0,
    spells,
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
      bonusType: "modifyAmt",
      ...commonBonusData,
    };
  } else if (sdb.name === "WeaponMastery") {
    return [
      {
        bonusTo: "attackRoll",
        bonusType: "modifyAmt",
        desc: `${sdb.bonusTo}: +1 to attack rolls`,
        bonusAmount: 1,
        metadata: { weapon: sdb.bonusTo },
        ...commonBonusData,
      },
      {
        bonusTo: "damageRoll",
        bonusType: "modifyAmt",
        desc: `${sdb.bonusTo}: +1 to damage rolls`,
        bonusAmount: 1,
        metadata: { weapon: sdb.bonusTo },
        ...commonBonusData,
      },
    ];
  } else if (sdb.name === "Grit") {
    return {
      bonusTo: "statRoll",
      bonusType: "advantage",
      desc: `Advantage on ${sdb.bonusName} checks`,
      metadata: { stat: "STR" },
      ...commonBonusData,
    };
  } else if (sdb.name === "ArmorMaster") {
    return {
      bonusTo: "armorClass",
      bonusType: "modifyAmt",
      bonusAmount: 1,
      metadata: { armor: sdb.bonusTo },
      desc: `+1 AC from ${sdb.bonusTo} armor`,
      ...commonBonusData,
    };
  } else if (sdb.name === "BackStabIncrease") {
    return {
      bonusTo: "backstabDice",
      bonusType: "modifyAmt",
      bonusAmount: 1,
      desc: "Your backstab deals +1 dice of damage",
      ...commonBonusData,
    };
  } else if (sdb.name === "AdvOnInitiative") {
    return {
      bonusTo: "initiativeRoll",
      bonusType: "advantage",
      desc: "Advantage on Initiative rolls",
      ...commonBonusData,
    };
  } else if (sdb.name === "Plus1ToHit") {
    return [
      {
        bonusTo: "attackRoll",
        bonusType: "modifyAmt",
        bonusAmount: 1,
        desc: "+1 to melee attacks",
        metadata: { weaponType: "melee" },
        ...commonBonusData,
      },
      {
        bonusTo: "attackRoll",
        bonusType: "modifyAmt",
        bonusAmount: 1,
        desc: "+1 to ranged attacks",
        metadata: { weaponType: "ranged" },
        ...commonBonusData,
      },
    ];
  } else if (sdb.name === "AdvOnCastOneSpell") {
    return {
      bonusTo: "spellcastRoll",
      bonusType: "advantage",
      desc: `Advantage to cast spell: ${sdb.bonusTo}`,
      ...commonBonusData,
    };
  }

  return [];
}

function getTalentsFromJSON(json: any): Talent[] {
  const talents: Talent[] = [];
  for (const b of json.bonuses) {
    if (b.sourceCategory === "Talent") {
      talents.push(b.name);
    }
  }
  return talents;
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
