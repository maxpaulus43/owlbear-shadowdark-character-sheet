<script lang="ts">
  import {
    PlayerCharacterStore,
    calculateModifierForPlayerStat,
  } from "./PlayerCharacter";
  import RollButton from "./RollButton.svelte";
  import ModifierView from "./ModifierView.svelte";
  import type { Stat } from "../model";

  export let forStat: Stat;
  const pc = PlayerCharacterStore;
  $: modifier = calculateModifierForPlayerStat($pc, forStat);
</script>

<div class="flex, p-1 bg-white flex-col relative" id={`sheet-${forStat}`}>
  <div>{forStat}</div>
  <div class="sheet-stat flex gap-1">
    <input
      type="number"
      bind:value={$pc.stats[forStat]}
      min="1"
      max="20"
      class="w-1/2 border border-gray-500"
    />
    /
    <ModifierView {forStat} />
    <RollButton {modifier} />
  </div>
</div>

<style>
</style>
