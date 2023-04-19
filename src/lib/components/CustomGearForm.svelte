<script lang="ts">
  import type { Currency } from "../model/Gear";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";

  let customGearName: string;
  let customGearSlots: number = 1;
  let customGearCost: number = 0;
  let customGearCurrency: Currency = "sp";
  let customGearQuantity: number = 1;

  $: canAdd = customGearName?.length > 0 && customGearQuantity > 0;

  function createGearItem() {
    // $pc.gear.push({
    //   gearId: customGearName,
    //   quantity: customGearQuantity,
    //   slots: customGearSlots * customGearQuantity,
    //   totalUnits: customGearQuantity,
    //   cost: customGearCost,
    //   currency: customGearCurrency,
    //   name: customGearName,
    //   type: "custom",
    // });
    $pc = $pc;
  }
</script>

<div class="flex gap-1 items-center">
  <div>
    <div>Add Custom Gear</div>
    <input type="text" bind:value={customGearName} class="border p-1" />
  </div>
  <div>
    <div>Slots</div>
    <input
      type="number"
      min="0"
      bind:value={customGearSlots}
      class="border p-1 w-12"
    />
  </div>
  <div>
    <div>Cost</div>
    <input
      type="number"
      min="0"
      bind:value={customGearCost}
      class="border p-1 w-20"
    />
  </div>
  <div>
    <div>Currency</div>
    <select bind:value={customGearCurrency} class="border p-1 w-20 pt-2">
      {#each ["gp", "sp", "cp"] as currency}
        <option>{currency}</option>
      {/each}
    </select>
  </div>
  <div>
    <div>Quantity</div>
    <input
      type="number"
      bind:value={customGearQuantity}
      min="0"
      class="border p-1 w-20"
    />
  </div>
  <button
    on:click={createGearItem}
    class="translate-y-3.5 px-3 hover:bg-gray-400"
    class:opacity-20={!canAdd}
    disabled={!canAdd}
  >
    <i class="material-icons translate-y-1">add_circle</i>
  </button>
</div>
