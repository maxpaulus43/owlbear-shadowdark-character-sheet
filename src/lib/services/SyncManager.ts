import { get, writable } from "svelte/store";
import { PlayerCharacterStore } from "../model/PlayerCharacter";
import { asyncLocalStorage, savePlayerToLocalStorage } from "./LocalStorageSaver";
import { debounce } from "../utils";
import { CurrentSaveSlot, NUM_SLOTS } from "./SaveSlotTracker";
import type { CloudProvider } from "./sync/CloudProvider";
import { GoogleProvider } from "./sync/GoogleProvider";
import { DropboxProvider } from "./sync/DropboxProvider";

// State
export const isSyncEnabled = writable(false);
export const userEmail = writable<string>("");
export const syncStatus = writable<"idle" | "syncing" | "error" | "paused">("idle");
export const syncMessage = writable<string>("");
export const initialSyncComplete = writable(false);
export const syncProviderName = writable<string>("");

// Modals
export const showReauthModal = writable(false);
export const showConnectionErrorModal = writable(false);
export const showOfflineConfirmationModal = writable(false);
export const showConflictModal = writable(false);
export const showSetupModal = writable(false); // NEW

export const conflictedSlots = writable<Array<{ slot: number, localDate: Date, remoteDate: Date }>>([]);
export const lastSyncedTimestamp = writable<Record<number, number>>({});

let activeProvider: CloudProvider | null = null;
let autoSyncTimer: any;
let isSyncing = false;
let isWorkingOffline = false;


// --- Init ---

export async function initSync() {
    // 1. Check for Dropbox Callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
        // Assume Dropbox redirect
        activeProvider = new DropboxProvider();
        try {
            await activeProvider.handleCallback!(code);
            window.history.replaceState({}, document.title, "/");
            localStorage.setItem("sync_provider", "dropbox");
            await finishSetup();
        } catch (e) {
            console.error("Dropbox Auth Failed", e);
            window.history.replaceState({}, document.title, "/");
        }
        return;
    }

    // 2. Normal Init
    const savedProvider = localStorage.getItem("sync_provider");
    if (savedProvider === "google") activeProvider = new GoogleProvider();
    else if (savedProvider === "dropbox") activeProvider = new DropboxProvider();

    if (activeProvider) {
        syncProviderName.set(activeProvider.name);
        await activeProvider.init();

        // Listen for internal Google success event
        window.addEventListener('google-auth-success', () => finishSetup());

        if (activeProvider.isAuthenticated()) {
            await finishSetup();
        } else {
            initialSyncComplete.set(true);
        }
    } else {
        initialSyncComplete.set(true);
    }
}

async function finishSetup() {
    if (!activeProvider) return;
    const email = await activeProvider.getUserEmail();
    userEmail.set(email);
    isSyncEnabled.set(true);
    syncProviderName.set(activeProvider.name);
    isWorkingOffline = false;

    // Reset modals
    showReauthModal.set(false);
    showSetupModal.set(false);

    startAutoSync();

    // First Sync (check conflicts)
    performSync();

    // If this was startup
    if (!get(initialSyncComplete)) {
        initialSyncComplete.set(true);
    }
}

// --- Setup Flow ---

export function requestSetup() {
    if (get(isSyncEnabled)) return;
    showSetupModal.set(true);
}

export function selectProvider(provider: "google" | "dropbox") {
    if (provider === "google") activeProvider = new GoogleProvider();
    if (provider === "dropbox") activeProvider = new DropboxProvider();

    localStorage.setItem("sync_provider", provider);
    activeProvider!.init().then(() => {
        activeProvider!.login();
    });
}

// --- Logic (mostly unchanged, just uses activeProvider) ---

export function enableOfflineMode() {
    showReauthModal.set(false);
    showConnectionErrorModal.set(false);
    isWorkingOffline = true;
    syncStatus.set("error");
    showOfflineConfirmationModal.set(true);
}

function startAutoSync() {
    if (autoSyncTimer) clearInterval(autoSyncTimer);
    autoSyncTimer = setInterval(() => performSync(false), 5 * 60 * 1000);
}

export function login() {
    if (activeProvider) activeProvider.login();
    else requestSetup();
}

export async function logout() {
    if (autoSyncTimer) clearInterval(autoSyncTimer);
    if (activeProvider) await activeProvider.logout();

    localStorage.removeItem("sync_provider");
    activeProvider = null;
    userEmail.set("");
    syncProviderName.set("");
    isSyncEnabled.set(false);
    isWorkingOffline = false;

    // Reset history
    for (let i = 1; i <= NUM_SLOTS; i++) {
        await asyncLocalStorage.setItem(`sd-last-synced-ts-${i}`, "0");
    }
    syncStatus.set("idle");
}

const debouncedSync = debounce(() => performSync(false), 2000);

export async function updateLocalTimestamp(slot: number) {
    const meta = { ts: Date.now() };
    await asyncLocalStorage.setItem(`sd-character-sheet-slot-${slot}-meta`, JSON.stringify(meta));
    if (get(isSyncEnabled) && get(initialSyncComplete)) {
        debouncedSync();
    }
}

export function resetSyncState() {
    isSyncing = false;
    syncStatus.set("idle");
    syncMessage.set("");
}

export function forceSync() { performSync(true); }

export async function performSync(isManual = false) {
    if (isSyncing || !activeProvider) return;

    if (!activeProvider.isAuthenticated() && get(isSyncEnabled)) {
        syncStatus.set("error");
        if (isManual || !isWorkingOffline) showReauthModal.set(true);
        return;
    }

    isSyncing = true;
    syncStatus.set("syncing");
    syncMessage.set("Syncing...");

    try {
        const remoteFiles = await activeProvider.list();
        const conflicts = [];

        for (let i = 1; i <= NUM_SLOTS; i++) {
            syncMessage.set(`Comparing slot ${i}...`);
            const slotKey = `sd-character-sheet-slot-${i}`;
            const metaKey = `${slotKey}-meta`;
            const filename = `shadowdark_slot_${i}.json`;

            const localData = await asyncLocalStorage.getItem(slotKey);
            const localMetaRaw = await asyncLocalStorage.getItem(metaKey);

            let localTS = 0;
            if (localMetaRaw) {
                try {
                    const parsed = JSON.parse(localMetaRaw);
                    // Check if object with ts, otherwise fallback
                    if (parsed && typeof parsed === 'object' && 'ts' in parsed) {
                        localTS = parsed.ts;
                    } else {
                        throw new Error("Not a meta object");
                    }
                } catch {
                    // Fallback for legacy string format or raw number
                    localTS = parseInt(localMetaRaw, 10) || 0;
                }
            }
            const lastSyncedTSVal = await asyncLocalStorage.getItem(`sd-last-synced-ts-${i}`);
            const lastSyncedTS = lastSyncedTSVal ? parseInt(lastSyncedTSVal, 10) : 0;

            const remoteFile = remoteFiles[filename];
            let remoteTS = 0;
            let remoteContent = null;

            if (remoteFile) {
                // Use metadata if available (Google), else lazy download (Dropbox)
                if (remoteFile.ts) {
                    remoteTS = remoteFile.ts;
                } else {
                    syncMessage.set(`Checking slot ${i}...`);
                    remoteContent = await activeProvider.download(remoteFile.id);
                    remoteTS = remoteContent.ts || 0;
                }
            }

            const isLocalDefault = localData ? isDefaultCharacter(JSON.parse(localData)) : true;

            // Conflict Detection
            if (remoteFile && !isLocalDefault && lastSyncedTS === 0) {
                conflicts.push({ slot: i, localDate: new Date(localTS || Date.now()), remoteDate: new Date(remoteTS) });
                continue;
            }
            if (remoteFile && !isLocalDefault && localMetaRaw) {
                if (remoteTS > lastSyncedTS && localTS > lastSyncedTS && remoteTS !== localTS) {
                    conflicts.push({ slot: i, localDate: new Date(localTS), remoteDate: new Date(remoteTS) });
                    continue;
                }
            }

            // Sync Actions
            if (remoteFile && (isLocalDefault || !localMetaRaw || remoteTS > lastSyncedTS)) {
                syncMessage.set(`Downloading slot ${i}...`);
                if (!remoteContent) remoteContent = await activeProvider.download(remoteFile.id);
                await savePlayerToLocalStorage(remoteContent.value, i);
                await asyncLocalStorage.setItem(metaKey, JSON.stringify({ ts: remoteTS }));
                await asyncLocalStorage.setItem(`sd-last-synced-ts-${i}`, remoteTS.toString());
                if (get(CurrentSaveSlot) === i) PlayerCharacterStore.set(remoteContent.value);
            }
            else if (localData && (!remoteFile || localTS > lastSyncedTS)) {
                syncMessage.set(`Uploading slot ${i}...`);
                const payload = { value: JSON.parse(localData), ts: localTS };
                await activeProvider.upload(filename, payload, remoteFile?.id);
                await asyncLocalStorage.setItem(`sd-last-synced-ts-${i}`, localTS.toString());
            }
        }

        if (conflicts.length > 0) {
            conflictedSlots.set(conflicts);
            showConflictModal.set(true);
            syncStatus.set("paused");
            syncMessage.set("Conflicts detected");
        } else {
            isWorkingOffline = false;
            syncStatus.set("idle");
            syncMessage.set("");
        }

    } catch (e: any) {
        console.error("Sync Error", e);
        syncStatus.set("error");
        syncMessage.set("Sync Failed");
        if (isManual || !isWorkingOffline) {
            if (e.message === "AUTH_ERROR") showReauthModal.set(true);
            else showConnectionErrorModal.set(true);
        }
    } finally {
        isSyncing = false;
        if (get(syncStatus) === 'idle') setTimeout(() => syncMessage.set(""), 2000);
    }
}

export async function resolveConflict(slot: number, choice: 'local' | 'remote') {
    if (!activeProvider) return;
    const filename = `shadowdark_slot_${slot}.json`;
    const remoteFiles = await activeProvider.list();
    const remoteFile = remoteFiles[filename];

    if (choice === 'local') {
        const localData = await asyncLocalStorage.getItem(`sd-character-sheet-slot-${slot}`);
        if (localData) {
            const ts = Date.now();
            await activeProvider.upload(filename, { value: JSON.parse(localData), ts }, remoteFile?.id);
            await asyncLocalStorage.setItem(`sd-last-synced-ts-${slot}`, ts.toString());
        }
    } else {
        if (remoteFile) {
            const data = await activeProvider.download(remoteFile.id);
            await savePlayerToLocalStorage(data.value, slot);
            await asyncLocalStorage.setItem(`sd-character-sheet-slot-${slot}-meta`, JSON.stringify({ ts: data.ts }));
            await asyncLocalStorage.setItem(`sd-last-synced-ts-${slot}`, data.ts.toString());
            if (get(CurrentSaveSlot) === slot) PlayerCharacterStore.set(data.value);
        }
    }
    conflictedSlots.update(l => l.filter(c => c.slot !== slot));
    if (get(conflictedSlots).length === 0) {
        showConflictModal.set(false);
        performSync();
    }
}

export async function deleteCloudDataAndLogout() {
    if (!activeProvider) return;
    syncStatus.set("syncing");
    const files = await activeProvider.list();
    for (const key in files) await activeProvider.delete(files[key].id);
    logout();
}

function isDefaultCharacter(pc: any): boolean {
    return (pc.name === "" && pc.class === "" && pc.level === 0 && pc.xp === 0 && (!pc.gear || pc.gear.length === 0));
}