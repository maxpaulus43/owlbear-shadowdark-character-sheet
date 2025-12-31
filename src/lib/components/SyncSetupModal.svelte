<script lang="ts">
  import Modal from "./Modal.svelte";
  import { showSetupModal, selectProvider } from "../services/SyncManager";
</script>

{#if $showSetupModal}
  <Modal on:close={() => showSetupModal.set(false)} dialogClass="bg-neutral-900 text-gray-200 border border-gray-700 rounded shadow-2xl">
    <h1 slot="header" class="text-2xl mb-2 font-bold text-white border-b border-gray-700 pb-1">Set up Cloud Sync</h1>
    <div class="flex flex-col gap-4 p-2 min-w-[300px]">
      <p class="text-sm">Choose a provider to sync your characters across devices.</p>

      <button class="bg-[#0061FE] text-white p-3 rounded flex items-center justify-center gap-2 hover:opacity-90 transition border border-blue-600" on:click={() => selectProvider("dropbox")}>
        <span class="font-bold">Dropbox</span> <span class="text-xs opacity-80">(Recommended)</span>
      </button>

      <button class="bg-[#4285F4] text-white p-3 rounded flex items-center justify-center gap-2 hover:opacity-90 transition border border-blue-400" on:click={() => selectProvider("google")}>
        <span class="font-bold">Google Drive</span>
      </button>
    </div>
  </Modal>
{/if}
