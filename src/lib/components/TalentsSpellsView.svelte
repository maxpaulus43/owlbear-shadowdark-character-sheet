<script lang="ts">
  import AddNewSpellButton from "./AddNewSpellButton.svelte";
  import RollButton from "./RollButton.svelte";
  import RollTalentButton from "./RollTalentButton.svelte";
  import {
    calculateSpellCastingModifierForPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import { addSign, alphabetically } from "../utils";
  import { findAny } from "../compendium";

  $: spells = $pc.spells;
  $: hasSpells = spells.length > 0;

  $: equippableGearWithBonuses = $pc.gear
    .filter((g) => g.equipped)
    .map((g) => findAny(g.name))
    .filter((g) => g && g.canBeEquipped && g.playerBonuses?.length > 0);

  $: otherGearWithBonuses = $pc.gear
    .filter((g) => !g.equipped)
    .map((g) => findAny(g.name))
    .filter((g) => g && g.playerBonuses?.length > 0 && !g.canBeEquipped);
</script>

<h2>SPELLS / BONUSES / LANGUAGES</h2>

<div class="overflow-y-auto">
  <h2>Spells</h2>
  {#if hasSpells}
    <ul class="flex flex-col gap-1">
      {#each spells as spell}
        {@const mod = calculateSpellCastingModifierForPlayer($pc)}
        <li>
          <div
            class="flex justify-between border-b border-gray-400 items-center"
          >
            <div class="flex">
              <RollButton modifier={mod} />
              <span>({addSign(mod)})</span>
            </div>
            <div>{spell.name}</div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
  <AddNewSpellButton />

  <h2>Bonuses</h2>
  <ul class="list-disc">
    {#each $pc.bonuses.sort((a, b) => alphabetically(a.desc, b.desc)) as b}
      <li class="border-b">{b.desc}</li>
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

  <RollTalentButton />

  <h2>Languages</h2>
  <ul>
    {#each $pc.languages as l}
      <li class="border-b">{l}</li>
    {/each}
  </ul>
</div>
