<script lang="ts">
  import {
    calculateTotalHitPointsForPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";

  function incrMaxHp() {
    $pc.maxHitPoints += 1;
  }
  function decrMaxHp() {
    $pc.maxHitPoints = Math.max(1, $pc.maxHitPoints - 1);
    if ($pc.hitPoints > $pc.maxHitPoints) {
      $pc.hitPoints = $pc.maxHitPoints;
    }
  }
  function longRest() {
    $pc.hitPoints = $pc.maxHitPoints;
    $pc.spells = $pc.spells.map((s) => ({ name: s.name, failed: false }));
  }
</script>

<h2>HP</h2>
<label for="hitpoints" />
<input
  id="hitpoints"
  type="number"
  inputmode="numeric"
  class="pirata text-5xl text-center"
  min="0"
  bind:value={$pc.hitPoints}
/>

<div class="flex gap-1 justify-between">
  <div>Max: {calculateTotalHitPointsForPlayer($pc)}</div>
  <div>
    <button on:click={decrMaxHp}><i class="material-icons">remove</i></button>
    <button on:click={incrMaxHp}><i class="material-icons">add</i></button>
  </div>
</div>

<button
  class="bg-black text-white rounded-md text-sm self-center px-2"
  on:click={longRest}>Long Rest</button
>
