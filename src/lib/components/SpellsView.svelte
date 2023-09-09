<script lang="ts">
  import { findSpell } from "../compendium";
  import {
    calculateSpellCastingModifierForPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import type { SpellInfo } from "../types";
  import LearnNewSpellButton from "./AddSpellButton.svelte";
  import Modal from "./Modal.svelte";
  import RollButton from "./RollButton.svelte";
  import SpellView from "./SpellView.svelte";
  import CustomSpellForm from "./CustomSpellForm.svelte";

  let selectedSpell: SpellInfo;
  let showSpellFormModal = false;

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
                selectedSpell = spell;
              }}
            >
              <i class="material-icons">info</i>
            </button>
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
  <LearnNewSpellButton />
  <button
    class="bg-black text-white w-full"
    on:click={() => {
      showSpellFormModal = true;
    }}>Custom Spell</button
  >
</div>

{#if selectedSpell}
  <Modal showModal={Boolean(selectedSpell)}>
    <h2 slot="header">{selectedSpell.name}</h2>
    <SpellView
      s={selectedSpell}
      on:close={() => {
        selectedSpell = undefined;
      }}
    />
  </Modal>
{/if}

<Modal bind:showModal={showSpellFormModal}>
  <h2 slot="header">New Custom Spell</h2>
  <CustomSpellForm on:finish={() => (showSpellFormModal = false)} />
</Modal>
