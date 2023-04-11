<script lang="ts">
  import { GEAR, type Currency, type Gear, type GearImpl } from "../types";
  import CustomGearForm from "./CustomGearForm.svelte";
  import Modal from "./Modal.svelte";
  import { PlayerCharacterStore as pc } from "./PlayerCharacter";
  let showModal = false;

  let customGearName: string;
  let customGearSlots: number = 1;
  let customGearCost: number = 0;
  let customGearCurrency: Currency = "sp";
  let customGearQuantity: number = 1;

  $: canAdd = customGearName?.length > 0;

  function createGearItem() {
    $pc.gear.push({
      gearId: customGearName,
      quantity: customGearQuantity,
      slots: customGearSlots * customGearQuantity,
      totalUnits: customGearQuantity,
      cost: customGearCost,
      currency: customGearCurrency,
      name: customGearName,
      type: "custom",
    });
    $pc = $pc;
  }

  let gearInput: string = "";
  $: gearResults = GEAR.filter((g) =>
    g.name.toLowerCase().includes(gearInput.toLowerCase())
  );

  function addGear(g: GearImpl) {
    $pc.gear.push({
      ...g,
      quantity: 1,
      totalUnits: g.slots,
    });
    $pc = $pc;
  }
</script>

<button
  class="bg-black text-white px-3 rounded-md"
  on:click={() => (showModal = true)}>Add Gear</button
>

<Modal bind:showModal>
  <h2 slot="header" class="text-lg font-bold">Gear</h2>
  <div class="border-b flex flex-col gap-1">
    <input
      class="p-1 w-full border"
      type="text"
      bind:value={gearInput}
      placeholder="search e.g. Torch"
    />
    <div class="h-48 overflow-y-auto">
      <table class="w-full">
        <thead class="text-left">
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Slots</th>
          </tr>
        </thead>
        <tbody>
          {#each gearResults as g, i}
            <tr class="border-b" class:bg-gray-100={i % 2 == 0}>
              <td class="pl-3">{g.name}</td>
              <td>{g.cost}{g.currency}</td>
              <td>{g.slots}</td>
              <td class="flex justify-end">
                <button
                  on:click={() => addGear(g)}
                  class="px-3 hover:bg-gray-400"
                >
                  <i class="material-icons translate-y-1">add_circle</i>
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="border shadow-md p-2">
      <CustomGearForm />
    </div>
  </div>
</Modal>
