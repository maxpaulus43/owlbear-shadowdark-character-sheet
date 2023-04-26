import type { PlayerCharacter } from "../model/PlayerCharacter";
import {
  defaultPC,
  PlayerCharacterStore as pc,
} from "../model/PlayerCharacter";
import { debounce } from "../utils";
import { maintainBackwardsCompat } from "./JSONImporter";

export function trackAndSavePlayerToLocalStorage() {
  const saveToLocalStorage = debounce(savePlayerToLocalStorage, 2000);

  pc.subscribe((pc) => {
    saveToLocalStorage(pc);
  });
}

function isOBRAvailable(): boolean {
  return false; // TODO isOBRAvailable
}

export async function savePlayerToLocalStorage(pc: PlayerCharacter) {
  if (isOBRAvailable()) {
    console.log("saving to OBR player");
  } else {
    asyncLocalStorage.setItem(`sd-character-sheet`, JSON.stringify(pc));
  }
}

export async function loadPlayerFromLocalStorage(): Promise<PlayerCharacter> {
  if (isOBRAvailable()) {
    console.log("loading Player from OBR");
  } else {
    const pcJson = await asyncLocalStorage.getItem(`sd-character-sheet`);
    if (!pcJson) return defaultPC();
    const pc = JSON.parse(pcJson) as PlayerCharacter;
    maintainBackwardsCompat(pc);
    return pc;
  }
}

const asyncLocalStorage = {
  setItem: async function (key: string, value: string) {
    return Promise.resolve().then(function () {
      window.localStorage.setItem(key, value);
    });
  },
  getItem: async function (key: string) {
    return Promise.resolve().then(function () {
      return window.localStorage.getItem(key);
    });
  },
};
