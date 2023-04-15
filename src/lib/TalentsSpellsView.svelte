<script lang="ts">
  import AddNewSpellButton from "./AddNewSpellButton.svelte";
  import {
    calculateSpellCastingModifierForPlayer,
    PlayerCharacterStore as pc,
  } from "./PlayerCharacter";
  import RollButton from "./RollButton.svelte";
  import RollTalentButton from "./RollTalentButton.svelte";
  import { addSign } from "./utils";

  $: spells = $pc.spells;
  $: hasSpells = spells.length > 0;

  $: talents = $pc.bonuses
    .filter((b) => b.sourceCategory === "Talent")
    .map((b) => `${b.bonusName} to ${b.bonusTo}`);

  $: languages = $pc.bonuses
    .filter((b) => b.bonusTo === "Languages")
    .map((b) => b.bonusName);
</script>

<div class="overflow-y-auto">
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

  <h2>Talents</h2>
  <ul>
    {#each talents as t}
      <li>{t}</li>
    {/each}
  </ul>
  <RollTalentButton />

  <h2>Languages</h2>
  <ul>
    {#each languages as l}
      <li>{l}</li>
    {/each}
  </ul>
</div>
