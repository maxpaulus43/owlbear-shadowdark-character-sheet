import type { Class } from "../model/PlayerCharacter";
import type { Talent } from "../model/Talent";

export const CLASS_TALENTS: { [key in Class]: Talent[] } = {
  Fighter: [
    {
      name: "Gain Weapon Mastery with one weapon",
      type: "bonus",
      bonuses: [
        {
          name: "+1 to attack for",
          desc: "+1 to attack for chosen weapon",
          type: "modifyAmt",
          bonusAmount: 1,
          bonusTo: "attackRoll",
          metadata: {
            type: "chooseWeapon",
          },
        },
        {
          name: "+1 to damage for",
          desc: "+1 to damage for chosen weapon",
          type: "modifyAmt",
          bonusAmount: 1,
          bonusTo: "damageRoll",
          metadata: {
            type: "chooseWeapon",
          },
        },
      ],
    },
    {
      name: "+1 to melee and ranged attacks",
      type: "bonus",
      bonuses: [
        {
          name: "+1 to melee attacks",
          desc: "+1 to attack rolls for melee weapons",
          type: "modifyAmt",
          bonusAmount: 1,
          bonusTo: "attackRoll",
          metadata: {
            type: "weaponType",
            weaponType: "Melee",
          },
        },
        {
          name: "+1 to melee attacks",
          desc: "+1 to attack rolls for ranged weapons",
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
      name: "+2 to STR, DEX, or CON",
      type: "bonus",
      bonuses: [
        {
          name: "+2 to chosen stat",
          type: "modifyAmt",
          desc: "+2 to Strenth, Dexterity, or Constitution",
          bonusTo: "stat",
          bonusAmount: 2,
          metadata: {
            type: "chooseStat",
            filterByStat: ["STR", "DEX", "CON"],
          },
        },
      ],
    },
    {
      name: "Choose one kind of armor. You get +1 AC from that armor",
      type: "bonus",
      bonuses: [
        {
          name: "+1 AC to chosen Armor",
          desc: "blah",
          type: "modifyAmt",
          bonusTo: "armorClass",
          bonusAmount: 1,
          metadata: {
            type: "chooseArmor",
          },
        },
      ],
    },
  ],
  Priest: [],
  Thief: [],
  Wizard: [],
};
