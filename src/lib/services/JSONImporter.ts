import { findAny, findSpell } from "../compendium";
import { ANCESTRIES, CLASSES, SCHEMA_TYPE } from "../constants";
import type {
  PlayerCharacter,
  SpellInfo,
  Gear,
  Bonus,
  SDBonus,
  WeaponType,
  BonusMetaData,
  WeaponBonusMetaData,
} from "../types";
import {
  ensureAncestryBonuses,
  ensureClassBonuses,
  ensureClassGear,
  ensureLanguages,
} from "./AncestryClassEnsurer";

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

  const cKitIdx = pc.gear?.findIndex((g) => g.name === "Crawling Kit");
  if (cKitIdx && cKitIdx > -1) {
    pc.gear.splice(cKitIdx, 1);
  }

  if (pc.customGear) {
    pc.customGear.forEach((g) => {
      g.editable = true;
    });
  }

  if (pc.customSpells) {
    pc.customSpells.forEach((s) => {
      s.editable = true;
    });
  }

  // eslint-disable-next-line
  // @ts-ignore
  if (pc.class === "Level 0") pc.class = "";

  // ensure player has proper bonuses every time we load json
  ensureAncestryBonuses(pc);
  ensureClassBonuses(pc);
  ensureClassGear(pc);
  ensureLanguages(pc);

  ensureProperWeaponNamesInBonuses(pc);
}

// eslint-disable-next-line
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
        !b.name.includes("Spell:") &&
        !b.bonusName.includes("StatBonus") &&
        !b.bonusTo.includes("Languages"),
    )
    .map(mapSDBonusToBonus)
    .flat();

  const theClass = json.class === "Level 0" ? "" : json.class;

  const pc: PlayerCharacter = {
    name: json.name,
    ancestry: json.ancestry,
    hasCustomAncestry: !ANCESTRIES.includes(json.ancestry),
    class: theClass,
    hasCustomClass: !CLASSES.includes(theClass),
    level: json.level,
    notes: "",
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
    armorClass: 10,
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

  ensureClassBonuses(pc);
  ensureClassGear(pc);
  ensureLanguages(pc);
  ensureAncestryBonuses(pc);

  ensureProperWeaponNamesInBonuses(pc);

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
      metadata: {
        type: "spell",
        spell: sdb.bonusName,
      },
      ...commonBonusData,
    };
  } else if (sdb.name === "SetWeaponTypeDamage") {
    const [weapon] = sdb.bonusTo.split(":");
    return {
      type: "diceType",
      bonusTo: "damageRoll",
      desc: `Use a d12 for damage rolls for ${weapon}s`,
      diceType: "d12",
      metadata: {
        type: "weapon",
        weapon,
      },
      ...commonBonusData,
    };
  } else if (sdb.name === "Plus1ToHitAndDamage") {
    const weaponType: WeaponType = sdb.bonusTo.toLowerCase().includes("ranged")
      ? "Ranged"
      : "Melee";
    return [
      {
        bonusTo: "attackRoll",
        type: "modifyAmt",
        desc: `${weaponType}: +1 to attack rolls`,
        bonusAmount: 1,
        metadata: { type: "weaponType", weaponType },
        ...commonBonusData,
      },
      {
        bonusTo: "damageRoll",
        type: "modifyAmt",
        desc: `${weaponType}: +1 to damage rolls`,
        bonusAmount: 1,
        metadata: { type: "weaponType", weaponType },
        ...commonBonusData,
      },
    ];
  } else if (sdb.name === "ReduceHerbalismDC") {
    return {
      type: "generic",
      desc: "Reduce the difficulty of your herbalism checks by one step",
      ...commonBonusData,
    };
  }

  return [];
}

function ensureProperWeaponNamesInBonuses(pc: PlayerCharacter) {
  pc.bonuses
    .map((b) => b.metadata)
    .filter((m) => Boolean(m) && m.type === "weapon")
    .forEach((m: WeaponBonusMetaData) => {
      if (m.weapon === "Bastard sword") {
        m.weapon = "Bastard Sword";
      }
    });
}

// eslint-disable-next-line
function getSpellsFromJSON(json: any): SpellInfo[] {
  const spells: SpellInfo[] = [];
  // eslint-disable-next-line
  json.bonuses.forEach(async (b: any) => {
    if (b.name.includes("Spell:") || b.name === "LearnExtraSpell") {
      const s = findSpell(b.bonusName);
      if (s) {
        spells.push(s);
      }
    }
  });
  return spells;
}

export function exportToJson(pc: PlayerCharacter): string {
  return JSON.stringify(pc);
}
