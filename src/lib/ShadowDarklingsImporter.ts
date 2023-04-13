import {
  ARMOR_GEAR,
  BASIC_GEAR,
  findGear,
  WEAPON_GEAR,
  type Attack,
  type Gear,
  type GearInfo,
  type PlayerCharacter,
  type Spell,
  type Talent,
} from "../types";

export function importFromJson(json: any): PlayerCharacter {
  const maxHitPoints =
    json.ancestry === "Dwarf" ? json.maxHitPoints + 2 : json.maxHitPoints;

  const talents: Talent[] = [];
  const spells: Spell[] = [];
  const attacks: Attack[] = [];

  const pc: PlayerCharacter = {
    name: json.name,
    ancestry: json.ancestry,
    class: json.class,
    level: json.level,
    title: json.title,
    alignment: json.alignment,
    background: json.background,
    deity: json.deity,
    gear: getGearFromJSON(json),
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

function getGearFromJSON(json: any) {
  const gear: Gear[] = [];

  if (json.gear.length === 0) return gear;

  json.gear.forEach((g) => {
    const foundGear = findGear(g.name);
    if (foundGear) gear.push(foundGear);
  });

  return gear;
}

export function exportToJson(pc: PlayerCharacter): any {
  return {};
}
