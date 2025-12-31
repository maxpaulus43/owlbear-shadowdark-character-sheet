<script lang="ts">
  // FIX: Import from the new SyncManager, not GoogleDriveSync
  import { isSyncEnabled, syncStatus, forceSync, requestSetup } from "../services/SyncManager";

  function handleClick() {
    if (!$isSyncEnabled) {
      // Not Configured -> Open Setup Dialog
      requestSetup();
    } else {
      // Enabled (even if error) -> Attempt to Sync
      // SyncManager will handle errors (offline, auth, etc) and show modals if needed
      forceSync();
    }
  }
</script>

<button on:click={handleClick} class="text-white rounded-md px-1 text-xs transition-colors" class:bg-black={!$isSyncEnabled} class:bg-green-600={$isSyncEnabled && $syncStatus !== "error"} class:bg-red-600={$isSyncEnabled && $syncStatus === "error"} title={$isSyncEnabled ? ($syncStatus === "error" ? "Sync Error / Offline (Click to Reconnect)" : "Force Sync") : "Enable Sync"}>
  {#if $isSyncEnabled && $syncStatus === "error"}
    <i class="material-icons translate-y-[1px]">warning</i>
  {:else}
    <i class="material-icons translate-y-[1px]" class:animate-spin={$syncStatus === "syncing"}>sync</i>
  {/if}
</button>
