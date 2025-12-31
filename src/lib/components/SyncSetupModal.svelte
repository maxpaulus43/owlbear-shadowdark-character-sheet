<script lang="ts">
  import Modal from "./Modal.svelte";
  import { showSetupModal, selectProvider } from "../services/SyncManager";
</script>

{#if $showSetupModal}
  <Modal on:close={() => showSetupModal.set(false)} dialogClass="bg-neutral-900 text-gray-200 border border-gray-700 rounded shadow-2xl">
    <h1 slot="header" class="text-2xl mb-2 font-bold text-white border-b border-gray-700 pb-1">Set up Cloud Sync</h1>
    <div class="flex flex-col gap-4 p-2 min-w-[300px]">
      <p class="text-sm">Choose a provider to sync your characters across devices.</p>

      <button class="bg-blue-800 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition border border-blue-600" on:click={() => selectProvider("dropbox")}>
        <span class="font-bold">Dropbox</span> <span class="text-xs opacity-80">(Recommended)</span>
      </button>

      <button class="bg-gray-800 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-gray-700 transition border border-gray-600" on:click={() => selectProvider("google")}>
        <span>Google Drive</span>
      </button>

      <div class="text-xs text-gray-500 mt-2 text-center">Dropbox is recommended for better reliability and fewer login prompts.</div>
    </div>
  </Modal>
{/if}
