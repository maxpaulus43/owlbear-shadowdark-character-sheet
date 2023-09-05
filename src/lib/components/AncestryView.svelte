<script lang="ts">
  import { ANCESTRIES } from "../constants";
  import {
    PlayerCharacterStore as pc,
    setAncestryForPlayer,
  } from "../model/PlayerCharacter";
  import type { Ancestry } from "../types";

  function onToggleCustomAncestry(e: Event) {
    $pc.hasCustomAncestry = (e.target as HTMLInputElement).checked;
  }

  function onAncestryChange(e: Event) {
    const a: Ancestry = (e.target as HTMLSelectElement).value as Ancestry;
    setAncestryForPlayer($pc, a);
    $pc = $pc;
  }
</script>

<div class="flex justify-between">
  <h2>ANCESTRY</h2>
  <div class="flex items-center gap-1">
    <input
      id="customAncestry"
      type="checkbox"
      checked={$pc.hasCustomAncestry}
      on:input={onToggleCustomAncestry}
    />
    <label for="customAncestry">Custom</label>
  </div>
</div>
{#if $pc.hasCustomAncestry}
  <input type="text" value={$pc.ancestry} on:input={onAncestryChange} />
{:else}
  <select value={$pc.ancestry} on:change={onAncestryChange}>
    {#each ANCESTRIES as ancestry}
      <option value={ancestry}>
        {ancestry}
      </option>
    {/each}
  </select>
{/if}
