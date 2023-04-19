<script lang="ts">
  import AddGearButton from "./AddGearButton.svelte";
  import { findAny } from "../compendium";
  import type { Gear } from "../model/Gear";
  import {
    calculateGearSlotsForPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import { alphabetically } from "../utils";

  $: costlyGear = $pc.gear
    .filter((g) => findAny(g.name)?.slots.freeCarry === 0)
    .sort((a, b) => alphabetically(a.name, b.name));

  $: freeGear = $pc.gear
    .filter((g) => findAny(g.name)?.slots.freeCarry)
    .sort((a, b) => alphabetically(a.name, b.name));

  $: totalSlots = calculateGearSlotsForPlayer($pc);

  $: freeSlots =
    totalSlots -
    costlyGear.reduce((acc, curr) => {
      return acc + slotsForGear(curr);
    }, 0);

  function slotsForGear(g: Gear): number {
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
</script>

<div class="flex gap-1 p-1">
  <h2>GEAR</h2>
  <span>({totalSlots} slots, {freeSlots} free)</span>
  <AddGearButton />
</div>

<div
  class="overflow-scroll flex flex-col gap-1 p-2"
  style="box-shadow: inset 0 0 5px #000;"
>
  <ul>
    {#each costlyGear as g, i}
      <li>
        <div
          class="flex gap-1 items-center justify-between border-b border-gray-400"
        >
          <div class="flex justify-between">
            <span>
              {i + 1}. {g.name} x {g.quantity} ({slotsForGear(g)} slots)
            </span>
          </div>
          <button
            on:click={() => deleteGear(g.name)}
            class="px-1 pt-1 rounded-md bg-black text-white"
            ><i class="material-icons">delete</i></button
          >
        </div>
      </li>
    {/each}
  </ul>
  <h2>Free Gear</h2>
  <ul>
    {#each freeGear as g, i}
      <li>
        <div
          class="flex gap-1 items-center justify-between border-b border-gray-400"
        >
          <span>{i + 1 + ". "}{g.name} x {g.quantity}</span>
          <button
            on:click={() => deleteGear(g.name)}
            class="px-1 pt-1 rounded-md bg-black text-white"
            ><i class="material-icons">delete</i></button
          >
        </div>
      </li>
    {/each}
  </ul>
</div>
