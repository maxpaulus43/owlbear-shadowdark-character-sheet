<script lang="ts">
  import RollButton from "./RollButton.svelte";
  import {
    PlayerCharacterStore,
    calculateBonusForPlayerStat,
    calculateModifierForPlayerStat,
    calculateStatValueForPlayerStat,
  } from "../model/PlayerCharacter";
  import type { Stat } from "../types";

  export let forStat: Stat;
  const pc = PlayerCharacterStore;
  $: modifier = calculateModifierForPlayerStat($pc, forStat);
  $: statValue = calculateStatValueForPlayerStat($pc, forStat);
  function onInput(e: Event) {
    $pc.stats[forStat] =
      parseInt((e.target as HTMLInputElement).value) -
      calculateBonusForPlayerStat($pc, forStat);
  }
</script>

<div class="flex flex-col">
  <label>
    <h2>{forStat}</h2>
    <div class="sheet-stat flex gap-1">
      <input
        id={`${forStat}-input}`}
        type="number"
        inputmode="numeric"
        value={statValue}
        on:input={onInput}
        min="1"
        max="20"
        class="w-1/2"
      />&nbsp;/&nbsp;<RollButton {modifier} />
    </div>
  </label>
</div>

<style>
</style>
