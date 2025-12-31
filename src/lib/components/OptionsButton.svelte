<script lang="ts">
  import savePlayerToFile from "../services/FileSaver";
  import { clearLocalStorage } from "../services/LocalStorageSaver";
  import { defaultPC, PlayerCharacterStore as pc } from "../model/PlayerCharacter";
  import Modal from "./Modal.svelte";
  import { CurrentSaveSlot, NUM_SLOTS } from "../services/SaveSlotTracker";
  import OBR from "@owlbear-rodeo/sdk";
  import { Settings } from "../services/SettingsTracker";
  import { isGM, isTrackedPlayerGM } from "../services/OBRHelper";

  // --- SYNC IMPORTS ---
  // FIX: Import from SyncManager
  import { isSyncEnabled, userEmail, showDeleteConfirmationModal, syncProviderName } from "../services/SyncManager";
  import { tick } from "svelte";
  // --------------------

  export let files: FileList | undefined;
  let showModal = false;
  let showSyncSettingsModal = false;

  $: isSheetReadOnly = $isGM && !$isTrackedPlayerGM;

  async function handleSyncSettingsClick() {
    console.log("handleSyncSettingsClick", $isSyncEnabled);
    showModal = false;
    await tick();
    showSyncSettingsModal = true;
    console.log("showSyncSettingsModal set to true");
  }

  function handleDisableSync() {
    logout();
    showSyncSettingsModal = false;
  }

  function handleDeleteSync() {
    showDeleteConfirmationModal.set(true);
    showSyncSettingsModal = false;
  }
</script>

<button class="bg-black text-white rounded-md px-1 text-xs" on:click={() => (showModal = true)}>
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
          <input class="w-16 text-right" id="notificationDuration" type="number" inputmode="numeric" bind:value={$Settings.popoverDuration} min="0" />
          <div>seconds</div>
        </div>
      </label>
    {/if}
    <label for="jsonImport" class={isSheetReadOnly ? "btn-disabled" : "btn"}>
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
    <a class="btn" href="https://github.com/maxpaulus43/owlbear-shadowdark-character-sheet/issues/new" target="_blank">Report Issue</a>

    {#if !isSheetReadOnly}
      <div class="mt-2 border-t border-gray-500 pt-2 font-bold">Advanced Options</div>

      {#if $isSyncEnabled}
        <button on:click={handleSyncSettingsClick}>
          Sync Settings ({$userEmail})
        </button>
      {:else}
        <button on:click={requestSetup}> Set up Cloud Sync </button>
      {/if}

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

{#if showSyncSettingsModal}
  <Modal on:close={() => (showSyncSettingsModal = false)}>
    <h1 slot="header">Sync Settings</h1>
    <div class="flex flex-col gap-2 min-w-[250px] p-2" id="sync-options">
      <p class="text-sm text-center mb-2">
        Syncing with <b>{$syncProviderName}</b> as <br /><b>{$userEmail}</b>
      </p>

      <button on:click={handleDisableSync}> Disable Sync </button>

      <button class="bg-red-800 hover:bg-red-700" on:click={handleDeleteSync}> Disable Sync & Delete Cloud Data </button>

      <button class="bg-gray-500 hover:bg-gray-600 mt-2" on:click={() => (showSyncSettingsModal = false)}> Cancel </button>
    </div>
  </Modal>
{/if}

<style lang="postcss">
  button,
  .btn {
    @apply bg-black text-white px-1 rounded-md hover:scale-105 transition active:opacity-50 text-center cursor-pointer;
  }

  .btn-disabled {
    @apply bg-black text-white px-1 rounded-md text-center opacity-30 cursor-default hover:scale-100;
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
  #sync-options button {
    @apply transition active:opacity-50 cursor-pointer shadow-sm p-2;
  }
  #sync-options button.bg-red-800 {
    background-color: #991b1b;
  }
  #sync-options button.bg-gray-500 {
    background-color: #6b7280;
  }
</style>
