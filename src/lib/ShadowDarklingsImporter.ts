import {
  findGear,
  findSpell,
  type Attack,
  type Bonus,
  type Gear,
  type PlayerCharacter,
  type SpellInfo,
  type Talent,
} from "../types";

export function importFromJson(json: any): PlayerCharacter {
  const talents: Talent[] = getTalentsFromJSON(json);
  const spells: SpellInfo[] = getSpellsFromJSON(json);

  const gear = [];

  for (const g of json.gear) {
    const theGear = findGear(g.name);
    if (!theGear) continue;
    theGear.quantity = g.quantity;
    gear.push(theGear);
  }

  const languages = json.languages
    .split(",")
    .map((s: string) => s.trim())
    .filter((l: string) => l !== "None");

  const bonuses = json.bonuses.filter(
    (b: Bonus) =>
      !b.name.includes("Spell") &&
      !b.bonusName.includes("StatBonus") &&
      !b.bonusTo.includes("Languages")
  );

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
    talents,
    spells,
    attacks: [],
  };

  return pc;
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

export function exportToJson(pc: PlayerCharacter): any {
  return {};
}
