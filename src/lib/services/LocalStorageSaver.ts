import { get } from "svelte/store";
import { PlayerCharacterStore } from "../model/PlayerCharacter";
import type { PlayerCharacter } from "../model/PlayerCharacter";
import { defaultPC } from "../model/PlayerCharacter";
import { debounce } from "../utils";
import { CurrentSaveSlot, NUM_SLOTS } from "./SaveSlotTracker";

const saveToLocalStorage = debounce(savePlayerToLocalStorage, 2000);

export function trackAndSavePlayerToLocalStorage(
  pc: PlayerCharacter,
  saveSlot: number
) {
  saveToLocalStorage(pc, saveSlot);
}

export async function clearLocalStorage() {
  for (let i = 0; i < NUM_SLOTS; i++) {
    await asyncLocalStorage.removeItem(getStorageKey(i + 1));
  }
}

export async function init() {
  CurrentSaveSlot.set(await getSaveSlot());
  CurrentSaveSlot.subscribe(async (slot) => {
    saveSaveSlot(slot);
    const pc = await loadPlayerFromLocalStorage(slot);
    PlayerCharacterStore.set(pc);
  });
  PlayerCharacterStore.subscribe((pc) => {
    const slot = get(CurrentSaveSlot);
    saveToLocalStorage(pc, slot);
  });
}

export async function savePlayerToLocalStorage(
  pc: PlayerCharacter,
  saveSlot: number
) {
  asyncLocalStorage.setItem(getStorageKey(saveSlot), JSON.stringify(pc));
}

function getStorageKey(saveSlot: number) {
  return `sd-character-sheet-slot-${saveSlot}`;
}

export async function getSaveSlot(): Promise<number> {
  return parseInt(
    (await asyncLocalStorage.getItem("sd-character-sheet-chosen-slot")) ?? "1"
  );
}
export async function saveSaveSlot(slot: number) {
  asyncLocalStorage.setItem("sd-character-sheet-chosen-slot", `${slot}`);
}

export async function loadPlayerFromLocalStorage(
  saveSlot: number
): Promise<PlayerCharacter> {
  await maintainBackwardsCompat(saveSlot);
  const pcJson = await asyncLocalStorage.getItem(getStorageKey(saveSlot));
  if (!pcJson) return defaultPC();
  const pc = JSON.parse(pcJson) as PlayerCharacter;
  return pc;
}

async function maintainBackwardsCompat(saveSlot: number) {
  const oldStorageKey = "sd-character-sheet";
  const oldPcJson = await asyncLocalStorage.getItem(oldStorageKey);
  if (!oldPcJson) return;
  await asyncLocalStorage.setItem(getStorageKey(saveSlot), oldPcJson);
  await asyncLocalStorage.removeItem(oldStorageKey);
}

const asyncLocalStorage = {
  setItem: async function (key: string, value: string) {
    return Promise.resolve()
      .then(function () {
        window.localStorage.setItem(key, value);
      })
      .catch((err) => {
        // local storage not available
      });
  },
  getItem: async function (key: string) {
    return Promise.resolve()
      .then(function () {
        return window.localStorage.getItem(key);
      })
      .catch((err) => {
        // local storage not available
        return undefined;
      });
  },
  removeItem: async function (key: string) {
    return Promise.resolve()
      .then(function () {
        return window.localStorage.removeItem(key);
      })
      .catch((err) => {
        // local storage not available
      });
  },
};
