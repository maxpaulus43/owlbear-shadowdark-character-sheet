// src/lib/services/GoogleDriveSync.ts
import { get } from "svelte/store";
import { PlayerCharacterStore } from "../model/PlayerCharacter";

// Remove the old combined import line and replace with these two:
import { asyncLocalStorage, savePlayerToLocalStorage } from "./LocalStorageSaver";
import { CurrentSaveSlot } from "./SaveSlotTracker"; 

import type { PlayerCharacter } from "../types";
// Configuration
const CLIENT_ID = '662108188914-skvn3so90q67jfqssnd0lfb3j9tvftm2.apps.googleusercontent.com'; // You need to generate this in Google Cloud Console
const API_KEY = 'YOUR_GOOGLE_API_KEY'; // Optional, but recommended for discovery docs
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';

// State
let tokenClient: any;
let accessToken: string | null = null;
let isSyncing = false;

// --- Helper: Timestamp Management ---
// We store a separate timestamp key so we don't pollute the Character JSON
async function getLocalTimestamp(slot: number): Promise<number> {
  const meta = await asyncLocalStorage.getItem(`sd-character-sheet-slot-${slot}-meta`);
  return meta ? parseInt(meta, 10) : 0;
}

export async function updateLocalTimestamp(slot: number) {
  await asyncLocalStorage.setItem(`sd-character-sheet-slot-${slot}-meta`, Date.now().toString());
  // Trigger a sync check (debounced)
  debouncedSync();
}

// --- Auth ---
export function initGoogleAuth() {
  // Load the Google Script dynamically if not present
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
        callback: (response: any) => {
          if (response.access_token) {
            accessToken = response.access_token;
            console.log("Google Auth Success");
            performSync(); // Sync immediately on login
          }
        },
      });
    };
    document.body.appendChild(script);
  }
}

export function login() {
  if (tokenClient) {
    tokenClient.requestAccessToken();
  } else {
    console.error("Google Identity Services not loaded yet.");
  }
}

// --- Drive API (Adapted from your background.js) ---
const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';

async function listSyncedFile(filename: string) {
  if (!accessToken) return null;
  const query = `name = '${filename}' and trashed = false and 'appDataFolder' in parents`;
  const url = `${DRIVE_API}?q=${encodeURIComponent(query)}&fields=files(id, name, modifiedTime)&spaces=appDataFolder`;

  const response = await fetch(url, { headers: { 'Authorization': `Bearer ${accessToken}` } });
  const data = await response.json();
  return data.files && data.files.length > 0 ? data.files[0] : null;
}

async function downloadFileContent(fileId: string) {
  const response = await fetch(`${DRIVE_API}/${fileId}?alt=media`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return await response.json();
}

async function uploadFile(filename: string, content: any, fileId: string | null = null) {
  const metadata = {
    name: filename,
    mimeType: 'application/json',
    parents: fileId ? [] : ['appDataFolder']
  };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', new Blob([JSON.stringify(content)], { type: 'application/json' }));

  const url = fileId 
    ? `${UPLOAD_API}/${fileId}?uploadType=multipart` 
    : `${UPLOAD_API}?uploadType=multipart`;
  
  const method = fileId ? 'PATCH' : 'POST';

  await fetch(url, {
    method: method,
    headers: { 'Authorization': `Bearer ${accessToken}` },
    body: formData
  });
}

// --- Sync Logic (The "Brain") ---
let debounceTimer: any;
function debouncedSync() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => performSync(), 2000);
}

export async function performSync() {
  if (!accessToken || isSyncing) return;
  isSyncing = true;
  console.log("Starting Sync...");

  try {
    const currentSlot = get(CurrentSaveSlot);
    const filename = `shadowdark_slot_${currentSlot}.json`;
    
    // 1. Get Local State
    const localPC = get(PlayerCharacterStore);
    const localTS = await getLocalTimestamp(currentSlot);

    // 2. Get Remote State
    const remoteFile = await listSyncedFile(filename);
    let remoteDataWrapper = null;
    let remoteTS = 0;

    if (remoteFile) {
      remoteDataWrapper = await downloadFileContent(remoteFile.id);
      remoteTS = remoteDataWrapper.ts || 0;
    }

    // 3. Compare & Resolve
    // Case A: Remote is newer -> Download & Overwrite Local
    if (remoteTS > localTS) {
      console.log("Remote is newer. Downloading...");
      const newPC = remoteDataWrapper.value as PlayerCharacter;
      
      // Update LocalStorage (Data + TS)
      await savePlayerToLocalStorage(newPC, currentSlot);
      await asyncLocalStorage.setItem(`sd-character-sheet-slot-${currentSlot}-meta`, remoteTS.toString());
      
      // Update Svelte Store to reflect changes in UI
      PlayerCharacterStore.set(newPC); 
    } 
    // Case B: Local is newer -> Upload to Cloud
    else if (localTS > remoteTS) {
      console.log("Local is newer. Uploading...");
      const payload = { value: localPC, ts: localTS };
      await uploadFile(filename, payload, remoteFile ? remoteFile.id : null);
    }
    else {
      console.log("Sync in sync.");
    }
  } catch (e) {
    console.error("Sync Error:", e);
  } finally {
    isSyncing = false;
  }
}