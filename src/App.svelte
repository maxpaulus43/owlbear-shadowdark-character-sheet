<script lang="ts">
  import {
    calculateTitleForPlayer,
    levelUpPlayer,
    PlayerCharacterStore as pc,
  } from "./lib/model/PlayerCharacter";
  import { ALIGNMENTS } from "./lib/constants";
  import TalentsSpellsView from "./lib/components/talents/TalentsSpellsView.svelte";
  import StatView from "./lib/components/StatView.svelte";
  import GearView from "./lib/components/gear/GearView.svelte";
  import AttacksView from "./lib/components/AttacksView.svelte";
  import { importFromJson } from "./lib/services/JSONImporter";
  import HpView from "./lib/components/HPView.svelte";
  import InfoButton from "./lib/components/InfoButton.svelte";
  import OptionsButton from "./lib/components/OptionsButton.svelte";
  import { setCustomGearForPlayer } from "./lib/compendium";
  import ClassView from "./lib/components/ClassView.svelte";
  import ArmorClassView from "./lib/components/ArmorClassView.svelte";
  import NotesButton from "./lib/components/NotesButton.svelte";
  import PlayersView from "./lib/components/PlayersView.svelte";
  import { onMount } from "svelte";
  import * as OBRHelper from "./lib/services/OBRHelper";
  import * as LocalStorageSaver from "./lib/services/LocalStorageSaver";
  import OBR from "@owlbear-rodeo/sdk";
  import AncestryView from "./lib/components/AncestryView.svelte";
  import { isSaveInProgress } from "./lib/services/LocalStorageSaver";
  import NotificationsButton from "./lib/components/NotificationsButton.svelte";
  import { initSettings } from "./lib/services/SettingsTracker";
  import Modal from "./lib/components/Modal.svelte"; 
  
  // --- SYNC IMPORTS ---
  import { 
    initSync,              
    initialSyncComplete, 
    showReauthModal, 
    showConnectionErrorModal,
    showOfflineConfirmationModal,
    showConflictModal,
    conflictedSlots, 
    resolveConflict, 
    syncMessage,     
    login, 
    enableOfflineMode,
    logout
  } from "./lib/services/SyncManager";
  import SyncButton from "./lib/components/SyncButton.svelte"; 
  import SyncSetupModal from "./lib/components/SyncSetupModal.svelte";
  // --------------------

  const { isGM } = OBRHelper;

  onMount(() => {
    initSettings();
    if (OBR.isAvailable) {
      OBRHelper.init();
    } else {
      initSync(); 
    }
  });

  $: if (!OBR.isAvailable && $initialSyncComplete) {
    LocalStorageSaver.init();
  }

  $: setCustomGearForPlayer($pc);

  $: title = calculateTitleForPlayer($pc);
  $: xpCap = $pc.level === 0 ? 10 : $pc.level * 10;
  $: canLevel = $pc.level < 10 && $pc.xp >= xpCap;
  const { canUndo, canRedo } = pc;

  let files: FileList;
  $: if (files) {
    for (const file of files) {
      file.text().then((txt) => {
        $pc = importFromJson(txt);
      });
      files = undefined;
      break;
    }
  }

  function onTitleInput(e: Event) {
    $pc.title = (e.target as HTMLInputElement).value;
  }
</script>

{#if !OBR.isAvailable && !$initialSyncComplete}
  <div class="h-screen w-screen flex flex-col items-center justify-center bg-gray-50 gap-4 fixed inset-0 z-50">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    <div class="text-xl font-bold text-gray-700">Loading Synced Characters...</div>
  </div>
{:else}
  <div class="flex items-center justify-center bg-black">
    <main>
       <div id="sheet" class="bg-black min-w-[277px] max-w-[1000px] p-2 flex flex-wrap gap-2">
         
         <div class="flex-[2] min-w-[257px] h-auto min-[805px]:h-[700px] grid grid-rows-8 grid-cols-2 gap-2">
           <div class="col-span-full cell">
              <div class="flex gap-1 justify-around">
                 <div class="flex flex-col items-center">
                   <div class="flex items-center gap-1">
                     <h1>Shadowdark</h1>
                     <InfoButton />
                   </div>
                   {#if $isSaveInProgress}
                     <div class="absolute top-0 left-0 opacity-20 bg-black text-white p-1 rounded-md flex items-center">
                       <i class="material-icons">save</i>...
                     </div>
                   {/if}
                   <div class="-translate-y-2 flex gap-1">
                     {#if !$isGM}
                        <button on:click={() => pc.undo()} class:opacity-50={!$canUndo} disabled={!$canUndo} class="bg-black text-white rounded-md">
                          <i class="material-icons translate-y-1 px-1">undo</i>
                        </button>
                        <button on:click={() => pc.redo()} class:opacity-50={!$canRedo} disabled={!$canRedo} class="bg-black text-white rounded-md">
                           <i class="material-icons translate-y-1 px-1">redo</i>
                        </button>
                     {/if}
                     <SyncButton />
                     <OptionsButton bind:files />
                     <NotesButton />
                     {#if OBR.isAvailable}
                       <NotificationsButton />
                     {/if}
                     <PlayersView />
                   </div>
                 </div>
              </div>
           </div>
           <div class="cell"><StatView forStat="STR" /></div>
           <div class="cell"><StatView forStat="INT" /></div>
           <div class="cell"><StatView forStat="DEX" /></div>
           <div class="cell"><StatView forStat="WIS" /></div>
           <div class="cell"><StatView forStat="CON" /></div>
           <div class="cell"><StatView forStat="CHA" /></div>
           <div class="row-span-2 cell"><HpView /></div>
           <div class="row-span-2 cell"><ArmorClassView /></div>
           <div class="col-span-full row-span-2 cell"><AttacksView /></div>
         </div>
         
         <div class="flex-[2] min-w-[257px] h-auto min-[805px]:h-[700px] grid grid-rows-8 grid-cols-2 gap-2">
            <div class="col-span-full cell">
              <label><h2>NAME</h2><input type="text" bind:value={$pc.name} /></label>
            </div>
            <div class="col-span-full cell"><AncestryView /></div>
            <div class="col-span-full cell"><ClassView /></div>
            <div class="cell">
               <label><h2>LEVEL</h2><input type="number" inputmode="numeric" bind:value={$pc.level} max="10" min="1" /></label>
            </div>
            <div class="cell">
               <h2>XP</h2>
               <div class="sheet-stat flex gap-1">
                 {#if $pc.level < 10}
                   <input id="xp" type="number" inputmode="numeric" min="0" bind:value={$pc.xp} />/<div>{xpCap}</div>
                 {:else}MAX LEVEL{/if}
                 <button class="text-2xl" class:opacity-20={!canLevel} disabled={!canLevel} on:click={() => { levelUpPlayer($pc); $pc = $pc; }}>🆙</button>
               </div>
            </div>
            <div class="col-span-full cell">
               <h2>TITLE</h2>
               {#if $pc.hasCustomClass}
                 <input type="text" value={title ?? $pc.title} on:input={onTitleInput} />
               {:else}
                 <div>{title}</div>
               {/if}
            </div>
            <div class="col-span-full cell">
               <h2>ALIGNMENT</h2>
               <select bind:value={$pc.alignment}>
                 {#each ALIGNMENTS as alignment}<option value={alignment}>{alignment}</option>{/each}
               </select>
            </div>
            <div class="col-span-full cell"><h2>BACKGROUND</h2><input type="text" bind:value={$pc.background} /></div>
            <div class="col-span-full cell"><h2>DEITY</h2><input bind:value={$pc.deity} /></div>
         </div>

         <div class="flex-[3] min-w-[257px] h-auto min-[805px]:h-[700px] grid grid-rows-2 gap-2">
            <div class="cell"><TalentsSpellsView /></div>
            <div class="cell"><GearView /></div>
         </div>
       </div>
    </main>
  </div>
{/if}

{#if $syncMessage}
  <div class="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-xs flex items-center gap-2 z-50 opacity-90">
     <i class="material-icons text-xs animate-spin">sync</i>
     <span>{$syncMessage}</span>
  </div>
{/if}

<SyncSetupModal />

{#if $showReauthModal}
  <Modal on:close={enableOfflineMode}> 
    <h1 slot="header">Authentication Required</h1>
    <div class="flex flex-col gap-4 max-w-xs p-2">
      <p>Your sync session has expired or requires a login.</p>
      <button class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" on:click={login}>Login / Re-authenticate</button>
      <button class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600" on:click={enableOfflineMode}>Work Offline</button>
    </div>
  </Modal>
{/if}

{#if $showConnectionErrorModal}
  <Modal on:close={enableOfflineMode}>
    <h1 slot="header">Connection Failed</h1>
    <div class="flex flex-col gap-4 max-w-xs p-2">
      <p>Synchronization failed due to a bad connection. You can work offline and sync later.</p>
      <button class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600" on:click={enableOfflineMode}>Work Offline</button>
    </div>
  </Modal>
{/if}

{#if $showOfflineConfirmationModal}
  <Modal on:close={() => showOfflineConfirmationModal.set(false)}>
    <h1 slot="header">Offline Mode</h1>
    <div class="flex flex-col gap-4 max-w-xs p-2">
      <p>You are now working offline. The app will automatically try to reconnect in the background.</p>
      <button class="bg-black text-white p-2 rounded hover:bg-gray-800" on:click={() => showOfflineConfirmationModal.set(false)}>OK</button>
    </div>
  </Modal>
{/if}

{#if $showConflictModal}
<Modal on:close={() => { showConflictModal.set(false); logout(); }}>
    <h1 slot="header">Sync Conflicts Detected</h1>
    <div class="flex flex-col gap-3 min-w-[300px] p-2 overflow-y-auto max-h-[80vh]">
        <p class="text-sm">The following slots have changed on both this device and the cloud since you last synced.</p>
        
        <div class="flex flex-col gap-2 mt-2">
           {#each $conflictedSlots as conflict}
             <div class="border border-gray-400 p-2 rounded bg-gray-100 flex flex-col gap-2">
                <div class="font-bold">Slot {conflict.slot}</div>
                <div class="text-xs text-gray-600 flex justify-between">
                    <span>Local: {conflict.localDate.toLocaleTimeString()}</span>
                    <span>Cloud: {conflict.remoteDate.toLocaleTimeString()}</span>
                </div>
                <div class="flex gap-2 justify-between">
                   <button 
                     class="bg-blue-700 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 flex-1"
                     on:click={() => resolveConflict(conflict.slot, 'local')}
                   >
                     Keep Local (Overwrite Cloud)
                   </button>
                   <button 
                     class="bg-green-700 text-white px-2 py-1 rounded text-xs hover:bg-green-600 flex-1"
                     on:click={() => resolveConflict(conflict.slot, 'remote')}
                   >
                     Keep Cloud (Overwrite Local)
                   </button>
                </div>
             </div>
           {/each}
        </div>

        <p class="text-xs text-red-800 mt-2 font-bold text-center">There is no undo.</p>
        
        <button class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-2" on:click={() => { showConflictModal.set(false); logout(); }}>
            Cancel & Work Offline (Export JSON First)
        </button>
    </div>
</Modal>
{/if}

<style lang="postcss">
  input, select { @apply w-full; }
  .cell {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 0.5rem;
    box-shadow: inset 0 0 5px #000;
  }
</style>