<script lang="ts">
  import AddNewSpellButton from "./AddNewSpellButton.svelte";
  import RollButton from "./RollButton.svelte";
  import RollTalentButton from "./RollTalentButton.svelte";
  import {
    calculateSpellCastingModifierForPlayer,
    deleteBonusForPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import { addSign, alphabetically } from "../utils";
  import { findAny } from "../compendium";
  import AddBonusButton from "./AddBonusButton.svelte";
  import type { Bonus } from "../model/Bonus";
  import { LANGUAGES } from "../constants";
  import type { SpellInfo } from "../model/Spell";
  import Modal from "./Modal.svelte";
  import SpellView from "./SpellView.svelte";

  $: spells = $pc.spells;
  $: hasSpells = spells?.length > 0;

  $: equippableGearWithBonuses = $pc.gear
    .filter((g) => g.equipped)
    .map((g) => findAny(g.name))
    .filter((g) => g && g.canBeEquipped && g.playerBonuses?.length > 0);

  $: otherGearWithBonuses = $pc.gear
    .filter((g) => !g.equipped)
    .map((g) => findAny(g.name))
    .filter((g) => g && g.playerBonuses?.length > 0 && !g.canBeEquipped);

  let showSpellInfoForSpell: SpellInfo;
  let showModal = false;

  function deleteBonus(b: Bonus) {
    deleteBonusForPlayer($pc, b);
    $pc = $pc;
  }

  function editBonus(b: Bonus) {
    // TODO edit bonus
    $pc = $pc;
  }

  let addingNewLanguage = false;
  function doesNotKnowLanguage(l: string) {
    return !$pc.languages.includes(l);
  }
  function onAddNewLanguage(l: string) {
    $pc.languages.push(l);
    addingNewLanguage = false;
    $pc = $pc;
  }
  function onLanguageChange(e: Event) {
    onAddNewLanguage((e.target as HTMLSelectElement).value);
  }
</script>

<h2>SPELLS / BONUSES / LANGUAGES</h2>

<div class="overflow-y-auto">
  <h2>Spells</h2>
  {#if hasSpells}
    <ul class="flex flex-col gap-1">
      {#each spells as spell}
        {@const mod = calculateSpellCastingModifierForPlayer($pc, spell)}
        <li>
          <div
            class="flex justify-between border-b border-gray-400 items-center"
          >
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
  <AddNewSpellButton />

  <h2>Bonuses</h2>
  <ul class="px-1">
    {#each $pc.bonuses.sort((a, b) => alphabetically(a.desc, b.desc)) as b}
      <li class="border-b flex justify-between gap-3 items-center">
        <div>{b.desc}</div>
        {#if b.editable}
          <div class="flex gap-1">
            <button
              class="pt-1 px-1 rounded-md bg-black text-white"
              on:click={() => editBonus(b)}
            >
              <i class="material-icons">edit</i>
            </button>
            <button
              class="pt-1 px-1 rounded-md bg-black text-white"
              on:click={() => deleteBonus(b)}
            >
              <i class="material-icons">delete</i>
            </button>
          </div>
        {/if}
      </li>
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

  <div class="flex gap-1">
    <RollTalentButton />
    <AddBonusButton />
  </div>

  <div class="flex gap-2">
    <h2>Languages</h2>
    <button
      on:click={() => {
        addingNewLanguage = !addingNewLanguage;
      }}
      class="px-3 hover:bg-gray-400"
    >
      <i class="material-icons translate-y-1"
        >{addingNewLanguage ? "do_not_disturb_on" : "add_circle"}</i
      >
    </button>
    {#if addingNewLanguage}
      <select class="flex-grow" on:change={onLanguageChange}>
        <option />
        {#each LANGUAGES.filter(doesNotKnowLanguage) as l}
          <option>{l}</option>
        {/each}
      </select>
    {/if}
  </div>
  <ul>
    {#each $pc.languages as l}
      <li class="border-b">{l}</li>
    {/each}
  </ul>
</div>

{#if showSpellInfoForSpell}
  <Modal bind:showModal>
    <h2 slot="header">{showSpellInfoForSpell.name}</h2>
    <SpellView s={showSpellInfoForSpell} />
  </Modal>
{/if}
