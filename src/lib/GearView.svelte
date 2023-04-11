<script lang="ts">
  import type { Gear } from "../types";
  import AddGearButton from "./AddGearButton.svelte";
  import { PlayerCharacterStore as pc } from "./PlayerCharacter";

  let gear: Gear[];
  $: {
    gear = [];
    for (const g of $pc.gear) {
      for (let i = 0; i < g.quantity; i++) {
        gear.push({
          ...g,
          quantity: 1,
          slots: Math.floor(g.slots / g.quantity),
        });
      }
    }
  }
  $: costlyGear = gear.filter((g) => g.slots > 0);
  $: freeGear = gear.filter((g) => g.slots === 0);

  function deleteGearByID(id: string) {
    const idx = $pc.gear.findIndex((g) => g.gearId === id);
    const g = $pc.gear[idx];
    if (g.quantity > 1) {
      const slotPerItem = g.slots / g.quantity;
      g.quantity -= 1;
      g.totalUnits -= 1;
      g.slots -= slotPerItem;
    } else {
      $pc.gear.splice(idx, 1);
    }
    $pc = $pc;
  }
</script>

<div class="overflow-scroll">
  <ul>
    {#each costlyGear as g, i}
      <li>
        <div
          class="flex gap-1 items-center justify-between border-b border-gray-400"
        >
          <span>{i + 1 + ". "}{g.name} ({g.slots} slots)</span>
          <button
            on:click={() => deleteGearByID(g.gearId)}
            class="px-1 pt-1 rounded-md bg-black text-white"
            ><i class="material-icons">delete</i></button
          >
        </div>
      </li>
    {/each}
  </ul>
  <div>Free Gear</div>
  <ul>
    {#each freeGear as g, i}
      <li>
        <div
          class="flex gap-1 items-center justify-between border-b border-gray-400"
        >
          <span>{i + 1 + ". "}{g.name} ({g.slots} slots)</span>
          <button
            on:click={() => deleteGearByID(g.gearId)}
            class="px-1 pt-1 rounded-md bg-black text-white"
            ><i class="material-icons">delete</i></button
          >
        </div>
      </li>
    {/each}
  </ul>
  <AddGearButton />
</div>
