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

  $: selectedFarsightOption = $pc.bonuses.find((b) => b.name === "Farsight: Spellcasting")
    ? "spellcasting"
    : "ranged";

  function onFarsightChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    $pc.bonuses = $pc.bonuses.filter(
      (b) => b.name !== "Farsight: Ranged Attacks" && b.name !== "Farsight: Spellcasting"
    );
    if (val === "spellcasting") {
      $pc.bonuses.push({
        name: "Farsight: Spellcasting",
        desc: "+1 bonus to spellcasting checks",
        bonusSource: "Ancestry",
        type: "modifyAmt",
        bonusTo: "spellcastRoll",
        bonusAmount: 1,
      });
    } else {
      $pc.bonuses.push({
        name: "Farsight: Ranged Attacks",
        desc: "+1 bonus to attack rolls with ranged weapons",
        bonusSource: "Ancestry",
        type: "modifyAmt",
        bonusTo: "attackRoll",
        bonusAmount: 1,
        metadata: {
          type: "weaponType",
          weaponType: "Ranged",
        },
      });
    }
    $pc = $pc;
  }

  $: selectedKnackOption = $pc.bonuses.find((b) => b.name === "Knack: Luck Token")
    ? "luck"
    : "spellcasting";

  function onKnackChange(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    $pc.bonuses = $pc.bonuses.filter(
      (b) => b.name !== "Knack: Spellcasting" && b.name !== "Knack: Luck Token"
    );
    if (val === "luck") {
      $pc.bonuses.push({
        name: "Knack: Luck Token",
        desc: "Begin each session with a luck token",
        bonusSource: "Ancestry",
        type: "generic",
      });
    } else {
      $pc.bonuses.push({
        name: "Knack: Spellcasting",
        desc: "+1 to spellcasting checks",
        bonusSource: "Ancestry",
        type: "modifyAmt",
        bonusTo: "spellcastRoll",
        bonusAmount: 1,
      });
    }
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
  {#if $pc.ancestry === "Elf"}
    <div class="mt-2 flex flex-col gap-1 w-full text-xs">
      <label for="elf-farsight-choice" class="font-semibold text-gray-700">FARSIGHT CHOICE</label>
      <select id="elf-farsight-choice" value={selectedFarsightOption} on:change={onFarsightChange} class="w-full">
        <option value="ranged">+1 to Ranged Attacks</option>
        <option value="spellcasting">+1 to Spellcasting Checks</option>
      </select>
    </div>
  {:else}
    {#if $pc.ancestry === "Kobold"}
      <div class="mt-2 flex flex-col gap-1 w-full text-xs">
        <label for="kobold-knack-choice" class="font-semibold text-gray-700">KNACK CHOICE</label>
        <select id="kobold-knack-choice" value={selectedKnackOption} on:change={onKnackChange} class="w-full">
          <option value="spellcasting">+1 to Spellcasting Checks</option>
          <option value="luck">Luck Token each session</option>
        </select>
      </div>
    {/if}
  {/if}
{/if}
