<script lang="ts">
  import CustomGearButton from "./CustomGearButton.svelte";
  import GearButton from "./GearButton.svelte";
  import { findAny } from "../../compendium";
  import { calculateGearSlotsForPlayer, pc } from "../../model/PlayerCharacter";
  import { alphabetically } from "../../utils";
  import type { Gear, GearInfo } from "../../types";
  import CustomGearForm from "./CustomGearForm.svelte";
  import Modal from "../Modal.svelte";
  import BonusView from "../bonuses/BonusView.svelte";

  const COIN_NAME = "Extra Coins";
  $: costlyGear = $pc.gear
    .filter((g) => findAny(g.name)?.slots.freeCarry === 0)
    .sort((a, b) => alphabetically(a.name, b.name));

  $: totalCoins = $pc.gold + $pc.silver + $pc.copper;

  $: if (costlyGear && totalCoins > 100) {
    costlyGear.push({
      name: COIN_NAME,
      quantity: totalCoins - 100,
    });
  }

  $: freeGear = $pc.gear
    .filter((g) => findAny(g.name)?.slots.freeCarry)
    .sort((a, b) => alphabetically(a.name, b.name));

  $: totalSlots = calculateGearSlotsForPlayer($pc);

  $: freeSlots =
    totalSlots -
    costlyGear.reduce((acc, curr) => {
      return acc + slotsForGear(curr);
    }, 0);

  let editingGear: GearInfo | undefined = undefined;
  let showEditModal = false;

  function editCustomGear(gearInfo: GearInfo) {
    editingGear = gearInfo;
    showEditModal = true;
  }

  function slotsForGear(g: Gear): number {
    if (g.name === COIN_NAME) {
      return Math.ceil(g.quantity / 100);
    }

    const foundGear = findAny(g.name);
    return (
      Math.ceil(g.quantity / foundGear.slots.perSlot) *
      foundGear.slots.slotsUsed
    );
  }

  function deleteGear(name: string) {
    const idx = $pc.gear.findIndex((g) => g.name === name);
    const g = $pc.gear[idx];
    if (g.quantity > 1) {
      g.quantity -= 1;
    } else {
      $pc.gear.splice(idx, 1);
    }
    $pc = $pc;
  }

  function toggleEquipped(g: Gear) {
    g.equipped = !g.equipped;
    $pc = $pc;
  }

  function canInteractWithGear(_gear: Gear): boolean {
    return true;
  }
</script>

<div class="flex gap-1 p-1">
  <h2>GEAR</h2>
  <span>({totalSlots} slots, {freeSlots} free)</span>
  <GearButton />
  <CustomGearButton />
</div>
{#if freeSlots < 0}
  <div class="text-red-600">Over Encumbered</div>
{/if}

<div class="flex gap-1">
  <div class="flex items-center">
    <div>GP:</div>
    <input
      type="number"
      inputmode="numeric"
      bind:value={$pc.gold}
      class="w-16"
    />
  </div>
  <div class="flex items-center">
    <div>SP:</div>
    <input
      type="number"
      inputmode="numeric"
      bind:value={$pc.silver}
      class="w-16"
    />
  </div>
  <div class="flex items-center">
    <div>CP:</div>
    <input
      type="number"
      inputmode="numeric"
      bind:value={$pc.copper}
      class="w-16"
    />
  </div>
</div>

<div
  class="overflow-scroll flex flex-col gap-1 p-2"
  style="box-shadow: inset 0 0 5px #000;"
>
  <ul>
    {#each costlyGear as g, i}
      {@const foundGear = findAny(g.name)}
      <li class="border-b border-gray-400 py-1">
        <div
          class="flex gap-1 items-center justify-between"
        >
          <div class="flex justify-between">
            <span>
              {i + 1}. {g.name} x {g.quantity} ({slotsForGear(g)} slots)
            </span>
          </div>
          {#if g.name !== COIN_NAME}
            <div class="flex gap-1 items-center">
              {#if foundGear && foundGear.canBeEquipped}
                <input
                  title="equipped"
                  type="checkbox"
                  class="w-6 h-6"
                  checked={g.equipped}
                  disabled={!canInteractWithGear(g)}
                  on:click={() => toggleEquipped(g)}
                />
              {/if}
              {#if foundGear && foundGear.editable}
                <button
                  on:click={() => editCustomGear(foundGear)}
                  class="px-1 pt-1 rounded-md bg-black text-white"
                  ><i class="material-icons text-sm">edit</i></button
                >
              {/if}
              <button
                on:click={() => deleteGear(g.name)}
                class="px-1 pt-1 rounded-md bg-black text-white"
                ><i class="material-icons text-sm">delete</i></button
              >
            </div>
          {/if}
        </div>
        {#if foundGear && (foundGear.desc || (foundGear.playerBonuses && foundGear.playerBonuses.length > 0))}
          <div class="text-xs text-gray-600 ps-4 pb-1">
            {#if foundGear.desc && foundGear.desc !== foundGear.name}
              <div>{foundGear.desc}</div>
            {/if}
            {#if foundGear.playerBonuses && foundGear.playerBonuses.filter(b => b.editable !== false).length > 0}
              <div class="font-semibold mt-1">Bonuses:</div>
              <ul class="list-disc ps-4">
                {#each foundGear.playerBonuses.filter(b => b.editable !== false) as b}
                  <li><BonusView bonus={b} showInfo={false} /></li>
                {/each}
              </ul>
            {/if}
          </div>
        {/if}
      </li>
    {/each}
  </ul>
  <h2>Free Gear</h2>
  <ul>
    {#each freeGear as g, i}
      {@const foundGear = findAny(g.name)}
      <li class="border-b border-gray-400 py-1">
        <div
          class="flex gap-1 items-center justify-between"
        >
          <span>{i + 1 + ". "}{g.name} x {g.quantity}</span>
          <div class="flex gap-1 items-center">
            {#if foundGear && foundGear.canBeEquipped}
              <input
                title="equipped"
                type="checkbox"
                class="w-6 h-6"
                checked={g.equipped}
                disabled={!canInteractWithGear(g)}
                on:click={() => toggleEquipped(g)}
              />
            {/if}
            {#if foundGear && foundGear.editable}
              <button
                on:click={() => editCustomGear(foundGear)}
                class="px-1 pt-1 rounded-md bg-black text-white"
                ><i class="material-icons text-sm">edit</i></button
              >
            {/if}
            <button
              on:click={() => deleteGear(g.name)}
              class="px-1 pt-1 rounded-md bg-black text-white"
              ><i class="material-icons text-sm">delete</i></button
            >
          </div>
        </div>
        {#if foundGear && (foundGear.desc || (foundGear.playerBonuses && foundGear.playerBonuses.length > 0))}
          <div class="text-xs text-gray-600 ps-4 pb-1">
            {#if foundGear.desc && foundGear.desc !== foundGear.name}
              <div>{foundGear.desc}</div>
            {/if}
            {#if foundGear.playerBonuses && foundGear.playerBonuses.filter(b => b.editable !== false).length > 0}
              <div class="font-semibold mt-1">Bonuses:</div>
              <ul class="list-disc ps-4">
                {#each foundGear.playerBonuses.filter(b => b.editable !== false) as b}
                  <li><BonusView bonus={b} showInfo={false} /></li>
                {/each}
              </ul>
            {/if}
          </div>
        {/if}
      </li>
    {/each}
  </ul>
</div>

{#if showEditModal && editingGear}
  <Modal bind:showModal={showEditModal}>
    <h2 slot="header">Custom Gear</h2>
    <CustomGearForm
      gear={editingGear}
      on:finish={() => {
        showEditModal = false;
        editingGear = undefined;
      }}
    />
  </Modal>
{/if}
