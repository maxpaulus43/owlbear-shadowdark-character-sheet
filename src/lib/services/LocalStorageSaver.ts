import { get, writable } from "svelte/store";
import { PlayerCharacterStore } from "../model/PlayerCharacter";
import { defaultPC } from "../model/PlayerCharacter";
import { debounce } from "../utils";
import { CurrentSaveSlot, NUM_SLOTS } from "./SaveSlotTracker";
import { maintainBackwardsCompat as maintainBackwardsCompatPlayer } from "./JSONImporter";
import type { PlayerCharacter } from "../types";
// FIX: Updated import to the new SyncManager
import { updateLocalTimestamp } from "./SyncManager";

export const isSaveInProgress = writable(false);

const saveToLocalStorage = debounce(
  savePlayerToLocalStorage,
  2000,
  () => isSaveInProgress.set(true),
  () => isSaveInProgress.set(false),
);

export function trackAndSavePlayerToLocalStorage(
  pc: PlayerCharacter,
  saveSlot: number,
) {
  saveToLocalStorage(pc, saveSlot);
}

export async function clearLocalStorage() {
  for (let i = 0; i < NUM_SLOTS; i++) {
    await asyncLocalStorage.removeItem(getStorageKey(i + 1));
  }
}

export async function init() {
  CurrentSaveSlot.subscribe((slot) =>
    saveToLocalStorage(get(PlayerCharacterStore), slot),
  );
  PlayerCharacterStore.subscribe((pc) =>
    saveToLocalStorage(pc, get(CurrentSaveSlot)),
  );
  CurrentSaveSlot.subscribe(async (slot) => {
    PlayerCharacterStore.set(await loadPlayerFromLocalStorage(slot));
  });

  CurrentSaveSlot.set(await getSaveSlot());

  CurrentSaveSlot.subscribe(saveSaveSlot);
}

export async function savePlayerToLocalStorage(
  pc: PlayerCharacter,
  saveSlot: number,
) {
  const key = getStorageKey(saveSlot);
  const json = JSON.stringify(pc);

  const existing = await asyncLocalStorage.getItem(key);
  if (existing === json) {
      return; 
  }

  asyncLocalStorage.setItem(key, json);
  await updateLocalTimestamp(saveSlot);
}

function getStorageKey(saveSlot: number) {
  return `sd-character-sheet-slot-${saveSlot}`;
}

export async function getSaveSlot(): Promise<number> {
  return parseInt(
    (await asyncLocalStorage.getItem("sd-character-sheet-chosen-slot")) ?? "1",
  );
}
export async function saveSaveSlot(slot: number) {
  asyncLocalStorage.setItem("sd-character-sheet-chosen-slot", `${slot}`);
}

export async function loadPlayerFromLocalStorage(
  saveSlot: number,
): Promise<PlayerCharacter> {
  await maintainBackwardsCompatSlot(saveSlot);
  const pcJson = await asyncLocalStorage.getItem(getStorageKey(saveSlot));
  if (!pcJson) return defaultPC();
  const pc = JSON.parse(pcJson) as PlayerCharacter;
  maintainBackwardsCompatPlayer(pc);
  return pc;
}

async function maintainBackwardsCompatSlot(saveSlot: number) {
  const oldStorageKey = "sd-character-sheet";
  const oldPcJson = await asyncLocalStorage.getItem(oldStorageKey);
  if (!oldPcJson) return;
  await asyncLocalStorage.setItem(getStorageKey(saveSlot), oldPcJson);
  await asyncLocalStorage.removeItem(oldStorageKey);
}

export const asyncLocalStorage = {
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
  removeItem: async function (key: string) {
    return Promise.resolve().then(function () {
      return window.localStorage.removeItem(key);
    });
  },
};