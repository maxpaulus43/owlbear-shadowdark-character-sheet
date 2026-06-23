<script lang="ts">
  import { findAny } from "../../compendium";
  import { CLASSES } from "../../constants";
  import { deleteBonusForPlayer, pc } from "../../model/PlayerCharacter";
  import { alphabetically } from "../../utils";
  import RollNewTalentButton from "../talents/RollNewTalentButton.svelte";
  import BonusView from "./BonusView.svelte";
  import CustomBonusButton from "./CustomBonusButton.svelte";
  import CustomBonusForm from "./CustomBonusForm.svelte";
  import Modal from "../Modal.svelte";
  import type { CustomBonus, Bonus } from "../../types";

  $: equippableGearWithBonuses = $pc.gear
    .filter((g) => g.equipped)
    .map((g) => findAny(g.name))
    .filter((g) => g && g.canBeEquipped && g.playerBonuses?.length > 0);

  $: otherGearWithBonuses = $pc.gear
    .filter((g) => !g.equipped)
    .map((g) => findAny(g.name))
    .filter((g) => g && g.playerBonuses?.length > 0 && !g.canBeEquipped);

  let editingCustomBonus: CustomBonus | undefined = undefined;
  let showEditModal = false;

  function editCustomBonus(cb: CustomBonus) {
    editingCustomBonus = cb;
    showEditModal = true;
  }

  function deleteFlatBonus(b: Bonus) {
    deleteBonusForPlayer($pc, b);
    $pc = $pc;
  }
</script>

<h2>Bonuses</h2>
<ul class="px-1">
  {#each $pc.bonuses.sort((a, b) => alphabetically(a.desc || a.name || "", b.desc || b.name || "")) as b}
    <li class="border-b py-1 flex items-center w-full">
      <BonusView bonus={b} showDelete={b.editable} on:delete={() => deleteFlatBonus(b)} />
    </li>
  {/each}
</ul>

{#if $pc.customBonuses && $pc.customBonuses.length > 0}
  <h2>Custom Bonuses</h2>
  <ul class="px-1">
    {#each $pc.customBonuses.sort((a, b) => alphabetically(a.name, b.name)) as cb}
      <li class="border-b py-2 flex flex-col gap-1">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-bold text-sm">{cb.name}</div>
            <div class="text-xs text-gray-600">{cb.desc}</div>
          </div>
          <div class="flex gap-1">
            <button
              class="pt-1 px-1 rounded-md bg-black text-white text-xs"
              on:click={() => editCustomBonus(cb)}
            >
              <i class="material-icons text-sm">edit</i>
            </button>
          </div>
        </div>
        {#if cb.bonuses && cb.bonuses.length > 0}
          <ul class="list-disc ps-6 text-xs text-gray-800">
            {#each cb.bonuses as b}
              <li><BonusView bonus={b} showInfo={false} /></li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<h2>Bonuses From Items</h2>
<ul>
  {#each otherGearWithBonuses.sort( (a, b) => alphabetically(a.name, b.name) ) as g}
    <li class="border-b">
      <div class="font-bold bg-gray-300 px-1">{g.name}</div>
      <ul>
        {#each g.playerBonuses as b}
          <li class="border-b ps-8 flex gap-1">* <BonusView bonus={b} /></li>
        {/each}
      </ul>
    </li>
  {/each}
  {#each equippableGearWithBonuses.sort( (a, b) => alphabetically(a.name, b.name) ) as g}
    <li class="border-b">
      <div class="font-bold bg-gray-300 px-1">{g.name}</div>
      <ul>
        {#each g.playerBonuses as b}
          <li class="border-b ps-8 flex gap-1">
            * <BonusView bonus={b} showInfo={false} />
          </li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>

<div class="flex gap-1 mt-2">
  {#if $pc.level > 0 && $pc.class && !$pc.hasCustomClass && CLASSES.includes($pc.class)}
    <RollNewTalentButton />
  {/if}
  <CustomBonusButton />
</div>

{#if showEditModal && editingCustomBonus}
  <Modal bind:showModal={showEditModal}>
    <h1 slot="header">Edit Custom Bonus</h1>
    <CustomBonusForm
      customBonus={editingCustomBonus}
      on:finish={() => {
        showEditModal = false;
        editingCustomBonus = undefined;
      }}
    />
  </Modal>
{/if}
