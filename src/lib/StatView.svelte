<script lang="ts">
  import {
    PlayerCharacterStore,
    calculateModifierForPlayerStat,
  } from "./PlayerCharacter";
  import RollButton from "./RollButton.svelte";
  import ModifierView from "./ModifierView.svelte";
  import type { Stat } from "../types";
  import Modal from "./Modal.svelte";

  export let forStat: Stat;
  const pc = PlayerCharacterStore;
  $: modifier = calculateModifierForPlayerStat($pc, forStat);
</script>

<div class="flex flex-col">
  <h2>{forStat}</h2>
  <div class="sheet-stat flex gap-1">
    <input
      type="number"
      bind:value={$pc.stats[forStat]}
      min="1"
      max="20"
      class="w-1/2 border border-gray-500 p-1"
    />
    /
    <ModifierView {forStat} />
    <RollButton {modifier} />
  </div>
</div>

<style>
</style>
