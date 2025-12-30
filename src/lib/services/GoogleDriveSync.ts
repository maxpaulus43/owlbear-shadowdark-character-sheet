import { get, writable } from "svelte/store";
import { PlayerCharacterStore } from "../model/PlayerCharacter";
import { asyncLocalStorage, savePlayerToLocalStorage } from "./LocalStorageSaver";
import { CurrentSaveSlot, NUM_SLOTS } from "./SaveSlotTracker";
import type { PlayerCharacter } from "../types";

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
export const showConflictModal = writable(false);
export const initialSyncComplete = writable(false); // Controls the "Loading..." screen

let tokenClient: any;
let accessToken: string | null = null;
let tokenExpirationTime: number = 0;
let debounceTimer: any;
let autoSyncTimer: any;
let isSyncing = false;

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

// --- Auth & Init ---
export function initGoogleAuth() {
  const storedEmail = localStorage.getItem("google_user_email");
  if (storedEmail) {
    userEmail.set(storedEmail);
    isSyncEnabled.set(true);
  }

  // If we have a token, we are "Loading" until we verify
  if (loadToken() && get(isSyncEnabled)) {
      initialSyncComplete.set(false);
  } else {
      initialSyncComplete.set(true); // No auth? We are ready immediately.
  }

  if (!document.getElementById('gsi-script')) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (response: any) => {
          if (response.access_token) {
            storeToken(response.access_token, response.expires_in);
            await fetchUserProfile();
            isSyncEnabled.set(true);
            startAutoSync();
            checkForCloudDataAndInit();
          }
        },
      });

      // STARTUP SYNC
      if (accessToken && get(isSyncEnabled)) {
        startAutoSync();
        performStartupSync();
      }
    };
    document.body.appendChild(script);
  }
}

function startAutoSync() {
    stopAutoSync();
    autoSyncTimer = setInterval(() => {
        console.log("Auto-sync trigger...");
        performSync();
    }, AUTO_SYNC_INTERVAL_MS);
}

function stopAutoSync() {
    if (autoSyncTimer) clearInterval(autoSyncTimer);
}

export function login() {
  if (tokenClient) {
    if (loadToken()) performSync();
    else tokenClient.requestAccessToken();
  }
}

export function logout() {
  stopAutoSync();
  clearToken();
  userEmail.set("");
  isSyncEnabled.set(false);
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
async function listAllSyncedFiles(): Promise<Record<string, { id: string }>> {
  if (!accessToken) return {};
  const query = `trashed = false and 'appDataFolder' in parents`;
  const url = `${DRIVE_API}?q=${encodeURIComponent(query)}&fields=files(id, name)&spaces=appDataFolder`;
  const response = await fetch(url, { headers: { 'Authorization': `Bearer ${accessToken}` } });
  const data = await response.json();
  
  if (data.files) {
      return data.files.reduce((acc: any, f: any) => {
          acc[f.name] = { id: f.id };
          return acc;
      }, {});
  }
  return {};
}

async function downloadFile(fileId: string) {
  const response = await fetch(`${DRIVE_API}/${fileId}?alt=media`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return await response.json();
}

async function uploadFile(filename: string, content: any, fileId: string | null = null) {
  const metadata = { name: filename, mimeType: 'application/json', parents: fileId ? [] : ['appDataFolder'] };
  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', new Blob([JSON.stringify(content)], { type: 'application/json' }));
  const url = fileId ? `${UPLOAD_API}/${fileId}?uploadType=multipart` : `${UPLOAD_API}?uploadType=multipart`;
  const method = fileId ? 'PATCH' : 'POST';
  await fetch(url, { method, headers: { 'Authorization': `Bearer ${accessToken}` }, body: formData });
}

async function deleteFile(fileId: string) {
    await fetch(`${DRIVE_API}/${fileId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${accessToken}` } });
}

// --- Sync Logic ---

// 1. Startup Logic

async function performStartupSync() {
    if (!accessToken) { initialSyncComplete.set(true); return; }
    syncStatus.set("syncing");
    console.log("Performing Startup Sync...");

    try {
        const remoteFiles = await listAllSyncedFiles();
        
        for (let i = 1; i <= NUM_SLOTS; i++) {
            const slotKey = `sd-character-sheet-slot-${i}`;
            const metaKey = `${slotKey}-meta`;
            const filename = `shadowdark_slot_${i}.json`;
            
            // 1. Get Local State directly from storage (Store is not active yet)
            const localData = await asyncLocalStorage.getItem(slotKey);
            const localMeta = await asyncLocalStorage.getItem(metaKey);
            const localTS = localMeta ? parseInt(localMeta, 10) : 0;
            
            const remoteFile = remoteFiles[filename];

            // 2. Smart Resolve
            if (remoteFile) {
                // We have a remote file. Check if we need it.
                // Note: To be 100% safe, we usually need to download to get the true remote TS, 
                // but for startup speed we can optimize or just download. 
                // Let's just download to be safe (it's only 10 small text files max).
                const remoteContent = await downloadFile(remoteFile.id);
                const remoteTS = remoteContent.ts || 0;

                if (remoteTS > localTS) {
                    console.log(`[Startup] Downloading Slot ${i}`);
                    await savePlayerToLocalStorage(remoteContent.value, i);
                    await asyncLocalStorage.setItem(metaKey, remoteTS.toString());
                    
                    // If active slot, update store
                    if (get(CurrentSaveSlot) === i) {
                        PlayerCharacterStore.set(remoteContent.value);
                    }
                } else if (localTS > remoteTS) {
                    console.log(`[Startup] Local change detected in Slot ${i}. Uploading...`);
                    // We upload immediately so the cloud is current
                    const payload = { value: JSON.parse(localData!), ts: localTS };
                    await uploadFile(filename, payload, remoteFile.id);
                }
            }
            else if (localData && !remoteFile) {
                 console.log(`[Startup] New local file in Slot ${i}. Uploading...`);
                 const payload = { value: JSON.parse(localData), ts: localTS || Date.now() };
                 await uploadFile(filename, payload);
            }
        }
    } catch (e) {
        console.error("Startup Sync Failed", e);
    } finally {
        syncStatus.set("idle");
        initialSyncComplete.set(true); // Release the "Loading" screen
    }
}

// 2. Standard Sync
export async function updateLocalTimestamp(slot: number) {
  if (!get(isSyncEnabled) || !get(initialSyncComplete)) return;
  await asyncLocalStorage.setItem(`sd-character-sheet-slot-${slot}-meta`, Date.now().toString());
  debouncedSync();
}

function debouncedSync() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => performSync(), 2000);
}

// Helper for Manual Sync Button
export function forceSync() {
    performSync();
}

export async function performSync() {
  if (isSyncing || !accessToken) return;
  if (!loadToken()) { syncStatus.set("paused"); return; }

  isSyncing = true;
  syncStatus.set("syncing");

  try {
    const remoteFiles = await listAllSyncedFiles();

    for (let i = 1; i <= NUM_SLOTS; i++) {
        const slotKey = `sd-character-sheet-slot-${i}`;
        const metaKey = `${slotKey}-meta`;
        const filename = `shadowdark_slot_${i}.json`;
        
        const localData = await asyncLocalStorage.getItem(slotKey);
        const localMeta = await asyncLocalStorage.getItem(metaKey);
        const localTS = localMeta ? parseInt(localMeta, 10) : 0;
        const remoteFile = remoteFiles[filename];

        if (localData && remoteFile) {
            const remoteContent = await downloadFile(remoteFile.id);
            const remoteTS = remoteContent.ts || 0;

            if (remoteTS > localTS) {
                await savePlayerToLocalStorage(remoteContent.value, i);
                await asyncLocalStorage.setItem(metaKey, remoteTS.toString());
                if (get(CurrentSaveSlot) === i) PlayerCharacterStore.set(remoteContent.value);
            } else if (localTS > remoteTS) {
                const payload = { value: JSON.parse(localData), ts: localTS };
                await uploadFile(filename, payload, remoteFile.id);
            }
        }
        else if (localData && !remoteFile) {
            const payload = { value: JSON.parse(localData), ts: localTS || Date.now() };
            await uploadFile(filename, payload);
        }
        else if (!localData && remoteFile) {
            const remoteContent = await downloadFile(remoteFile.id);
            await savePlayerToLocalStorage(remoteContent.value, i);
            await asyncLocalStorage.setItem(metaKey, (remoteContent.ts || 0).toString());
            if (get(CurrentSaveSlot) === i) PlayerCharacterStore.set(remoteContent.value);
        }
    }
    syncStatus.set("idle");
  } catch (e) {
    console.error("Sync Error:", e);
    syncStatus.set("error");
  } finally {
    isSyncing = false;
  }
}

// 3. Conflict / Force Logic (unchanged logic, just ensuring exports)
async function checkForCloudDataAndInit() {
    syncStatus.set("syncing");
    const files = await listAllSyncedFiles();
    if (Object.keys(files).length > 0) {
        syncStatus.set("paused");
        showConflictModal.set(true);
    } else {
        await forceUploadAll();
    }
}

export async function forceUploadAll() {
    syncStatus.set("syncing");
    try {
        const remoteFiles = await listAllSyncedFiles();
        for (let i = 1; i <= NUM_SLOTS; i++) {
            const key = `sd-character-sheet-slot-${i}`;
            const localJson = await asyncLocalStorage.getItem(key);
            if (localJson) {
                const pc = JSON.parse(localJson);
                const ts = Date.now();
                const payload = { value: pc, ts: ts };
                const filename = `shadowdark_slot_${i}.json`;
                const remote = remoteFiles[filename];
                await uploadFile(filename, payload, remote ? remote.id : null);
                await asyncLocalStorage.setItem(`${key}-meta`, ts.toString());
            }
        }
        showConflictModal.set(false);
        performSync();
    } catch(e) { syncStatus.set("error"); }
}

export async function forceDownloadAll() {
    syncStatus.set("syncing");
    try {
        const remoteFiles = await listAllSyncedFiles();
        for (let i = 1; i <= NUM_SLOTS; i++) {
            const filename = `shadowdark_slot_${i}.json`;
            const remote = remoteFiles[filename];
            const localKey = `sd-character-sheet-slot-${i}`;

            if (remote) {
                const data = await downloadFile(remote.id);
                await savePlayerToLocalStorage(data.value, i);
                await asyncLocalStorage.setItem(`${localKey}-meta`, (data.ts || 0).toString());
                if (get(CurrentSaveSlot) === i) PlayerCharacterStore.set(data.value);
            } else {
                await asyncLocalStorage.removeItem(localKey);
                await asyncLocalStorage.removeItem(`${localKey}-meta`);
            }
        }
        showConflictModal.set(false);
        performSync();
    } catch (e) { syncStatus.set("error"); }
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