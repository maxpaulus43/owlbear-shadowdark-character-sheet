import {
  ARMOR_GEAR,
  BASIC_GEAR,
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

function getGearFromJSON(json) {
  const gear: Gear[] = [];

  if (json.gear.length === 0) return gear;

  json.gear.forEach((g) => {
    const armor = findInCompendium(g.name, ARMOR_GEAR);
    if (armor) {
      gear.push(armor);
      return;
    }

    const weapon = findInCompendium(g.name, WEAPON_GEAR);
    if (weapon) {
      gear.push(weapon);
      return;
    }

    const basic = findInCompendium(g.name, BASIC_GEAR);
    if (basic) gear.push(basic);
  });

  return gear;
}
type Compendium = typeof BASIC_GEAR | typeof ARMOR_GEAR | typeof WEAPON_GEAR;

function findInCompendium(
  str: string,
  compendium: Compendium
): GearInfo | null {
  for (const key in compendium) {
    if (key.toLowerCase().includes(str.toLowerCase())) {
      return compendium[key];
    }
  }
  return null;
}

export function exportToJson(pc: PlayerCharacter): any {
  return {};
}
