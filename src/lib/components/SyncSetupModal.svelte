<script lang="ts">
  import Modal from "./Modal.svelte";
  import { showSetupModal, selectProvider } from "../services/SyncManager";
</script>

{#if $showSetupModal}
  <Modal on:close={() => showSetupModal.set(false)}>
    <h1 slot="header">Set up Cloud Sync</h1>
    <div class="flex flex-col gap-4 p-4 min-w-[300px]">
      <p class="text-sm">Choose a provider to sync your characters across devices.</p>
      
      <button 
        class="bg-blue-600 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition"
        on:click={() => selectProvider("dropbox")}
      >
        <span class="font-bold">Dropbox</span> <span class="text-xs opacity-80">(Recommended)</span>
      </button>

      <button 
        class="bg-gray-800 text-white p-3 rounded flex items-center justify-center gap-2 hover:bg-gray-700 transition"
        on:click={() => selectProvider("google")}
      >
        <span>Google Drive</span>
      </button>

      <div class="text-xs text-gray-500 mt-2">
         Dropbox is recommended for better reliability and fewer login prompts.
      </div>
    </div>
  </Modal>
{/if}