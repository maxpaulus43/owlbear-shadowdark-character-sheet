<script lang="ts">
  import AddNewSpellButton from "./AddNewSpellButton.svelte";
  import {
    calculateSpellCastingModifierForPlayer,
    PlayerCharacterStore as pc,
  } from "./PlayerCharacter";
  import RollButton from "./RollButton.svelte";
  import RollTalentButton from "./RollTalentButton.svelte";
  import { addSign, alphabetically } from "./utils";

  $: spells = $pc.spells;
  $: hasSpells = spells.length > 0;
</script>

<h2>SPELLS / BONUSES / LANGUAGES</h2>

<div class="overflow-y-auto">
  <h2>Spells</h2>
  {#if hasSpells}
    <ul class="flex flex-col gap-1">
      {#each spells as spell}
        {@const mod = calculateSpellCastingModifierForPlayer(spell, $pc)}
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
      <li class="border">{b.desc}</li>
    {/each}
  </ul>

  <RollTalentButton />

  <h2>Languages</h2>
  <ul>
    {#each $pc.languages as l}
      <li>{l}</li>
    {/each}
  </ul>
</div>
