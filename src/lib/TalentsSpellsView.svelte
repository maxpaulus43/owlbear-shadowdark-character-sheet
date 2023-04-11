<script lang="ts">
  import AddNewSpellButton from "./AddNewSpellButton.svelte";
  import {
    calculateSpellCastingModifierForPlayer,
    PlayerCharacterStore as pc,
  } from "./PlayerCharacter";
  import RollButton from "./RollButton.svelte";
  import RollTalentButton from "./RollTalentButton.svelte";
  $: spells = $pc.spellsKnown.split(",");
  $: bonuses = $pc.bonuses.map((b) => `${b.bonusName} to ${b.bonusTo}`);
</script>

<div class="overflow-scroll">
  <ul class="flex flex-col gap-1">
    {#each spells as spell}
      <li>
        <div class="flex justify-between border-b border-gray-400">
          <RollButton
            modifier={calculateSpellCastingModifierForPlayer(spell, $pc)}
          />
          <div>{spell}</div>
        </div>
      </li>
    {/each}
  </ul>
  <AddNewSpellButton />
  <ul>
    {#each bonuses as talent}
      <li>{talent}</li>
    {/each}
  </ul>
  <RollTalentButton />
</div>
