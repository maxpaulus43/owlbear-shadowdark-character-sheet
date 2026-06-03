import type { LANGUAGES } from "../constants";
import type { PlayerCharacter, Gear, Class, Bonus, Ancestry } from "../types";

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
  if (!pc.class || pc.hasCustomClass) return;
  addClassBonuses(pc.bonuses, pc.class);
}

export function ensureClassGear(pc: PlayerCharacter) {
  clearClassGear(pc);
  if (!pc.class || pc.hasCustomClass) return;
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
      ![
        "Thievery",
        "Backstab",
        "Learning Spells",
        "Hauler",
        "Herbalism",
        "Herbal Remedy",
        "Wayfinder",
        "Languages: Bard",
        "Bardic Arts",
        "Magical Dabbler",
        "Presence",
        "Prolific",
        "Fascinate (Focus)",
        "Inspire",
        "Languages: Wyrdling",
        "Corruption",
        "Hideous Biology",
        "Pseudopod",
        "Languages: Delver",
        "Scavenger",
        "Trailblazer",
        "Trusty Gear",
        "Basilisk Blood",
        "Petrifying Gaze",
        "Stone Skin",
        "Parry",
        "Tale Spinner",
        "Taunt",
        "Spellcasting: Knight of St. Ydris",
        "Languages: Knight of St. Ydris",
        "Demonic Possession",
        "Languages: Warlock",
        "Patron",
        "Patrons",
        "Patron Boon",
        "Spellcasting: Witch",
        "Languages: Witch",
        "Familiar",
        "Charge",
        "Mount",
        "Flourish",
        "Implacable",
        "Last Stand",
        "Relentless",
        "Languages: Ras-Godai",
        "Assassinate",
        "Smoke Step",
        "Black Lotus",
        "Black Lotus Talents",
        "Seafarer",
        "Old Gods",
        "Old Gods Options",
        "Shield Wall",
        "Spellcasting: Seer",
        "Destined",
        "Omen",
        "Seer Penance",
      ].includes(b.name) && !b.name.includes("Thievery:")
  );
}

function clearClassGear(pc: PlayerCharacter) {
  pc.gear = pc.gear.filter(
    (g) => !["Thieving Tools", "Holy Symbol"].includes(g.name)
  );
}

function addClassGear(gear: Gear[], c: Class) {
  if (c === "Thief" && !gear.find((g) => g.name === "Thieving Tools")) {
    gear.push({ name: "Thieving Tools", quantity: 1 });
  } else if (c === "Priest" && !gear.find((g) => g.name === "Holy Symbol")) {
    gear.push({ name: "Holy Symbol", quantity: 1 });
  }
}

function addAncestryBonuses(bonuses: Bonus[], a: Ancestry | "") {
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
    default: {
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
    case "Ranger": {
      const name = "Herbalism";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name,
            bonusSource: "Class",
            desc: "Make an INT check to prepare an herbal remedy you choose. If you fail, you can't make that remedy again until you successfully rest. Unused remedies expire in 3 rounds.",
            type: "generic",
          },
          {
            name: "Herbal Remedy",
            bonusSource: "Class",
            desc: "DC 11, Salve. Heals 1 HP; DC 12, Stimulant. You can't be surprised for 10 rounds; DC 13, Foebane. You get ADV on attacks and damage against one creature type you choose for 1d6 rounds; DC 14, Restorative. Ends one poison or disease; DC 15, Curative. Equivalent to a Potion of Healing.",
            type: "generic",
          },
          {
            name: "Wayfinder",
            bonusSource: "Class",
            desc: "You have advantage on checks associated with: Navigation, Tracking, Bushcraft, Stealth, Wild animals.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Bard": {
      const name = "Bardic Arts";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Languages: Bard",
            bonusSource: "Class",
            desc: "You know four additional common languages and one rare language.",
            type: "generic",
          },
          {
            name,
            bonusSource: "Class",
            desc: "You're trained in oration, performing arts, lore, and diplomacy. You have advantage on related checks.",
            type: "generic",
          },
          {
            name: "Fascinate (Focus)",
            bonusSource: "Class",
            desc: "Make a DC 12 CHA check. On a success, you transfix all targets in near whose LV is equal to or less than 1 + half your level (round down). If you fail, excluding focus, you can't use this again until you rest.",
            type: "generic",
          },
          {
            name: "Inspire",
            bonusSource: "Class",
            desc: "Each day, you can grant a number of luck tokens equal to your Charisma modifier (min. 1).",
            type: "generic",
          },
          {
            name: "Magical Dabbler",
            bonusSource: "Class",
            desc: "You can activate spell scrolls and wands using Charisma as your spellcasting stat. If you critically fail, roll a wizard mishap. In place of making a talent roll, you may choose to find a random priest or wizard wand (you decide which type).",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Knight of St. Ydris": {
      const name = "Demonic Possession";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Spellcasting: Knight of St. Ydris",
            bonusSource: "Class",
            desc: "Cast Witch spells using Charisma (DC = 10 + tier). Fail = can't cast again until rest. Natural 1 = Diabolical Mishap.",
            type: "generic",
          },
          {
            name: "Languages: Knight of St. Ydris",
            bonusSource: "Class",
            desc: "You know Diabolic.",
            type: "generic",
          },
          {
            name,
            bonusSource: "Class",
            desc: "3/day, gain a +1 bonus (+ half level rounded down) to damage rolls for 3 rounds.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Warlock": {
      const name = "Patron";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Languages: Warlock",
            bonusSource: "Class",
            desc: "You know either Celestial, Diabolic, Draconic, Primordial, or Sylvan.",
            type: "generic",
          },
          {
            name,
            bonusSource: "Class",
            desc: "Choose a patron to serve. Your patron is the source of your supernatural gifts. If your patron is displeased with you, it can withhold its gifts. You lose any talents granted by your Patron Boons during this time.",
            type: "generic",
          },
          {
            name: "Patron Boon",
            bonusSource: "Class",
            desc: "At 1st level, gain a random Patron Boon talent. Can roll on Patron Boon table instead of Warlock Talents table when gaining talents.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Witch": {
      const name = "Familiar";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Spellcasting: Witch",
            bonusSource: "Class",
            desc: "Cast Witch spells using Charisma (DC = 10 + tier). Fail = can't cast again until rest. Natural 1 = Diabolical Mishap.",
            type: "generic",
          },
          {
            name: "Languages: Witch",
            bonusSource: "Class",
            desc: "You know Diabolic, Primordial, and Sylvan.",
            type: "generic",
          },
          {
            name,
            bonusSource: "Class",
            desc: "Small animal familiar who speaks Common. Can cast spells through familiar. Resurrecting costs permanent 1d4 HP.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Desert Rider": {
      const name = "Mount";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Charge",
            bonusSource: "Class",
            desc: "3/day, double damage on melee attacks for the round when charging (moving near before attacking).",
            type: "generic",
          },
          {
            name,
            bonusSource: "Class",
            desc: "Have a reliable common camel or horse. Riding mount adds half level to AC of both, and mount gets extra levels equal to half level.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Pit Fighter": {
      const name = "Relentless";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Flourish",
            bonusSource: "Class",
            desc: "3/day, regain 1d6 HP when you hit an enemy with a melee attack.",
            type: "generic",
          },
          {
            name: "Implacable",
            bonusSource: "Class",
            desc: "You have advantage on Constitution checks to resist injury, poison, or endure extreme environments.",
            type: "generic",
          },
          {
            name: "Last Stand",
            bonusSource: "Class",
            desc: "Get up from dying with 1 HP on a natural d20 roll of 18-20.",
            type: "generic",
          },
          {
            name,
            bonusSource: "Class",
            desc: "3/day when reduced to 0 HP, make DC 18 CON check (Implacable applies). On success, go to 1 HP instead.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Ras-Godai": {
      const name = "Assassinate";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Languages: Ras-Godai",
            bonusSource: "Class",
            desc: "You know Diabolic.",
            type: "generic",
          },
          {
            name,
            bonusSource: "Class",
            desc: "When you attack a surprised target, you deal double damage.",
            type: "generic",
          },
          {
            name: "Smoke Step",
            bonusSource: "Class",
            desc: "3/day, teleport near as a non-action.",
            type: "generic",
          },
          {
            name: "Black Lotus",
            bonusSource: "Class",
            desc: "Roll one talent on the Black Lotus Talents table.",
            type: "generic",
          },
          {
            name: "Black Lotus Talents",
            bonusSource: "Class",
            desc: "1: Triple Assassinate damage; 2: 1/day Paralyze target for 1d4 rds; 3: ADV on DEX checks vs trap/injury; 4: +1 AC dual wielding; 5: +1 HD; 6: ADV on DEX to hide; 7: Morale DC is 18 vs you; 8: 1/day walk on water; 9: 1/day DC 15 CON sleep; 10: 1/day walk on sheer surfaces; 11: +1 melee damage; 12: 1/day target DC 15 WIS can't see/hear you.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Sea Wolf": {
      const name = "Old Gods";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Seafarer",
            bonusSource: "Class",
            desc: "Advantage on checks related to navigating and crewing boats.",
            type: "generic",
          },
          {
            name,
            bonusSource: "Class",
            desc: "Align purpose with Odin (+1d4 HP on kill), Freya (+1 luck token, +1d6 to rolls using it), or Loki (ADV on lie, sneak, hide) after rest.",
            type: "generic",
          },
          {
            name: "Old Gods Options",
            bonusSource: "Class",
            desc: "Odin: Regain 1d4 HP on kill. Freya: Luck token grants +1d6 to roll. Loki: ADV on lie, sneak, hide.",
            type: "generic",
          },
          {
            name: "Shield Wall",
            bonusSource: "Class",
            desc: "Use action to take defensive stance with shield. AC becomes 20.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Seer": {
      const name = "Omen";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Spellcasting: Seer",
            bonusSource: "Class",
            desc: "Cast Seer spells using Wisdom (DC = 10 + tier). Fail = can't cast again until rest. Natural 1 = can't cast until Seer Penance.",
            type: "generic",
          },
          {
            name: "Destined",
            bonusSource: "Class",
            desc: "Whenever you use a luck token, add 1d6 to the roll.",
            type: "generic",
          },
          {
            name: name,
            bonusSource: "Class",
            desc: "3/day, make DC 9 WIS check. On success, gain a luck token.",
            type: "generic",
          },
          {
            name: "Seer Penance",
            bonusSource: "Class",
            desc: "T1: Give up 1d4 HP for a week; T2: Lower WIS by 2 for two weeks; T3: Permanent sacrifice 1 CHA; T4: Sink burning longboat; T5: Sacrifice 9 humanoids.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Wyrdling": {
      const name = "Corruption";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Languages: Wyrdling",
            bonusSource: "Class",
            desc: "You know Primordial.",
            type: "generic",
          },
          {
            name,
            bonusSource: "Class",
            desc: "Roll one talent on the Corruption Table.",
            type: "generic",
          },
          {
            name: "Hideous Biology",
            bonusSource: "Class",
            desc: "You can hideously stretch your body to fit through inch-wide cracks. It takes you 3 rounds to pass through an obstacle in this way.",
            type: "generic",
          },
          {
            name: "Pseudopod",
            bonusSource: "Class",
            desc: "You can sprout a clawed, horrid pseudopod from your body. Finesse (F). You may use your STR or DEX when attacking with this weapon.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Delver": {
      const name = "Scavenger";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name: "Languages: Delver",
            bonusSource: "Class",
            desc: "You know two additional common languages.",
            type: "generic",
          },
          {
            name,
            bonusSource: "Class",
            desc: "When you expend the last of a consumable item you've carried since your last rest, roll a d6. On a 5 or 6, you regain one use of that item.",
            type: "generic",
          },
          {
            name: "Trailblazer",
            bonusSource: "Class",
            desc: "You are adept at exploring inhospitable, lost, or unknown places. You have advantage on the following tasks: Climbing, Swimming, Foraging, Understanding unknown languages, Avoiding or escaping natural terrain hazards.",
            type: "generic",
          },
          {
            name: "Trusty Gear",
            bonusSource: "Class",
            desc: "Choose one type of gear or weapon you can wield. You gain 1 + half your level (round down) on checks or attack rolls made with that type of gear or weapon.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Basilisk Warrior": {
      const name = "Basilisk Blood";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name,
            bonusSource: "Class",
            desc: "You have ADV on CON checks to avoid harmful maladies, poisons, or afflictions.",
            type: "generic",
          },
          {
            name: "Petrifying Gaze",
            bonusSource: "Class",
            desc: "One creature of your level or less that meets your gaze must pass a DC 15 CON check or be petrified for 1d4 rounds. It still takes damage as normal while petrified. You can use this talent a number of times per day equal to your CON modifier (minimum 1).",
            type: "generic",
          },
          {
            name: "Stone Skin",
            bonusSource: "Class",
            desc: "Add 2 + half your level (round down) to your AC if you are otherwise unarmored. You have advantage on checks to hide in natural environments.",
            type: "generic",
          }
        );
      }
      break;
    }
    case "Duelist": {
      const name = "Parry";
      if (!bonuses.find((b) => b.name === name)) {
        bonuses.push(
          {
            name,
            bonusSource: "Class",
            desc: "Once per day, an attack of your choice that would hit you misses instead.",
            type: "generic",
          },
          {
            name: "Tale Spinner",
            bonusSource: "Class",
            desc: "You may make a DC 15 CHA check. If you pass, strangers around you believe you are famous and important for the remainder of your interaction with them. The same individual cannot be fooled by this twice.",
            type: "generic",
          },
          {
            name: "Taunt",
            bonusSource: "Class",
            desc: "When an enemy misses you with an attack, you have advantage on attacks against that enemy next round.",
            type: "generic",
          }
        );
      }
      break;
    }
  }
}
