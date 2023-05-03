<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Currency, GearProperty } from "../model/Gear";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";

  const dispatch = createEventDispatcher();

  let customGearName: string;
  let customGearSlots: number = 1;
  let customGearCost: number = 0;
  let customGearCurrency: Currency = "sp";
  let customGearQuantity: number = 1;
  let customPerSlot: number = 1;
  let isAttack = false;
  let canBeEquipped = false;

  $: freeCarry = customGearSlots > 0 ? 0 : 1;
  $: canAdd = customGearName?.length > 0 && customGearQuantity > 0;

  function reset() {
    customGearName = undefined;
    customGearSlots = 1;
    customGearCost = 0;
    customGearCurrency = "sp";
    customGearQuantity = 1;
    customPerSlot = 1;
    isAttack = false;
    canBeEquipped = false;
  }

  function createGearItem() {
    const properties: GearProperty[] = [];

    if (isAttack) properties.push("Attackable");

    $pc.customGear.push({
      name: customGearName,
      type: "Basic",
      canBeEquipped,
      properties,
      desc: customGearName,
      slots: { slotsUsed: customGearSlots, perSlot: customPerSlot, freeCarry },
      editable: true,
      cost: {
        gp: 0,
        sp: 0,
        cp: 0,
        [customGearCurrency]: customGearCost,
      },
    });
    $pc.gear.push({
      name: customGearName,
      quantity: customGearQuantity,
    });
    $pc = $pc;
    dispatch("finish");
    reset();
  }
</script>

<div class="flex flex-col gap-1">
  <label for="name">Add Custom Gear</label>
  <input id="name" type="text" bind:value={customGearName} />
  <label for="slots">Slots</label>
  <input
    id="slots"
    type="number"
    inputmode="numeric"
    min="0"
    bind:value={customGearSlots}
  />
  <label for="perSlot">How Many of this item take up one slot?</label>
  <input
    id="perSlot"
    type="number"
    inputmode="numeric"
    min="1"
    bind:value={customPerSlot}
  />
  <label for="cost">Cost</label>
  <input
    id="cost"
    type="number"
    inputmode="numeric"
    min="0"
    bind:value={customGearCost}
  />
  <label for="currency">Currency</label>
  <select id="currency" bind:value={customGearCurrency}>
    {#each ["gp", "sp", "cp"] as currency}
      <option>{currency}</option>
    {/each}
  </select>
  <label for="quantity">Quantity</label>
  <input
    id="quantity"
    type="number"
    inputmode="numeric"
    bind:value={customGearQuantity}
    min="0"
  />
  <div class="flex gap-1">
    <input id="canBeEquipped" type="checkbox" bind:checked={canBeEquipped} />
    <label for="canBeEquipped">Can This item be equipped?</label>
  </div>
  {#if canBeEquipped}
    <div class="flex gap-1">
      <input id="isAttack" type="checkbox" bind:checked={isAttack} />
      <label for="isAttack"
        >Should this item appear in <span class="pirata text-lg">ATTACKS</span> when
        equipped?</label
      >
    </div>
  {/if}
  <button
    on:click={createGearItem}
    class="px-3 hover:bg-gray-400 bg-black text-white p-2"
    class:opacity-50={!canAdd}
    disabled={!canAdd}
  >
    ADD
  </button>
</div>
