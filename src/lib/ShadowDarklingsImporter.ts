import {
  findGear,
  findSpell,
  type Attack,
  type Gear,
  type PlayerCharacter,
  type SpellInfo,
  type Talent,
} from "../types";

export function importFromJson(json: any): PlayerCharacter {
  const maxHitPoints =
    json.ancestry === "Dwarf" ? json.maxHitPoints + 2 : json.maxHitPoints;

  const talents: Talent[] = getTalentsFromJSON(json);
  const spells: SpellInfo[] = getSpellsFromJSON(json);
  const attacks: Attack[] = [];
  const gear = getGearFromJSON(json);

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
    bonuses: json.bonuses,
    maxHitPoints,
    hitPoints: maxHitPoints,
    armorClass: json.armorClass,
    gearSlotsTotal: json.gearSlotsTotal,
    gearSlotsUsed: 0,
    gold: json.gold,
    silver: json.silver,
    copper: json.copper,
    languages: json.languages
      .split(",")
      .map((s: string) => s.trim())
      .filter((l: string) => l !== "None"),
    xp: 0,
    talents,
    spells,
    attacks,
  };

  return pc;
}

function getGearFromJSON(json: any): Gear[] {
  if (json.gear.length === 0) return [];
  return json.gear.map((g) => findGear(g.name)).filter((g) => g !== undefined);
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
