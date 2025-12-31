<script lang="ts">
  // FIX: Import from the new SyncManager, not GoogleDriveSync
  import { isSyncEnabled, syncStatus, login, forceSync } from "../services/SyncManager";

  function handleClick() {
    if (!$isSyncEnabled) {
      // Not Configured -> Start Auth / Setup
      login();
    } else if ($syncStatus === "error") {
      // Error (Offline/Expired) -> Reconnect
      login();
    } else {
      // Healthy -> Force Sync
      forceSync();
    }
  }
</script>

<button
  on:click={handleClick}
  class="text-white rounded-md px-1 text-xs transition-colors"
  class:bg-black={!$isSyncEnabled}
  class:bg-green-600={$isSyncEnabled && $syncStatus !== "error"}
  class:bg-red-600={$isSyncEnabled && $syncStatus === "error"}
  title={$isSyncEnabled ? ($syncStatus === "error" ? "Sync Error / Offline (Click to Reconnect)" : "Force Sync") : "Enable Sync"}
>
  {#if $isSyncEnabled && $syncStatus === "error"}
    <i class="material-icons translate-y-[1px]">warning</i>
  {:else}
    <i class="material-icons translate-y-[1px]" class:animate-spin={$syncStatus === "syncing"}>sync</i>
  {/if}
</button>