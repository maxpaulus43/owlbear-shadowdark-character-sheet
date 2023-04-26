<script lang="ts">
  import { findAny } from "../compendium";
  import type { Bonus } from "../model/Bonus";
  import {
    deleteBonusForPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import { alphabetically } from "../utils";
  import AddBonusButton from "./AddBonusButton.svelte";
  import RollTalentButton from "./RollTalentButton.svelte";

  $: equippableGearWithBonuses = $pc.gear
    .filter((g) => g.equipped)
    .map((g) => findAny(g.name))
    .filter((g) => g && g.canBeEquipped && g.playerBonuses?.length > 0);

  $: otherGearWithBonuses = $pc.gear
    .filter((g) => !g.equipped)
    .map((g) => findAny(g.name))
    .filter((g) => g && g.playerBonuses?.length > 0 && !g.canBeEquipped);

  function deleteBonus(b: Bonus) {
    deleteBonusForPlayer($pc, b);
    $pc = $pc;
  }

  function editBonus(b: Bonus) {
    // TODO edit bonus
    $pc = $pc;
  }
</script>

<h2>Bonuses</h2>
<ul class="px-1">
  {#each $pc.bonuses.sort((a, b) => alphabetically(a.desc, b.desc)) as b}
    <li class="border-b flex justify-between gap-3 items-center">
      <div>{b.desc}</div>
      {#if b.editable}
        <div class="flex gap-1">
          <button
            class="pt-1 px-1 rounded-md bg-black text-white"
            on:click={() => editBonus(b)}
          >
            <i class="material-icons">edit</i>
          </button>
          <button
            class="pt-1 px-1 rounded-md bg-black text-white"
            on:click={() => deleteBonus(b)}
          >
            <i class="material-icons">delete</i>
          </button>
        </div>
      {/if}
    </li>
  {/each}
</ul>

<h2>Bonuses From Items</h2>
<ul>
  {#each otherGearWithBonuses.sort( (a, b) => alphabetically(a.name, b.name) ) as g}
    <li class="border-b">
      <div class="font-bold bg-gray-300">{g.name}</div>
      <ul>
        {#each g.playerBonuses as b}
          <li class="border-b ps-8">* {b.desc}</li>
        {/each}
      </ul>
    </li>
  {/each}
  {#each equippableGearWithBonuses.sort( (a, b) => alphabetically(a.name, b.name) ) as g}
    <li class="border-b">
      <div class="font-bold bg-gray-300">{g.name}</div>
      <ul>
        {#each g.playerBonuses as b}
          <li class="border-b ps-8">* {b.desc}</li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>

<div class="flex gap-1">
  <RollTalentButton />
  <AddBonusButton />
</div>
