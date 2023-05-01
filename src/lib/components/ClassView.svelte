<script lang="ts">
  import { CLASSES } from "../constants";
  import {
    PlayerCharacterStore as pc,
    setClassForPlayer,
  } from "../model/PlayerCharacter";
  import type { Class } from "../model/PlayerCharacter";
  import {
    ensureClassBonuses,
    ensureClassGear,
  } from "../services/AncestryClassEnsurer";

  $: atLeastLevelOne = $pc.level >= 1;

  function onClassChange(e: Event) {
    const c: Class = (e.target as HTMLSelectElement).value as Class;
    setClassForPlayer($pc, c);
    $pc = $pc;
  }
  function onToggleCustomClass(e: Event) {
    $pc.hasCustomClass = (e.target as HTMLInputElement).checked;
    ensureClassBonuses($pc);
    ensureClassGear($pc);
  }
</script>

<div class="flex justify-between">
  <h2>CLASS</h2>
  {#if !atLeastLevelOne}
    <div>(Must Be At Least Level 1)</div>
  {/if}
  <div class="flex items-center gap-1">
    <input
      id="customClass"
      type="checkbox"
      disabled={!atLeastLevelOne}
      checked={$pc.hasCustomClass}
      on:input={onToggleCustomClass}
    />
    <label for="customClass">Custom</label>
  </div>
</div>
{#if $pc.hasCustomClass}
  <input
    type="text"
    value={$pc.class}
    on:input={onClassChange}
    disabled={!atLeastLevelOne}
  />
{:else}
  <select
    value={$pc.class}
    on:change={onClassChange}
    disabled={!atLeastLevelOne}
  >
    {#each CLASSES as clazz}
      <option value={clazz}>
        {clazz}
      </option>
    {/each}
  </select>
{/if}
