import OBR from "@owlbear-rodeo/sdk";
import type { Player } from "@owlbear-rodeo/sdk";
import { defaultPC } from "../model/PlayerCharacter";
import { PlayerCharacterStore } from "../model/PlayerCharacter";
import { debounce } from "../utils";
import { writable, get, derived } from "svelte/store";
import {
  getSaveSlot,
  loadPlayerFromLocalStorage,
  savePlayerToLocalStorage,
  saveSaveSlot,
} from "./LocalStorageSaver";
import { CurrentSaveSlot, NUM_SLOTS } from "./SaveSlotTracker";
import type { PlayerCharacter } from "../types";
import { NOTIFICATION_KEY, showPopover } from "./Notifier";

const PLUGIN_ID = "com.maxpaulus.sd-character-sheet";

const PlayerMetaDataMapStore = writable<{ [pId: string]: PlayerMetaData }>({});
const PlayerMetaDataStore = writable<PlayerMetaData>({});
type PlayerMetaData = {
  [key in `slot-${1 | 2 | 3 | 4 | 5}`]?: PlayerCharacter;
};

export function pluginId(s: string) {
  return `${PLUGIN_ID}/${s}`;
}

export const isGM = writable(false);
export const PartyStore = writable<Player[]>([]);
export const TrackedPlayer = writable<string>();
export const GmId = writable<string>();
export const GmPlayer = writable<Player>();

export const isTrackedPlayerGM = derived(TrackedPlayer, ($trackedPlayer) => {
  return $trackedPlayer == get(GmId);
});

export async function init() {
  OBR.onReady(async () => {
    isGM.set((await OBR.player.getRole()) === "GM");

    subscribeToRoomNotifications();

    if (get(isGM)) {
      initGM();

      // GM is also a player
      initPlayer();
    } else {
      initPlayer();
    }
  });
}

function subscribeToRoomNotifications() {
  OBR.broadcast.onMessage(NOTIFICATION_KEY, ({ data: notif }) => {
    if (typeof notif !== "string") return;
    showPopover(notif);
  });
}

async function initGM() {
  GmId.set(OBR.player.id)
  TrackedPlayer.set(OBR.player.id)

  OBR.player.onChange((gm) => {
    GmPlayer.set(gm);
  });

  OBR.party.onChange((party) => {
    PartyStore.set(party);
  });

  PartyStore.subscribe(async (party) => {
    const pmd: { [pId: string]: PlayerMetaData } = {};

    // add GM metadata too
    pmd[OBR.player.id] = (await OBR.player.getMetadata())[pluginId("sheetData")];

    for (const p of party) {
      pmd[p.id] = p.metadata[pluginId("sheetData")];
    }
    PlayerMetaDataMapStore.set(pmd);
  });

  PlayerMetaDataMapStore.subscribe((pmd) => {
    const slot = get(CurrentSaveSlot);
    const pId = get(TrackedPlayer);
    PlayerCharacterStore.set(pmd[pId]?.[`slot-${slot}`] ?? defaultPC());
  });

  CurrentSaveSlot.subscribe((slot) => {
    const pmd = get(PlayerMetaDataMapStore);
    const pId = get(TrackedPlayer);
    PlayerCharacterStore.set(pmd[pId]?.[`slot-${slot}`] ?? defaultPC());
  });

  TrackedPlayer.subscribe((pId) => {
    const pmd = get(PlayerMetaDataMapStore);
    const slot = get(CurrentSaveSlot);
    PlayerCharacterStore.set(pmd[pId]?.[`slot-${slot}`] ?? defaultPC());
  });

  PartyStore.set(await OBR.party.getPlayers());
}

async function initPlayer() {
  CurrentSaveSlot.set(await getSaveSlot());

  const playerMd: { [key: string]: PlayerCharacter } = {};
  for (let i = 1; i <= NUM_SLOTS; i++) {
    playerMd[`slot-${i}`] =
      (await loadPlayerFromLocalStorage(i)) ?? defaultPC();
  }

  PlayerMetaDataStore.set(playerMd);

  PlayerCharacterStore.subscribe(
    debounce((pc) => {
      if (get(isGM) && !get(isTrackedPlayerGM)) return;

      const pmd = get(PlayerMetaDataStore);
      const slot = get(CurrentSaveSlot);
      savePlayerToLocalStorage(pc, slot);
      pmd[`slot-${slot}`] = pc;
      PlayerMetaDataStore.set(pmd);
    }, 1000),
  );

  CurrentSaveSlot.subscribe((slot) => {
    if (get(isGM) && !get(isTrackedPlayerGM)) return;

    saveSaveSlot(slot);
    const pmd = get(PlayerMetaDataStore);
    PlayerCharacterStore.set(pmd[`slot-${slot}`]);
  });

  PlayerMetaDataStore.subscribe((pmd) => {
    if (get(isGM) && !get(isTrackedPlayerGM)) return;

    OBR.player.setMetadata({
      [pluginId("sheetData")]: pmd,
    });
  });
}
