import { get, writable } from "svelte/store";
import { PlayerCharacterStore } from "../model/PlayerCharacter";
import { asyncLocalStorage, savePlayerToLocalStorage } from "./LocalStorageSaver";
import { debounce } from "../utils";
import { CurrentSaveSlot, NUM_SLOTS } from "./SaveSlotTracker";
import type { CloudProvider } from "./sync/CloudProvider";
import { GoogleProvider } from "./sync/GoogleProvider";
import { DropboxProvider } from "./sync/DropboxProvider";
import { determineSyncAction } from "./sync/SyncUtils";
import { ShadowdarkCharacterSchema, SyncError, SyncErrorCode, type SyncMetadata } from "./sync/SyncTypes";

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
export const showSetupModal = writable(false);
export const showDeleteConfirmationModal = writable(false);
export const showDataCorruptionModal = writable(false);

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

    // Listen for Google Auth Success if selecting Google
    if (provider === "google") {
        window.addEventListener('google-auth-success', () => finishSetup());
    }

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

    isSyncing = true;
    syncStatus.set("syncing");
    syncMessage.set("Syncing...");

    try {
        const remoteFiles = await activeProvider.list();
        const conflicts: Array<{ slot: number, localDate: Date, remoteDate: Date }> = [];

        for (let i = 1; i <= NUM_SLOTS; i++) {
            syncMessage.set(`Comparing slot ${i}...`);
            const slotKey = `sd-character-sheet-slot-${i}`;
            const metaKey = `${slotKey}-meta`;
            const filename = `shadowdark_slot_${i}.json`;

            const localDataRaw = await asyncLocalStorage.getItem(slotKey);
            const localMetaRaw = await asyncLocalStorage.getItem(metaKey);
            let localMeta: SyncMetadata | null = null;

            // Parse Local Metadata safely
            if (localMetaRaw) {
                try {
                    const parsed = JSON.parse(localMetaRaw);
                    // Check if object with ts, otherwise fallback
                    if (parsed && typeof parsed === 'object' && 'ts' in parsed) {
                        localMeta = parsed;
                    } else {
                        // Legacy: treat raw number/string as ts
                        localMeta = { ts: parseInt(localMetaRaw, 10) || 0 };
                    }
                } catch {
                    localMeta = { ts: parseInt(localMetaRaw, 10) || 0 };
                }
            }

            const lastSyncedTSVal = await asyncLocalStorage.getItem(`sd-last-synced-ts-${i}`);
            const lastSyncedTS = lastSyncedTSVal ? parseInt(lastSyncedTSVal, 10) : 0;

            const remoteFile = remoteFiles[filename];
            let remoteTS = 0;
            let remoteContent = null;

            if (remoteFile) {
                if (remoteFile.ts) {
                    remoteTS = remoteFile.ts;
                } else {
                    syncMessage.set(`Checking slot ${i}...`);
                    // Pre-download to check TS if not in metadata (Dropbox)
                    remoteContent = await activeProvider.download(remoteFile.id);
                    remoteTS = remoteContent.ts || 0;
                }
            }

            // Determine Action
            const action = determineSyncAction({
                localData: localDataRaw,
                localMeta,
                lastSyncedTS,
                remoteFile,
                remoteTS
            });

            if (action.type === "conflict") {
                const localTSVal = localMeta?.ts || Date.now();
                conflicts.push({ slot: i, localDate: new Date(localTSVal), remoteDate: new Date(remoteTS) });
            }
            else if (action.type === "download") {
                syncMessage.set(`Downloading slot ${i}...`);
                if (!remoteContent && remoteFile) remoteContent = await activeProvider.download(remoteFile.id);

                if (remoteContent) {
                    // Zod Validation
                    try {
                        ShadowdarkCharacterSchema.parse(remoteContent.value);
                    } catch (e) {
                        console.error(`Slot ${i} remote data invalid`, e);
                        throw new SyncError(SyncErrorCode.DATA_CORRUPTION, `Slot ${i} data corrupted`);
                    }

                    await savePlayerToLocalStorage(remoteContent.value, i);
                    const newMeta = { ts: remoteTS };
                    await asyncLocalStorage.setItem(metaKey, JSON.stringify(newMeta));
                    await asyncLocalStorage.setItem(`sd-last-synced-ts-${i}`, remoteTS.toString());

                    if (get(CurrentSaveSlot) === i) PlayerCharacterStore.set(remoteContent.value);
                }
            }
            else if (action.type === "upload") {
                syncMessage.set(`Uploading slot ${i}...`);
                const localTSVal = localMeta?.ts || Date.now();
                // Ensure we have data to upload
                if (localDataRaw) {
                    const payload = { value: JSON.parse(localDataRaw), ts: localTSVal };
                    await activeProvider.upload(filename, payload, remoteFile?.id);
                    await asyncLocalStorage.setItem(`sd-last-synced-ts-${i}`, localTSVal.toString());
                }
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
            if (e instanceof SyncError) {
                if (e.code === SyncErrorCode.AUTH_ERROR) showReauthModal.set(true);
                else if (e.code === SyncErrorCode.DATA_CORRUPTION) {
                    syncMessage.set("Data Validation Failed");
                    showDataCorruptionModal.set(true);
                }
                else showConnectionErrorModal.set(true);
            } else {
                // Fallback for unknown errors
                if (e.message === "AUTH_ERROR") showReauthModal.set(true);
                else showConnectionErrorModal.set(true);
            }
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
