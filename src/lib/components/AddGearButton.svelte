<script lang="ts">
  import GEAR_COMPENDIUM from "../compendium/basicGearCompendium";
  import { findAny } from "../compendium";
  import ARMOR_COMPENDIUM from "../compendium/armorCompendium";
  import WEAPON_COMPENDIUM from "../compendium/weaponCompendium";
  import type { Gear, GearInfo } from "../model/Gear";
  import {
    calculateGearSlotsForPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import { alphabetically } from "../utils";
  import CustomGearForm from "./CustomGearForm.svelte";
  import Modal from "./Modal.svelte";

  let showModal = false;

  $: costlyGear = $pc.gear
    .filter((g) => findAny(g.name)?.slots?.freeCarry === 0)
    .sort((a, b) => alphabetically(a.name, b.name));

  $: totalSlots = calculateGearSlotsForPlayer($pc);

  $: freeSlots =
    totalSlots -
    costlyGear.reduce((acc, curr) => {
      return acc + slotsForGear(curr);
    }, 0);

  function slotsForGear(g: Gear): number {
    const foundGear = findAny(g.name);
    if (!foundGear) {
      console.log("Cannot find gear: " + g.name);
      return 0;
    }
    return (
      Math.ceil(g.quantity / foundGear.slots.perSlot) *
      foundGear.slots.slotsUsed
    );
  }

  let gearInput: string = "";
  $: gearResults = Object.values(GEAR_COMPENDIUM).filter((g) =>
    g.name.toLowerCase().includes(gearInput.toLowerCase())
  );
  $: armorResults = Object.values(ARMOR_COMPENDIUM).filter((a) =>
    a.name.toLowerCase().includes(gearInput.toLowerCase())
  );
  $: weaponResults = Object.values(WEAPON_COMPENDIUM).filter((w) =>
    w.name.toLowerCase().includes(gearInput.toLowerCase())
  );
  $: customResults =
    $pc.customGear?.filter((g) =>
      g.name.toLowerCase().includes(gearInput.toLowerCase())
    ) ?? [];
  $: allResults = gearResults
    .concat(armorResults)
    .concat(weaponResults)
    .concat(customResults);

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

  function getSlots(g: GearInfo) {
    return g.slots.freeCarry ? 0 : g.slots.slotsUsed;
  }

  function getCostForGear(g: GearInfo): string {
    const { gp, sp, cp } = g.cost;
    let gpStr: string, spStr: string, cpStr: string;
    if (gp) gpStr = `${gp}gp`;
    if (sp) spStr = `${sp}sp`;
    if (cp) cpStr = `${cp}cp`;
    return [gpStr, spStr, cpStr].join(" ");
  }

  function deleteCustomGear(gear: GearInfo) {
    $pc.gear = $pc.gear.filter((g) => g.name !== gear.name);
    $pc.customGear = $pc.customGear.filter((g) => g.name !== gear.name);
  }
</script>

<button
  class="bg-black text-white px-3 rounded-md"
  on:click={() => (showModal = true)}>Add Gear</button
>

<Modal bind:showModal>
  <h1 slot="header" class="min-w-[300px]">Gear</h1>
  <div class="border-b flex flex-col gap-1 h-max">
    <div class="w-full flex gap-1">
      <input
        class="w-full"
        type="text"
        bind:value={gearInput}
        placeholder="search e.g. Torch"
      />
      {#if gearInput.length > 0}
        <button
          on:click={() => (gearInput = "")}
          class="bg-black text-white rounded-md px-1"
        >
          <i class="material-icons translate-y-1">cancel</i>
        </button>
      {/if}
    </div>
    <div class="h-64 overflow-y-auto">
      <table class="w-full">
        <thead class="text-left sticky top-0 bg-white">
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Slots</th>
          </tr>
        </thead>
        <tbody>
          {#each allResults as g, i}
            <tr class="border-b" class:bg-gray-100={i % 2 == 0}>
              <td class="pl-3">{g.name}</td>
              <td>{getCostForGear(g)}</td>
              <td>{g.slots.freeCarry ? "Free" : g.slots.slotsUsed}</td>
              <td class="flex justify-end">
                {#if g.editable}
                  <button
                    class="bg-black rounded-md text-white px-1 text-xs"
                    on:click={() => deleteCustomGear(g)}
                    ><i class="material-icons">delete</i></button
                  >
                {/if}
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
