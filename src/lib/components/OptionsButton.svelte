<script lang="ts">
  import savePlayerToFile from "../services/FileSaver";
  import { clearLocalStorage } from "../services/LocalStorageSaver";
  import {
    defaultPC,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import Modal from "./Modal.svelte";
  import { CurrentSaveSlot, NUM_SLOTS } from "../services/SaveSlotTracker";
  import { isGM } from "../services/OBRHelper";
  import OBR from "@owlbear-rodeo/sdk";
  import { Settings } from "../services/SettingsTracker";
  export let files: FileList | undefined;
  let showModal = false;
</script>

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
    <label for="jsonImport" class="btn">
      <div class="text-center">Import JSON</div>
      <input
        id="jsonImport"
        type="file"
        class="hidden"
        accept="application/json"
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
    <div>Advanced Options (Proceed with caution)</div>
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
  </div>
</Modal>

<style lang="postcss">
  button,
  .btn {
    @apply bg-black text-white px-1 rounded-md hover:scale-105 transition active:opacity-50 text-center;
  }

  .green {
    @apply bg-green-600;
  }

  #options button,
  #options .btn {
    @apply p-2;
  }
</style>
