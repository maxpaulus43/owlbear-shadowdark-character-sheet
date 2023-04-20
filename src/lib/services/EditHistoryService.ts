import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";
import { debounce } from "../utils";

export const PlayerHistory = [];

export function trackPlayerHistory() {
  const fn = debounce((pc) => {
    PlayerHistory.push(pc);
    console.log("Pushed pc", pc);
  });

  pc.subscribe((prevValue) => {
    fn(prevValue);
  });
}
