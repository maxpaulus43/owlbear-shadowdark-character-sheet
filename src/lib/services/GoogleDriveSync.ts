import { get, writable } from "svelte/store";
import { PlayerCharacterStore } from "../model/PlayerCharacter";
import { asyncLocalStorage, savePlayerToLocalStorage } from "./LocalStorageSaver";
import { CurrentSaveSlot, NUM_SLOTS } from "./SaveSlotTracker";

// Configuration
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000;
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email';
const AUTO_SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// API Endpoints
const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';

// State
export const isSyncEnabled = writable(false);
export const userEmail = writable<string>("");
export const syncStatus = writable<"idle" | "syncing" | "error" | "paused">("idle");
export const syncMessage = writable<string>(""); 
export const initialSyncComplete = writable(false); 

// Modals & Conflicts
export const showReauthModal = writable(false);
export const showConnectionErrorModal = writable(false);
export const showOfflineConfirmationModal = writable(false);
export const showConflictModal = writable(false);

// Stores which slots are currently in a "Forked" state
export const conflictedSlots = writable<Array<{ slot: number, localDate: Date, remoteDate: Date }>>([]);

let tokenClient: any;
let accessToken: string | null = null;
let tokenExpirationTime: number = 0;
let debounceTimer: any;
let autoSyncTimer: any;
let isSyncing = false;
let isReconnecting = false;
// NEW: Flag to suppress nagging modals if user chose "Work Offline"
let isWorkingOffline = false;

// --- Persistence Helpers ---
function storeToken(token: string, expiresInSeconds: number) {
  const now = Date.now();
  tokenExpirationTime = now + (expiresInSeconds * 1000);
  accessToken = token;
  localStorage.setItem("google_access_token", token);
  localStorage.setItem("google_token_expiry", tokenExpirationTime.toString());
}

function clearToken() {
  accessToken = null;
  tokenExpirationTime = 0;
  localStorage.removeItem("google_access_token");
  localStorage.removeItem("google_token_expiry");
}

function loadToken() {
  const token = localStorage.getItem("google_access_token");
  const expiry = localStorage.getItem("google_token_expiry");
  if (token && expiry) {
    const expTime = parseInt(expiry, 10);
    if (Date.now() < expTime - TOKEN_EXPIRY_BUFFER) {
      accessToken = token;
      tokenExpirationTime = expTime;
      return true;
    }
  }
  clearToken();
  return false;
}

// Track the timestamp of the file when we LAST successfully synced it.
async function getLastSyncedTS(slot: number): Promise<number> {
    const val = await asyncLocalStorage.getItem(`sd-last-synced-ts-${slot}`);
    return val ? parseInt(val, 10) : 0;
}

async function setLastSyncedTS(slot: number, ts: number) {
    await asyncLocalStorage.setItem(`sd-last-synced-ts-${slot}`, ts.toString());
}

function isDefaultCharacter(pc: any): boolean {
    return (
        pc.name === "" && 
        pc.class === "" && 
        pc.level === 0 && 
        pc.xp === 0 && 
        (!pc.gear || pc.gear.length === 0)
    );
}

// --- Auth & Init ---
export function initGoogleAuth() {
  const storedEmail = localStorage.getItem("google_user_email");
  if (storedEmail) {
    userEmail.set(storedEmail);
    isSyncEnabled.set(true);
    isReconnecting = true;
  }

  if (loadToken() && get(isSyncEnabled)) {
      initialSyncComplete.set(false);
  } else {
      initialSyncComplete.set(true); 
  }

  if (!document.getElementById('gsi-script')) {
    const script = document.createElement('script');
    script.id = 'gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (response: any) => {
          if (response.access_token) {
            handleAuthSuccess(response);
          }
        },
      });

      if (get(isSyncEnabled)) {
          if (loadToken()) {
              startAutoSync();
              performStartupSync();
          } else {
              console.log("Token expired on startup.");
              syncStatus.set("error");
              showReauthModal.set(true);
              initialSyncComplete.set(true);
          }
      }
    };
    document.body.appendChild(script);
  }
}

async function handleAuthSuccess(response: any) {
    storeToken(response.access_token, response.expires_in);
    await fetchUserProfile();
    isSyncEnabled.set(true);
    
    // Recovery: Clear the offline flag
    isWorkingOffline = false;
    
    showReauthModal.set(false); 
    showConnectionErrorModal.set(false);
    syncStatus.set("idle"); 
    
    startAutoSync();
    
    if (!get(initialSyncComplete)) {
        performStartupSync();
    } else {
        if (isReconnecting) {
             performSync(); 
        } else {
             checkForCloudDataAndInit();
        }
    }
    isReconnecting = true;
}

export function enableOfflineMode() {
    // 1. Close Error Modals
    showReauthModal.set(false);
    showConnectionErrorModal.set(false);
    
    // 2. Set State
    isWorkingOffline = true; // Flag enabled
    // Note: We DO NOT stop auto sync. We keep trying silently.
    
    syncStatus.set("error");
    showOfflineConfirmationModal.set(true);
}

function startAutoSync() {
    stopAutoSync();
    autoSyncTimer = setInterval(() => {
        performSync(false); // isManual = false
    }, AUTO_SYNC_INTERVAL_MS);
}

function stopAutoSync() {
    if (autoSyncTimer) clearInterval(autoSyncTimer);
}

export function login() {
  if (tokenClient) tokenClient.requestAccessToken();
}

export function logout() {
  stopAutoSync();
  clearToken();
  userEmail.set("");
  isSyncEnabled.set(false);
  isReconnecting = false;
  isWorkingOffline = false;
  localStorage.removeItem("google_user_email");
  syncStatus.set("idle");
}

async function fetchUserProfile() {
    if (!accessToken) return;
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const profile = await response.json();
        if (profile.email) {
            userEmail.set(profile.email);
            localStorage.setItem("google_user_email", profile.email);
        }
    } catch (e) { console.error(e); }
}

// --- API Helpers ---
async function listAllSyncedFiles(): Promise<Record<string, { id: string, appProperties?: any }>> {
  if (!accessToken) throw new Error("AUTH_ERROR");
  const query = `trashed = false and 'appDataFolder' in parents`;
  const url = `${DRIVE_API}?q=${encodeURIComponent(query)}&fields=files(id, name, appProperties)&spaces=appDataFolder`;
  
  let response;
  try {
      response = await fetch(url, { headers: { 'Authorization': `Bearer ${accessToken}` } });
  } catch (e) { throw new Error("NETWORK_ERROR"); }

  if (response.status === 401 || response.status === 403) throw new Error("AUTH_ERROR");
  const data = await response.json();
  
  if (data.files) {
      return data.files.reduce((acc: any, f: any) => {
          acc[f.name] = { id: f.id, appProperties: f.appProperties };
          return acc;
      }, {});
  }
  return {};
}

async function downloadFile(fileId: string) {
  let response;
  try {
    response = await fetch(`${DRIVE_API}/${fileId}?alt=media`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
  } catch(e) { throw new Error("NETWORK_ERROR"); }

  if (response.status === 401 || response.status === 403) throw new Error("AUTH_ERROR");
  return await response.json();
}

async function uploadFile(filename: string, content: any, fileId: string | null = null) {
  const metadata = { 
      name: filename, 
      mimeType: 'application/json', 
      parents: fileId ? [] : ['appDataFolder'],
      appProperties: { ts: content.ts.toString() } 
  };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', new Blob([JSON.stringify(content)], { type: 'application/json' }));
  
  const url = fileId ? `${UPLOAD_API}/${fileId}?uploadType=multipart` : `${UPLOAD_API}?uploadType=multipart`;
  const method = fileId ? 'PATCH' : 'POST';
  
  let response;
  try {
    response = await fetch(url, { method, headers: { 'Authorization': `Bearer ${accessToken}` }, body: formData });
  } catch(e) { throw new Error("NETWORK_ERROR"); }

  if (response.status === 401 || response.status === 403) throw new Error("AUTH_ERROR");
}

async function deleteFile(fileId: string) {
    await fetch(`${DRIVE_API}/${fileId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${accessToken}` } });
}

// --- CORE SYNC LOGIC ---

async function performStartupSync() {
    await performSync(false);
    initialSyncComplete.set(true);
}

export async function updateLocalTimestamp(slot: number) {
  if (!get(isSyncEnabled) || !get(initialSyncComplete)) return;
  await asyncLocalStorage.setItem(`sd-character-sheet-slot-${slot}-meta`, Date.now().toString());
  debouncedSync();
}

function debouncedSync() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => performSync(false), 2000);
}

export function forceSync() {
    performSync(true); // Manual trigger
}

export async function performSync(isManual = false) {
  if (isSyncing) return;
  
  // Pre-flight Token Check
  if (!loadToken() && get(isSyncEnabled)) {
      syncStatus.set("error");
      // Only show modal if Manual click OR Not in Offline Mode
      if (isManual || !isWorkingOffline) showReauthModal.set(true);
      return;
  }
  if (!accessToken) return;

  isSyncing = true;
  syncStatus.set("syncing");
  syncMessage.set("Syncing...");

  try {
    const remoteFiles = await listAllSyncedFiles();
    const conflicts = [];

    for (let i = 1; i <= NUM_SLOTS; i++) {
        syncMessage.set(`Comparing slot ${i}...`);

        const slotKey = `sd-character-sheet-slot-${i}`;
        const metaKey = `${slotKey}-meta`;
        const filename = `shadowdark_slot_${i}.json`;
        
        const localData = await asyncLocalStorage.getItem(slotKey);
        const localMeta = await asyncLocalStorage.getItem(metaKey);
        const localTS = localMeta ? parseInt(localMeta, 10) : 0;
        const lastSyncedTS = await getLastSyncedTS(i); 
        
        const remoteFile = remoteFiles[filename];

        let remoteTS = 0;
        let remoteContent = null; 

        if (remoteFile) {
            if (remoteFile.appProperties?.ts) {
                remoteTS = parseInt(remoteFile.appProperties.ts);
            } else {
                syncMessage.set(`Downloading slot ${i} (Legacy check)...`);
                remoteContent = await downloadFile(remoteFile.id);
                remoteTS = remoteContent.ts || 0;
            }
        }

        const isLocalDefault = localData ? isDefaultCharacter(JSON.parse(localData)) : true;
        const hasLocalTimestamp = localMeta !== null;

        if (remoteFile && !isLocalDefault && hasLocalTimestamp) {
             if (remoteTS > lastSyncedTS && localTS > lastSyncedTS) {
                 if (remoteTS !== localTS) {
                     conflicts.push({
                         slot: i,
                         localDate: new Date(localTS),
                         remoteDate: new Date(remoteTS)
                     });
                     continue;
                 }
             }
        }

        if (remoteFile && (isLocalDefault || !hasLocalTimestamp)) {
            syncMessage.set(`Downloading slot ${i}...`);
            if (!remoteContent) remoteContent = await downloadFile(remoteFile.id);
            await savePlayerToLocalStorage(remoteContent.value, i);
            await asyncLocalStorage.setItem(metaKey, remoteTS.toString());
            await setLastSyncedTS(i, remoteTS);
            if (get(CurrentSaveSlot) === i) PlayerCharacterStore.set(remoteContent.value);
        }
        else if (remoteFile && remoteTS > lastSyncedTS) {
            syncMessage.set(`Downloading slot ${i}...`);
            if (!remoteContent) remoteContent = await downloadFile(remoteFile.id);
            await savePlayerToLocalStorage(remoteContent.value, i);
            await asyncLocalStorage.setItem(metaKey, remoteTS.toString());
            await setLastSyncedTS(i, remoteTS);
            if (get(CurrentSaveSlot) === i) PlayerCharacterStore.set(remoteContent.value);
        }
        else if (localData && localTS > lastSyncedTS) {
            syncMessage.set(`Uploading slot ${i}...`);
            const payload = { value: JSON.parse(localData), ts: localTS };
            await uploadFile(filename, payload, remoteFile ? remoteFile.id : null);
            await setLastSyncedTS(i, localTS); 
        }
        else if (localData && !remoteFile && !isLocalDefault) {
             syncMessage.set(`Uploading new slot ${i}...`);
             const payload = { value: JSON.parse(localData), ts: localTS || Date.now() };
             await uploadFile(filename, payload);
             await setLastSyncedTS(i, payload.ts);
        }
    }

    if (conflicts.length > 0) {
        conflictedSlots.set(conflicts);
        showConflictModal.set(true);
        syncStatus.set("paused");
        syncMessage.set("Conflicts detected");
    } else {
        // SUCCESS: Auto-recover from offline mode
        isWorkingOffline = false; 
        syncStatus.set("idle");
        syncMessage.set("");
    }

  } catch (e: any) {
    console.error("Sync Error:", e.message);
    syncStatus.set("error");
    syncMessage.set("Sync Failed");
    
    // Only show error modals if Manual or NOT in Offline Mode
    const shouldShowModal = isManual || !isWorkingOffline;

    if (e.message === "AUTH_ERROR") {
        if (shouldShowModal) showReauthModal.set(true);
    } else if (e.message === "NETWORK_ERROR") {
        if (shouldShowModal) showConnectionErrorModal.set(true);
    }
  } finally {
    isSyncing = false;
    if (get(syncStatus) === 'idle') {
        setTimeout(() => syncMessage.set(""), 2000);
    }
  }
}

// ... Conflict Resolution & Others (No changes needed) ...
export async function resolveConflict(slot: number, choice: 'local' | 'remote') {
    const slotKey = `sd-character-sheet-slot-${slot}`;
    const metaKey = `${slotKey}-meta`;
    const filename = `shadowdark_slot_${slot}.json`;
    const remoteFiles = await listAllSyncedFiles();
    const remoteFile = remoteFiles[filename];

    if (!remoteFile) return;
    syncMessage.set(`Resolving slot ${slot}...`);

    if (choice === 'local') {
        const localData = await asyncLocalStorage.getItem(slotKey);
        const localMeta = await asyncLocalStorage.getItem(metaKey);
        const localTS = localMeta ? parseInt(localMeta, 10) : Date.now();
        if (localData) {
            const payload = { value: JSON.parse(localData), ts: localTS };
            await uploadFile(filename, payload, remoteFile.id);
            await setLastSyncedTS(slot, localTS);
        }
    } else {
        const remoteContent = await downloadFile(remoteFile.id);
        const remoteTS = remoteContent.ts || 0;
        await savePlayerToLocalStorage(remoteContent.value, slot);
        await asyncLocalStorage.setItem(metaKey, remoteTS.toString());
        await setLastSyncedTS(slot, remoteTS);
        if (get(CurrentSaveSlot) === slot) PlayerCharacterStore.set(remoteContent.value);
    }

    conflictedSlots.update(list => list.filter(c => c.slot !== slot));

    if (get(conflictedSlots).length === 0) {
        showConflictModal.set(false);
        syncStatus.set("idle");
        syncMessage.set("Sync Complete");
        setTimeout(() => syncMessage.set(""), 2000);
    }
}

export async function deleteCloudDataAndLogout() {
    if (!accessToken) return;
    try {
        syncStatus.set("syncing");
        const files = await listAllSyncedFiles();
        for (const key in files) await deleteFile(files[key].id);
        logout();
    } catch (e) { syncStatus.set("error"); }
}
async function checkForCloudDataAndInit() {
    syncStatus.set("syncing");
    const files = await listAllSyncedFiles();
    if (Object.keys(files).length > 0) {
        showConflictModal.set(true);
    } else {
        performSync();
    }
}