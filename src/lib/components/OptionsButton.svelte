<script lang="ts">
  import savePlayerToFile from "../services/FileSaver";
  import { clearLocalStorage } from "../services/LocalStorageSaver";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";
  import Modal from "./Modal.svelte";
  export let files: FileList;
  let showModal = false;
</script>

<button
  class="bg-black text-white rounded-md px-1 text-xs"
  on:click={() => (showModal = true)}
  ><i class="material-icons translate-y-[1px]">settings</i></button
>

<Modal bind:showModal>
  <h1 slot="header">Options</h1>
  <div class="flex flex-col gap-1 min-w-[200px]">
    <label for="jsonImport" class="btn">
      <div class="text-center">Import JSON</div>
      <input
        id="jsonImport"
        type="file"
        class="hidden"
        accept="application/json"
        bind:files
      />
    </label>
    <button
      class="btn"
      on:click={() => {
        savePlayerToFile($pc);
      }}>Export JSON</button
    >
    <button
      class="btn"
      on:click={() => {
        clearLocalStorage();
      }}>Clear Storage (Proceed with caution)</button
    >
    <a
      class="btn"
      href="https://github.com/maxpaulus43/owlbear-shadowdark-character-sheet/issues/new"
      target="_blank">Report Issue</a
    >
  </div>
</Modal>

<style lang="postcss">
  .btn {
    @apply bg-black text-white p-2 rounded-md hover:scale-105 transition active:opacity-50 text-center;
  }
</style>
