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

  function num(n: number) {
    return n > 0 ? addSign(n) : "";
  }

  $: abilityBonuses = $pc.bonuses
    .filter((b) => b.sourceCategory === "Ability")
    .map((b) => {
      const bonusTo = b.name === "Grit" ? b.bonusName : b.bonusTo;
      return `${b.name}: ${bonusTo} ${num(b.bonusAmount)}`;
    });

  $: talents = $pc.bonuses
    .filter((b) => b.sourceCategory === "Talent")
    .map((b) => `${b.bonusName} to ${b.bonusTo} ${num(b.bonusAmount)}`);
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
  <ul>
    {#each abilityBonuses as b}
      <li>{b}</li>
    {/each}
  </ul>

  <h2>Talents</h2>
  <ul>
    {#each talents as t}
      <li>{t}</li>
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
