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
  import type { SpellInfo } from "../../types";

  $: spells = $pc.spells.map((s) => findSpell(s.name)).filter(Boolean);
  $: hasSpells = spells?.length > 0;

  function toggleFailed(s: SpellInfo) {
    const idx = $pc.spells.findIndex((spell) => spell.name === s.name);

    if (idx === -1) {
      $pc.spells.push({ name: s.name, failed: true });
    } else {
      $pc.spells[idx].failed = !$pc.spells[idx].failed;
    }

    $pc = $pc;
  }

  function hasFailedSpellcast(s: SpellInfo): boolean {
    const idx = $pc.spells.findIndex((spell) => spell.name === s.name);
    return idx !== -1 && $pc.spells[idx].failed;
  }
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
          <div class="flex items-center gap-2">
            <input
              title="spellcasting failed"
              type="checkbox"
              class="w-6 h-6"
              checked={hasFailedSpellcast(spell)}
              on:click={() => toggleFailed(spell)}
            />
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
