<script lang="ts">
  import savePlayerToFile from "../services/FileSaver";
  import { clearLocalStorage } from "../services/LocalStorageSaver";
  import {
    defaultPC,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import Modal from "./Modal.svelte";
  import { CurrentSaveSlot, NUM_SLOTS } from "../services/SaveSlotTracker";
  import OBR from "@owlbear-rodeo/sdk";
  import { Settings } from "../services/SettingsTracker";
  import { isGM, isTrackedPlayerGM } from "../services/OBRHelper";
  
  // --- SYNC IMPORTS ---
import {
    isSyncEnabled,
    userEmail,
    syncStatus,
    showConflictModal,
    login,
    logout,
    deleteCloudDataAndLogout,
    forceUploadAll,
    forceDownloadAll,
    forceSync // <--- Import this
  } from "../services/GoogleDriveSync";
  // --------------------

  export let files: FileList | undefined;
  let showModal = false;
  let showSyncSettingsModal = false;

  $: isSheetReadOnly = $isGM && !$isTrackedPlayerGM;

  function handleSyncClick() {
    if ($isSyncEnabled) {
      showModal = false;
      showSyncSettingsModal = true;
    } else {
      login();
    }
  }

  function handleDisableSync() {
    logout();
    showSyncSettingsModal = false;
  }

  async function handleDeleteSync() {
    if (confirm("Are you sure? This will permanently delete your character data from Google Drive.")) {
      await deleteCloudDataAndLogout();
      showSyncSettingsModal = false;
    }
  }
</script>

{#if showSyncSettingsModal}
<Modal on:close={() => showSyncSettingsModal = false}>
  <h1 slot="header">Sync Settings</h1>
  <div class="flex flex-col gap-2 min-w-[250px] p-2" id="sync-options">
    <p class="text-sm text-center mb-2">
      You are currently syncing as <br/><b>{$userEmail}</b>
    </p>

    <button 
      class="bg-blue-700 hover:bg-blue-600 flex justify-center items-center gap-2" 
      on:click={forceSync}
    >
      <span>Sync Now</span>
      {#if $syncStatus === 'syncing'}
        <i class="material-icons text-sm animate-spin">refresh</i>
      {/if}
    </button>
    <button on:click={handleDisableSync}>
      Disable Sync
    </button>
    
    <button class="bg-red-800 hover:bg-red-700" on:click={handleDeleteSync}>
      Disable Sync & Delete Saved Data
    </button>

    <button class="bg-gray-500 hover:bg-gray-600 mt-2" on:click={() => showSyncSettingsModal = false}>
      Cancel
    </button>
  </div>
</Modal>
{/if}

<button
  class="bg-black text-white rounded-md px-1 text-xs"
  on:click={() => (showModal = true)}
>
  <i class="material-icons translate-y-[1px]">settings</i>
</button>

<Modal bind:showModal>
  <h1 slot="header">Options</h1>
  <div class="flex flex-col gap-1 min-w-[200px]" id="options">
    <div>
      <h2>Choose Save Slot</h2>
      <div class="flex gap-1 w-full justify-stretch">
        {#each { length: NUM_SLOTS } as _, i}
          <button
            class:green={$CurrentSaveSlot === i + 1}
            on:click={() => {
              $CurrentSaveSlot = i + 1;
            }}>{i + 1}</button
          >
        {/each}
      </div>
    </div>
    {#if OBR.isAvailable}
      <label for="notificationDuration">
        <div class="flex flex-row gap-1 items-center">
          <div>Notification Duration:</div>
          <input
            class="w-16 text-right"
            id="notificationDuration"
            type="number"
            inputmode="numeric"
            bind:value={$Settings.popoverDuration}
            min="0"
          />
          <div>seconds</div>
        </div>
      </label>
    {/if}
    <label for="jsonImport" class={isSheetReadOnly ? 'btn-disabled' : 'btn'}>
      <div class="text-center">Import JSON</div>
      <input
        id="jsonImport"
        type="file"
        class="hidden"
        accept="application/json"
        disabled={isSheetReadOnly}
        bind:files
        on:click={(e) => {
          e.currentTarget.value = "";
          files = undefined;
        }}
      />
    </label>
    <button
      on:click={() => {
        savePlayerToFile($pc);
      }}>Export JSON</button
    >
    <a
      class="btn"
      href="https://github.com/maxpaulus43/owlbear-shadowdark-character-sheet/issues/new"
      target="_blank">Report Issue</a
    >
    
    {#if !isSheetReadOnly}
      <div class="mt-2 border-t border-gray-500 pt-2 font-bold">Advanced Options</div>
      
      <button 
        on:click={handleSyncClick}
        class:green={$isSyncEnabled}
        class="flex items-center justify-center gap-2"
      >
        {#if $isSyncEnabled}
          <span class="truncate max-w-[200px]">Syncing ({$userEmail})</span>
          {#if $syncStatus === 'syncing'}
            <i class="material-icons text-sm animate-spin">refresh</i>
          {/if}
        {:else}
          Enable Google Sync
        {/if}
      </button>

      <button
        on:click={() => {
          $pc = defaultPC();
        }}>Clear Current Save Slot</button
      >
      <button
        on:click={() => {
          $pc = defaultPC();
          clearLocalStorage();
        }}>Clear Storage (Proceed with caution)</button
      >
    {/if}
  </div>
</Modal>

{#if $showConflictModal}
<Modal on:close={() => { showConflictModal.set(false); logout(); }}>
    <h1 slot="header">Sync Conflict</h1>
    <div class="flex flex-col gap-4 max-w-sm" id="sync-conflict">
        <p>There is already saved data online.</p>
        <p class="text-sm">
            You can <b>Save Current Characters</b>, which will overwrite your current online data. 
            Or you can <b>Restore from Online</b>, which will delete your current characters.
        </p>
        <p class="text-sm font-bold text-red-800">
            There is no undo. You may want to cancel and export your JSON first.
        </p>
        
        <button class="bg-blue-700 text-white p-2 rounded" on:click={forceUploadAll}>
            Save Current Characters (Overwrite Cloud)
        </button>
        
        <button class="bg-green-700 text-white p-2 rounded" on:click={forceDownloadAll}>
            Restore from Online (Overwrite Local)
        </button>

        <button class="bg-gray-500 text-white p-2 rounded" on:click={() => { showConflictModal.set(false); logout(); }}>
            Cancel
        </button>
    </div>
</Modal>
{/if}

{#if showSyncSettingsModal}
<Modal on:close={() => showSyncSettingsModal = false}>
  <h1 slot="header">Sync Settings</h1>
  <div class="flex flex-col gap-2 min-w-[250px] p-2" id="sync-options">
    <p class="text-sm text-center mb-2">
      You are currently syncing as <br/><b>{$userEmail}</b>
    </p>

    <button on:click={handleDisableSync}>
      Disable Sync
    </button>
    
    <button class="bg-red-800 hover:bg-red-700" on:click={handleDeleteSync}>
      Disable Sync & Delete Saved Data
    </button>

    <button class="bg-gray-500 hover:bg-gray-600 mt-2" on:click={() => showSyncSettingsModal = false}>
      Cancel
    </button>
  </div>
</Modal>
{/if}

<style lang="postcss">
  button,
  .btn {
    @apply bg-black text-white px-1 rounded-md hover:scale-105 transition active:opacity-50 text-center cursor-pointer;
  }

  .btn-disabled {
    @apply  bg-black text-white px-1 rounded-md text-center opacity-30 cursor-default hover:scale-100;
  }

  .green {
    @apply bg-green-600;
  }

  #options button,
  #options .btn,
  #options .btn-disabled {
    @apply p-2;
  }
  
  /* Modal styling */
  #sync-options button, #sync-conflict button {
     @apply transition active:opacity-50 cursor-pointer shadow-sm;
  }
  #sync-conflict button {
      @apply hover:scale-105;
  }
  #sync-options button.bg-red-800 { background-color: #991b1b; }
  #sync-options button.bg-gray-500 { background-color: #6b7280; }
</style>