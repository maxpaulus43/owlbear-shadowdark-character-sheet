<script lang="ts">
  import type { Player } from "@owlbear-rodeo/sdk";
  import {
    isGM,
    PartyStore,
    TrackedPlayer,
    gmId,
    isTrackedPlayerGM,
  } from "../services/OBRHelper";
  import Modal from "./Modal.svelte";

  let showModal = false;

  type PlayerItem = {
    id: string;
    name: string;
  };

  let allPlayers: PlayerItem[];

  $: {
    allPlayers = $PartyStore.map((p) => ({ id: p.id, name: p.name }));
    allPlayers.unshift({ id: $gmId, name: "GM" });
  }

  function onLoadPlayer(p: PlayerItem) {
    $TrackedPlayer = p.id;
  }
</script>

{#if $isGM}
  <button
    on:click={() => (showModal = true)}
    class="{$isTrackedPlayerGM ? 'bg-black' : 'bg-green-600' } text-white px-1"
  >
    <i class="material-icons translate-y-1">group</i>
  </button>
{/if}

<Modal bind:showModal>
  <h1 slot="header">Players</h1>
  <div class="w-72">
    NOTE: loading a player only loads their data. It is a READ ONLY view of the
    players sheet.
  </div>
  <div class="flex flex-col gap-1 w-full">
    {#each allPlayers as p}
      <div
        class="flex gap-1 justify-between items-center p-1 rounded-md w-full"
        class:bg-yellow-300={$TrackedPlayer === p.id}
      >
        <div>{p.name}</div>
        {#if $TrackedPlayer !== p.id}
          <button
            class="bg-black text-white p-1 rounded-md px-1"
            on:click={() => onLoadPlayer(p)}>Load</button
          >
        {:else}
          <div>In Sync</div>
        {/if}
      </div>
    {/each}
  </div>
</Modal>
