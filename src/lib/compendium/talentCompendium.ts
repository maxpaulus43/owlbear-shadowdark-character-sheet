import type { Bonus, DiceTypeBonus } from "../model/Bonus";
import type { Class } from "../model/PlayerCharacter";
import type { Talent } from "../model/Talent";
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
              metadata: {
                type: "weapon",
                weapon: w.name,
              },
            },
          ] as Bonus[]
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
          metadata: {
            type: "weaponType",
            weaponType: "Ranged",
          },
        },
      ],
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
          metadata: {
            type: "stat",
            stat: "CON",
          },
        },
      ],
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
            metadata: {
              type: "armor",
              armor: a.name,
            },
          } as Bonus)
      ),
    },
  ],
  Priest: [
    {
      name: "Gain advantage on casting one spell you know",
      type: "chooseBonus",
      choices: SPELLS.map(
        (s) =>
          ({
            name: `Advantage to cast ${s.name}`,
            desc: `Advantage to cast ${s.name}`,
            type: "advantage",
            bonusTo: "spellcastRoll",
            metadata: {
              type: "spell",
              spell: s.name,
            },
          } as Bonus)
      ),
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
          bonusAmount: 1,
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
          bonusAmount: 1,
          metadata: {
            type: "weaponType",
            weaponType: "Ranged",
          },
        },
      ],
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
        },
      ],
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
          metadata: {
            type: "stat",
            stat: "WIS",
          },
        },
      ],
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
        },
      ],
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
        },
      ],
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
          metadata: {
            type: "stat",
            stat: "CHA",
          },
        },
      ],
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
          metadata: {
            type: "weaponType",
            weaponType: "Ranged",
          },
        },
      ],
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
          bonusAmount: 2,
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
          bonusAmount: 1,
        },
      ],
    },
    {
      name: "Gain advantage on casting one spell you know",
      type: "chooseBonus",
      choices: SPELLS.map(
        (s) =>
          ({
            name: `Advantage to cast ${s.name}`,
            desc: `Advantage to cast ${s.name}`,
            type: "advantage",
            bonusTo: "spellcastRoll",
            metadata: {
              type: "spell",
              spell: s.name,
            },
          } as Bonus)
      ),
    },
    {
      name: "Learn one additional wizard spell of any tier you know",
      type: "generic",
    },
  ],
  Ranger: [
    {
      type: "chooseBonus",
      choices: WEAPONS.map(
        (w) =>
          ({
            name: `d12 damage for ${w.name}`,
            desc: `d12 damage for ${w.name}`,
            type: "diceType",
            bonusTo: "damageRoll",
            diceType: "d12",
            metadata: {
              type: "weapon",
              weapon: w.name,
            },
          } as DiceTypeBonus)
      ),
      name: "You deal d12 damage with one weapon you choose",
    },
    {
      name: "+1 to attacks and damage with melee or ranged weapons",
      type: "chooseBonus",
      choices: ["Melee", "Ranged"].map(
        (w) =>
          [
            {
              name: `+1 to attack for ${w} weapons`,
              desc: `+1 to attack for ${w} weapons`,
              type: "modifyAmt",
              bonusAmount: 1,
              bonusTo: "attackRoll",
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
              metadata: {
                type: "weaponType",
                weaponType: w,
              },
            },
          ] as Bonus[]
      ),
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
          metadata: {
            type: "stat",
            stat: "INT",
          },
        },
      ],
    },
    {
      name: "Reduce the difficulty of your herbalism checks by one step",
      type: "generic",
    },
  ],
};
