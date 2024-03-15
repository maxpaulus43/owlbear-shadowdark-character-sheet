import type {
  AdvantageBonus,
  Class,
  DiceTypeBonus,
  ModifyBonus,
  Talent,
} from "../types";
import { ARMORS } from "./armorCompendium";
import { SPELLS } from "./spellCompendium";
import { WEAPONS } from "./weaponCompendium";

export const CLASS_TALENTS: { [key in Class]: Talent[] } = {
  Fighter: [
    {
      name: "Gain Weapon Mastery with one weapon",
      type: "chooseBonus",
      choices: WEAPONS.map(
        (w) =>
          [
            {
              name: `+1 to attack for ${w.name}`,
              desc: `+1 to attack for ${w.name}`,
              type: "modifyAmt",
              bonusAmount: 1,
              bonusTo: "attackRoll",
              bonusSource: "Talent",
              editable: true,
              metadata: {
                type: "weapon",
                weapon: w.name,
              },
            },
            {
              name: `+1 to damage for ${w.name}`,
              desc: `+1 to damage for ${w.name}`,
              type: "modifyAmt",
              bonusAmount: 1,
              bonusTo: "damageRoll",
              bonusSource: "Talent",
              editable: true,
              metadata: {
                type: "weapon",
                weapon: w.name,
              },
            },
          ] as ModifyBonus[],
      ),
    },
    {
      name: "+1 to melee and ranged attacks",
      type: "bonus",
      bonuses: [
        {
          name: "+1 to attack type",
          desc: "+1 to melee attacks",
          type: "modifyAmt",
          bonusAmount: 1,
          bonusTo: "attackRoll",
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "weaponType",
            weaponType: "Melee",
          },
        },
        {
          name: "+1 to attack type",
          desc: "+1 to ranged attacks",
          type: "modifyAmt",
          bonusAmount: 1,
          bonusTo: "attackRoll",
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "weaponType",
            weaponType: "Ranged",
          },
        },
      ] as ModifyBonus[],
    },
    {
      name: "+2 to Strenth, Dexterity, or Constitution stat",
      type: "chooseBonus",
      choices: [
        {
          name: "+2 to STR",
          type: "modifyAmt",
          desc: "+2 to STR",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "STR",
          },
        },
        {
          name: "+2 to DEX",
          type: "modifyAmt",
          desc: "+2 to DEX",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "DEX",
          },
        },
        {
          name: "+2 to CON",
          type: "modifyAmt",
          desc: "+2 to CON",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "CON",
          },
        },
      ] as ModifyBonus[],
    },
    {
      name: "Choose one kind of armor. You get +1 AC from that armor",
      type: "chooseBonus",
      choices: ARMORS.map(
        (a) =>
          ({
            name: `+1 to ${a.name}`,
            desc: `+1 to ${a.name}`,
            type: "modifyAmt",
            bonusAmount: 1,
            bonusTo: "armorClass",
            bonusSource: "Talent",
            editable: true,
            metadata: {
              type: "armor",
              armor: a.name,
            },
          }) as ModifyBonus,
      ),
    },
  ],
  Priest: [
    {
      name: "Gain advantage on casting one spell you know",
      type: "chooseBonus",
      choices: SPELLS.map((s) => ({
        name: `Advantage to cast ${s.name}`,
        desc: `Advantage to cast ${s.name}`,
        type: "advantage",
        bonusTo: "spellcastRoll",
        bonusSource: "Talent",
        editable: true,
        metadata: {
          type: "spell",
          spell: s.name,
        },
      })) as AdvantageBonus[],
    },
    {
      name: "+1 to melee or ranged attacks",
      type: "chooseBonus",
      choices: [
        {
          name: "+1 to melee attacks",
          desc: "+1 to melee attacks",
          type: "modifyAmt",
          bonusTo: "attackRoll",
          bonusSource: "Talent",
          bonusAmount: 1,
          editable: true,
          metadata: {
            type: "weaponType",
            weaponType: "Melee",
          },
        },
        {
          name: "+1 to ranged attacks",
          desc: "+1 to ranged attacks",
          type: "modifyAmt",
          bonusTo: "attackRoll",
          bonusSource: "Talent",
          bonusAmount: 1,
          editable: true,
          metadata: {
            type: "weaponType",
            weaponType: "Ranged",
          },
        },
      ] as ModifyBonus[],
    },
    {
      name: "+1 to priest spellcasting checks",
      type: "bonus",
      bonuses: [
        {
          name: "+1 to spellcasting",
          desc: "+1 to spellcasting",
          type: "modifyAmt",
          bonusTo: "spellcastRoll",
          bonusAmount: 1,
          bonusSource: "Talent",
          editable: true,
        },
      ] as ModifyBonus[],
    },
    {
      name: "+2 to Strength or Wisdom stat",
      type: "chooseBonus",
      choices: [
        {
          name: "+2 to stat",
          type: "modifyAmt",
          desc: "+2 to STR",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "STR",
          },
        },
        {
          name: "+2 to WIS",
          desc: "+2 to WIS",
          type: "modifyAmt",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "WIS",
          },
        },
      ] as ModifyBonus[],
    },
  ],
  Thief: [
    {
      name: "Gain advantage on initiative rolls (reroll if duplicate)",
      type: "bonus",
      bonuses: [
        {
          name: "adv initiative",
          desc: "adv initiative rolls",
          type: "advantage",
          bonusTo: "initiativeRoll",
          bonusSource: "Talent",
          editable: true,
        },
      ] as AdvantageBonus[],
    },
    {
      name: "Your Backstab deals +1 dice of damage",
      type: "bonus",
      bonuses: [
        {
          name: "+1 backstab dice",
          desc: "+1 backstab dice",
          type: "modifyAmt",
          bonusAmount: 1,
          bonusTo: "backstabDice",
          bonusSource: "Talent",
          editable: true,
        },
      ] as ModifyBonus[],
    },
    {
      name: "+2 to Strength, Dexterity, or Charisma stat",
      type: "chooseBonus",
      choices: [
        {
          name: "+2 to STR",
          type: "modifyAmt",
          desc: "+2 to",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "STR",
          },
        },
        {
          name: "+2 to DEX",
          type: "modifyAmt",
          desc: "+2 to DEX",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "DEX",
          },
        },
        {
          name: "+2 to CHA",
          type: "modifyAmt",
          desc: "+2 to CHA",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "CHA",
          },
        },
      ] as ModifyBonus[],
    },
    {
      name: "+1 to melee and ranged attacks",
      type: "bonus",
      bonuses: [
        {
          name: "+1 to attack type",
          desc: "+1 to melee attacks",
          type: "modifyAmt",
          bonusAmount: 1,
          bonusTo: "attackRoll",
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "weaponType",
            weaponType: "Melee",
          },
        },
        {
          name: "+1 to attack type",
          desc: "+1 to ranged attacks",
          type: "modifyAmt",
          bonusAmount: 1,
          bonusTo: "attackRoll",
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "weaponType",
            weaponType: "Ranged",
          },
        },
      ] as ModifyBonus[],
    },
  ],
  Wizard: [
    {
      name: "Make 1 random magic item of a type you choose",
      type: "generic",
    },
    {
      name: "+2 to Intelligence stat or +1 to wizard spellcasting checks",
      type: "chooseBonus",
      choices: [
        {
          name: "+2 to INT",
          type: "modifyAmt",
          desc: "+2 to INT",
          bonusTo: "stat",
          bonusSource: "Talent",
          bonusAmount: 2,
          editable: true,
          metadata: {
            type: "stat",
            stat: "INT",
          },
        },
        {
          name: "+1 to spellcasting",
          desc: "+1 to spellcasting",
          type: "modifyAmt",
          bonusTo: "spellcastRoll",
          bonusSource: "Talent",
          bonusAmount: 1,
          editable: true,
        },
      ] as ModifyBonus[],
    },
    {
      name: "Gain advantage on casting one spell you know",
      type: "chooseBonus",
      choices: SPELLS.map((s) => ({
        name: `Advantage to cast ${s.name}`,
        desc: `Advantage to cast ${s.name}`,
        type: "advantage",
        bonusTo: "spellcastRoll",
        bonusSource: "Talent",
        editable: true,
        metadata: {
          type: "spell",
          spell: s.name,
        },
      })) as AdvantageBonus[],
    },
    {
      name: "Learn one additional wizard spell of any tier you know",
      type: "generic",
    },
  ],
  Ranger: [
    {
      type: "chooseBonus",
      choices: WEAPONS.map((w) => ({
        name: `d12 damage for ${w.name}`,
        desc: `d12 damage for ${w.name}`,
        type: "diceType",
        bonusTo: "damageRoll",
        bonusSource: "Talent",
        diceType: "d12",
        editable: true,
        metadata: {
          type: "weapon",
          weapon: w.name,
        },
      })) as DiceTypeBonus[],
      name: "You deal d12 damage with one weapon you choose",
    },
    {
      name: "+1 to attacks and damage with melee or ranged weapons",
      type: "chooseBonus",
      choices: (["Melee", "Ranged"] as const).map((w) => [
        {
          name: `+1 to attack for ${w} weapons`,
          desc: `+1 to attack for ${w} weapons`,
          type: "modifyAmt",
          bonusAmount: 1,
          bonusTo: "attackRoll",
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "weaponType",
            weaponType: w,
          },
        },
        {
          name: `+1 to damage for ${w} weapons`,
          desc: `+1 to damage for ${w} weapons`,
          type: "modifyAmt",
          bonusAmount: 1,
          bonusTo: "damageRoll",
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "weaponType",
            weaponType: w,
          },
        },
      ]) as ModifyBonus[][],
    },
    {
      name: "+2 to Strength, Dexterity, or Intelligence stat",
      type: "chooseBonus",
      choices: [
        {
          name: "+2 to STR",
          type: "modifyAmt",
          desc: "+2 to",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "STR",
          },
        },
        {
          name: "+2 to DEX",
          type: "modifyAmt",
          desc: "+2 to DEX",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "DEX",
          },
        },
        {
          name: "+2 to INT",
          type: "modifyAmt",
          desc: "+2 to INT",
          bonusTo: "stat",
          bonusAmount: 2,
          bonusSource: "Talent",
          editable: true,
          metadata: {
            type: "stat",
            stat: "INT",
          },
        },
      ] as ModifyBonus[],
    },
    {
      name: "Reduce the difficulty of your herbalism checks by one step",
      type: "generic",
    },
  ],
};
