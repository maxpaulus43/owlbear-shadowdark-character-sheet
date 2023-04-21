<script lang="ts">
  import RollButton from "./RollButton.svelte";
  import ModifierView from "./ModifierView.svelte";
  import {
    PlayerCharacterStore,
    calculateModifierForPlayerStat,
  } from "../model/PlayerCharacter";
  import type { Stat } from "../model/PlayerCharacter";

  export let forStat: Stat;
  const pc = PlayerCharacterStore;
  $: modifier = calculateModifierForPlayerStat($pc, forStat);
</script>

<div class="flex flex-col">
  <h2>{forStat}</h2>
  <div class="sheet-stat flex gap-1">
    <input
      type="number"
      inputmode="numeric"
      bind:value={$pc.stats[forStat]}
      min="1"
      max="20"
      class="w-1/2 border border-gray-500 p-1"
    />
    <RollButton {modifier} />
    <ModifierView {forStat} />
  </div>
</div>

<style>
</style>
