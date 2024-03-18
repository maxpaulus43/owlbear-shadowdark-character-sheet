import { writable } from "svelte/store";
import type { LocalSettings } from "../types";
import { asyncLocalStorage } from "./LocalStorageSaver";

const SETTINGS_STORAGE_KEY = "sd-character-sheet-local-settings";

function defaultLocalSettings(): LocalSettings {
  return {
    popoverDuration: 5,
  };
}
export const Settings = writable<LocalSettings>(defaultLocalSettings());

export async function initSettings() {
  Settings.set(await loadSettingsFromLocalStorage());
  Settings.subscribe((s) => {
    if (s.popoverDuration < 0) {
      Settings.set({ ...s, popoverDuration: 0 });
      return;
    }
    asyncLocalStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(s));
  });
}

async function loadSettingsFromLocalStorage(): Promise<LocalSettings> {
  try {
    const settings = await asyncLocalStorage.getItem(SETTINGS_STORAGE_KEY);
    const s = JSON.parse(settings) as LocalSettings;
    return s ?? defaultLocalSettings();
  } catch {
    console.error("couldn't load settings from local storage");
    return defaultLocalSettings();
  }
}
