<script lang="ts">
  import { showReauthModal, showConnectionErrorModal, showOfflineConfirmationModal, showConflictModal, conflictedSlots, resolveConflict, syncMessage, login, enableOfflineMode, logout, showDeleteConfirmationModal, deleteCloudDataAndLogout } from "../services/SyncManager";
  import Modal from "./Modal.svelte";
  import SyncSetupModal from "./SyncSetupModal.svelte";

  function closeConflictModal() {
    showConflictModal.set(false);
    logout();
  }

  function confirmDelete() {
    deleteCloudDataAndLogout();
    showDeleteConfirmationModal.set(false);
  }
</script>

{#if $showDeleteConfirmationModal}
  <Modal on:close={() => showDeleteConfirmationModal.set(false)}>
    <div class="bg-neutral-900 text-gray-200 p-4 border border-gray-700 rounded shadow-2xl">
      <h1 slot="header" class="text-2xl mb-2 font-bold text-red-500 border-b border-gray-700 pb-1">DARE YOU PROCEED?</h1>
      <div class="flex flex-col gap-4 max-w-xs">
        <p class="font-bold">This will permanently delete your character data from the cloud.</p>
        <p class="text-sm">Your local data will be safe, but you will need to re-sync. Are you sure?</p>
        <div class="flex flex-col gap-2">
          <button class="bg-red-800 text-white p-2 rounded hover:bg-red-700 transition font-bold border border-red-600" on:click={confirmDelete}>DELETE CLOUD DATA</button>
          <button class="bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition border border-gray-600" on:click={() => showDeleteConfirmationModal.set(false)}>Cancel</button>
        </div>
      </div>
    </div>
  </Modal>
{/if}

{#if $syncMessage}
  <div class="fixed bottom-4 right-4 bg-neutral-900 border border-gray-700 text-white px-3 py-2 rounded shadow-lg text-xs flex items-center gap-2 z-50 opacity-90 font-serif tracking-wider">
    <i class="material-icons text-xs animate-spin">sync</i>
    <span>{$syncMessage}</span>
  </div>
{/if}

<SyncSetupModal />

{#if $showReauthModal}
  <Modal on:close={enableOfflineMode}>
    <div class="bg-neutral-900 text-gray-200 p-4 border border-gray-700 rounded shadow-2xl">
      <h1 slot="header" class="text-2xl mb-2 font-bold text-white border-b border-gray-700 pb-1">Authentication Required</h1>
      <div class="flex flex-col gap-4 max-w-xs">
        <p>Your sync session has expired or requires a login to continue.</p>
        <div class="flex flex-col gap-2">
          <button class="bg-blue-700 text-white p-2 rounded hover:bg-blue-600 transition font-bold" on:click={login}>Login / Re-authenticate</button>
          <button class="bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition" on:click={enableOfflineMode}>Work Offline</button>
        </div>
      </div>
    </div>
  </Modal>
{/if}

{#if $showConnectionErrorModal}
  <Modal on:close={enableOfflineMode}>
    <div class="bg-neutral-900 text-gray-200 p-4 border border-gray-700 rounded shadow-2xl">
      <h1 slot="header" class="text-2xl mb-2 font-bold text-white border-b border-gray-700 pb-1">Connection Failed</h1>
      <div class="flex flex-col gap-4 max-w-xs">
        <p>Synchronization failed due to a bad connection. You can continue to work offline and sync later.</p>
        <button class="bg-gray-700 text-white p-2 rounded hover:bg-gray-600 transition" on:click={enableOfflineMode}>Work Offline</button>
      </div>
    </div>
  </Modal>
{/if}

{#if $showOfflineConfirmationModal}
  <Modal on:close={() => showOfflineConfirmationModal.set(false)}>
    <div class="bg-neutral-900 text-gray-200 p-4 border border-gray-700 rounded shadow-2xl">
      <h1 slot="header" class="text-2xl mb-2 font-bold text-white border-b border-gray-700 pb-1">Offline Mode</h1>
      <div class="flex flex-col gap-4 max-w-xs">
        <p>You are now working offline. The app will automatically try to reconnect in the background periodically.</p>
        <button class="bg-black border border-gray-600 text-white p-2 rounded hover:bg-gray-800 transition" on:click={() => showOfflineConfirmationModal.set(false)}>OK</button>
      </div>
    </div>
  </Modal>
{/if}

{#if $showConflictModal}
  <Modal on:close={closeConflictModal}>
    <div class="bg-neutral-900 text-gray-200 p-4 border border-gray-700 rounded shadow-2xl">
      <h1 slot="header" class="text-2xl mb-2 font-bold text-white border-b border-gray-700 pb-1">Sync Conflicts</h1>
      <div class="flex flex-col gap-3 min-w-[300px] overflow-y-auto max-h-[80vh]">
        <p class="text-sm">The following slots have changed on both this device and the cloud since you last synced.</p>

        <div class="flex flex-col gap-2 mt-2">
          {#each $conflictedSlots as conflict}
            <div class="border border-gray-600 p-2 rounded bg-black flex flex-col gap-2">
              <div class="font-bold text-white">Slot {conflict.slot}</div>
              <div class="text-xs text-gray-400 flex justify-between">
                <span>Local: {conflict.localDate.toLocaleTimeString()}</span>
                <span>Cloud: {conflict.remoteDate.toLocaleTimeString()}</span>
              </div>
              <div class="flex gap-2 justify-between">
                <button class="bg-blue-800 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 flex-1 border border-blue-600" on:click={() => resolveConflict(conflict.slot, "local")}> Keep Local (Overwrite Cloud) </button>
                <button class="bg-green-800 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex-1 border border-green-600" on:click={() => resolveConflict(conflict.slot, "remote")}> Keep Cloud (Overwrite Local) </button>
              </div>
            </div>
          {/each}
        </div>

        <p class="text-xs text-red-400 mt-2 font-bold text-center">There is no undo.</p>

        <button class="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 mt-2 border border-gray-600 transition" on:click={closeConflictModal}> Cancel & Work Offline (Export JSON First) </button>
      </div>
    </div>
  </Modal>
{/if}
