import { findAny, findGear, findSpell } from "../compendium";
import { SCHEMA_TYPE } from "../constants";
import type { Bonus, SDBonus } from "../model/Bonus";
import type { Gear } from "../model/Gear";
import type { PlayerCharacter } from "../model/PlayerCharacter";
import type { SpellInfo } from "../model/Spell";

export function importFromJson(jsonStr: string): PlayerCharacter {
  const json = JSON.parse(jsonStr);
  if (json["schemaType"] === SCHEMA_TYPE) {
    // TODO schema versioning. i.e. If schema version is old, then migrate to new schema.
    return json as PlayerCharacter;
  } else {
    return importFromShadowDarklingsJson(json);
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
        metadata: { type: "weapon", weapon: sdb.bonusTo },
        ...commonBonusData,
      },
      {
        bonusTo: "damageRoll",
        type: "modifyAmt",
        desc: `${sdb.bonusTo}: +1 to damage rolls`,
        bonusAmount: 1,
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
