<script lang="ts">
  import { findSpell } from "../../compendium";
  import {
    calculateSpellCastingModifierForPlayer,
    pc,
  } from "../../model/PlayerCharacter";
  import CustomSpellButton from "./CustomSpellButton.svelte";
  import RollButton from "../RollButton.svelte";
  import SpellsButton from "./SpellsButton.svelte";
  import SpellInfoButton from "./SpellInfoButton.svelte";

  $: spells = $pc.spells.map((s) => findSpell(s.name)).filter(Boolean);
  $: hasSpells = spells?.length > 0;
</script>

<h2>Spells</h2>
{#if hasSpells}
  <ul class="flex flex-col gap-1">
    {#each spells as spell}
      {@const mod = calculateSpellCastingModifierForPlayer($pc, spell)}
      <li>
        <div class="flex justify-between border-b border-gray-400 items-center">
          <div class="flex gap-1">
            <div>{spell.name}</div>
            <SpellInfoButton {spell} />
          </div>
          <div class="flex">
            <RollButton modifier={mod} />
          </div>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<div class="flex gap-1">
  <SpellsButton />
  <CustomSpellButton />
</div>
