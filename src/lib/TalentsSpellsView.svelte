<script lang="ts">
  import AddNewSpellButton from "./AddNewSpellButton.svelte";
  import {
    calculateSpellCastingModifierForPlayer,
    PlayerCharacterStore as pc,
  } from "./PlayerCharacter";
  import RollButton from "./RollButton.svelte";
  import RollTalentButton from "./RollTalentButton.svelte";
  import { addSign } from "./utils";

  $: spells = [];
  $: hasSpells = !spells.includes("None");

  $: talents = $pc.bonuses
    .filter((b) => b.sourceCategory === "Talent")
    .map((b) => `${b.bonusName} to ${b.bonusTo}`);

  $: langs = $pc.bonuses
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
            <div>{spell}</div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
  <AddNewSpellButton />

  <div>Talents</div>
  <ul>
    {#each talents as talent}
      <li>{talent}</li>
    {/each}
  </ul>
  <RollTalentButton />

  <div>Languages</div>
  <ul>
    {#each langs as l}
      <li>{l}</li>
    {/each}
  </ul>
</div>
