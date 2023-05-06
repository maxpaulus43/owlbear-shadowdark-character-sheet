import type { PlayerCharacter, Roll, WeaponInfo } from "../types";
import { calculateDamageBonusForPlayerWeapon } from "./PlayerCharacter";
import { addSign } from "../utils";

function rollToString(r: Roll): string {
  return `${r.numDice}${r.diceType}`;
}

export function damageStringForPlayerWeapon(
  pc: PlayerCharacter,
  w: WeaponInfo
): string {
  let result = "";
  if (w.damage.oneHanded) result += rollToString(w.damage.oneHanded);
  if (w.damage.twoHanded) {
    result += `${result.length > 0 ? "/" : ""}${rollToString(
      w.damage.twoHanded
    )}`;
  }
  const modifier = calculateDamageBonusForPlayerWeapon(pc, w);
  if (modifier !== 0) result = `(${result})${addSign(modifier)}`;
  return result;
}
