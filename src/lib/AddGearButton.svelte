<script lang="ts">
  import {
    ARMOR_GEAR,
    BASIC_GEAR,
    WEAPON_GEAR,
    type Gear,
    type GearInfo,
    findGear,
  } from "../types";
  import CustomGearForm from "./CustomGearForm.svelte";
  import Modal from "./Modal.svelte";
  import {
    calculateGearSlotsForPlayer,
    PlayerCharacterStore as pc,
  } from "./PlayerCharacter";
  import { alphabetically } from "./utils";
  let showModal = false;

  $: costlyGear = $pc.gear
    .filter((g) => findGear(g.name)?.slots.freeCarry === 0)
    .sort((a, b) => alphabetically(a.name, b.name));

  $: totalSlots = calculateGearSlotsForPlayer($pc);

  $: freeSlots =
    totalSlots -
    costlyGear.reduce((acc, curr) => {
      return acc + slotsForGear(curr);
    }, 0);

  function slotsForGear(g: Gear): number {
    const info = findGear(g.name);
    return Math.ceil(g.quantity / info.slots.perSlot) * info.slots.slotsUsed;
  }

  let gearInput: string = "";
  $: gearResults = Object.values(BASIC_GEAR)
    .filter((g) => g.name.toLowerCase().includes(gearInput.toLowerCase()))
    .concat(
      Object.values(ARMOR_GEAR).filter((a) =>
        a.name.toLowerCase().includes(gearInput.toLowerCase())
      )
    )
    .concat(
      Object.values(WEAPON_GEAR).filter((w) =>
        w.name.toLowerCase().includes(gearInput.toLowerCase())
      )
    );

  function addGear(g: GearInfo) {
    const existingGear = $pc.gear.find(
      (existingG) => existingG.name === g.name
    );
    if (existingGear) {
      existingGear.quantity++;
    } else {
      const gear: Gear = { name: g.name, quantity: 1 };
      $pc.gear.push(gear);
    }
    $pc = $pc;
  }

  function getCostForGear(g: GearInfo): string {
    const { gp, sp, cp } = g.cost;
    let gpStr: string, spStr: string, cpStr: string;
    if (gp) gpStr = `${gp}gp`;
    if (sp) spStr = `${sp}sp`;
    if (cp) cpStr = `${cp}cp`;
    return [gpStr, spStr, cpStr].join(" ");
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
        <thead class="text-left sticky top-0 bg-white">
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
              <td>{getCostForGear(g)}</td>
              <td>{g.slots.freeCarry ? "Free" : g.slots.slotsUsed}</td>
              <td class="flex justify-end">
                <button
                  disabled={freeSlots < slotsForGear(g)}
                  on:click={() => addGear(g)}
                  class:opacity-20={freeSlots < slotsForGear(g)}
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
