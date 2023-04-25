<script lang="ts">
  import type { Currency } from "../model/Gear";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";

  let customGearName: string;
  let customGearSlots: number = 1;
  let customGearCost: number = 0;
  let customGearCurrency: Currency = "sp";
  let customGearQuantity: number = 1;
  let showForm = false;

  $: freeCarry = customGearSlots > 0 ? 0 : 1;
  $: canAdd = customGearName?.length > 0 && customGearQuantity > 0;

  function createGearItem() {
    $pc.customGear.push({
      name: customGearName,
      type: "Basic",
      canBeEquipped: false,
      desc: customGearName,
      slots: { slotsUsed: customGearSlots, perSlot: 1, freeCarry },
      cost: {
        gp: 0,
        sp: 0,
        cp: 0,
        [customGearCurrency]: customGearCost,
      },
    });
    $pc.gear.push({
      name: customGearName,
      quantity: 1,
    });
    $pc = $pc;
  }
</script>

<button
  class="w-full text-center bg-black text-white"
  on:click={() => {
    showForm = !showForm;
  }}>{showForm ? "Hide " : "Create "}Custom Gear</button
>

{#if showForm}
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
    <button
      on:click={createGearItem}
      class="px-3 hover:bg-gray-400 bg-black text-white"
      class:opacity-50={!canAdd}
      disabled={!canAdd}
    >
      ADD
    </button>
  </div>
{/if}
