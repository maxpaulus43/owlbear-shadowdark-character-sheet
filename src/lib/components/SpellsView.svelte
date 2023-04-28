<script lang="ts">
  import { findSpell } from "../compendium";
  import {
    calculateSpellCastingModifierForPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import type { SpellInfo } from "../model/Spell";
  import { addSign } from "../utils";
  import CreateSpellView from "./CreateSpellView.svelte";
  import LearnNewSpellButton from "./LearnNewSpellButton.svelte";
  import Modal from "./Modal.svelte";
  import RollButton from "./RollButton.svelte";
  import SpellView from "./SpellView.svelte";

  let showSpellInfoForSpell: SpellInfo;
  let showModal = false;

  $: spells = $pc.spells.map((s) => findSpell(s.name));
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
            <button
              on:click={() => {
                showSpellInfoForSpell = spell;
                showModal = true;
              }}
            >
              <i class="material-icons">info</i>
            </button>
          </div>
          <div class="flex">
            <RollButton modifier={mod} />
            <span>({addSign(mod)})</span>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<div class="flex gap-1">
  <LearnNewSpellButton />
  <CreateSpellView />
</div>

{#if showSpellInfoForSpell}
  <Modal bind:showModal>
    <h2 slot="header">{showSpellInfoForSpell.name}</h2>
    <SpellView s={showSpellInfoForSpell} />
  </Modal>
{/if}
