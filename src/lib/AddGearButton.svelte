<script lang="ts">
  import type { Currency } from "../types";
  import Modal from "./Modal.svelte";
  import { PlayerCharacterStore as pc } from "./PlayerCharacter";
  let showModal = false;

  let customGearName: string;
  let customGearSlots: number;
  let customGearCost: number;
  let customeGearCurrency: Currency;

  function createGearItem() {
    $pc.gear.push({
      gearId: customGearName,
      quantity: 1,
      slots: customGearSlots,
      totalUnits: 1,
      cost: customGearCost,
      currency: customeGearCurrency,
      name: customGearName,
      type: "sundry",
    });
    $pc = $pc;
  }
</script>

<button
  class="bg-black text-white p-2 w-full"
  on:click={() => (showModal = true)}>Add Gear</button
>

<Modal bind:showModal>
  <h2 slot="header" class="text-lg font-bold">New Gear</h2>
  <div class="flex gap-1 items-center">
    <div>
      <div>Custom Gear</div>
      <input type="text" bind:value={customGearName} class="border p-1" />
    </div>
    <div>
      <div>Slots</div>
      <input
        type="number"
        bind:value={customGearSlots}
        class="border p-1 w-12"
      />
    </div>
    <div>
      <div>Cost</div>
      <input
        type="number"
        bind:value={customGearCost}
        class="border p-1 w-20"
      />
    </div>
    <div>
      <div>Currency</div>
      <select>
        {#each ["gp", "sp", "cp"] as currency}
          <option>{currency}</option>
        {/each}
      </select>
      <button on:click={createGearItem}>
        <i class="material-icons">add_circle</i>
      </button>
    </div>
  </div></Modal
>
