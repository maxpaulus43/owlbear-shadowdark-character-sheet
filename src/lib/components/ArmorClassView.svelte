<script lang="ts">
  import {
    calculateArmorClassForPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";

  $: ac = calculateArmorClassForPlayer($pc);

  function incrAC() {
    $pc.armorClass += 1;
    $pc = $pc;
  }
  function decrAC() {
    $pc.armorClass -= 1;
    $pc = $pc;
  }
</script>

<h2>AC</h2>
<div
  class="flex w-full h-full justify-center items-center text-7xl pirata text-center"
>
  {ac}
</div>
<div class="flex items-center">
  <span class="text-sm">Base AC: {$pc.armorClass}</span>
  <button on:click={decrAC}>
    <i class="material-icons">remove</i>
  </button>
  <button on:click={incrAC}>
    <i class="material-icons">add</i>
  </button>
</div>
