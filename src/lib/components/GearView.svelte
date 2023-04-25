<script lang="ts">
  import AddGearButton from "./AddGearButton.svelte";
  import { findAny } from "../compendium";
  import type { Gear } from "../model/Gear";
  import {
    calculateGearSlotsForPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import { alphabetically } from "../utils";
  import type { WeaponInfo } from "../model/Weapon";

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

  function toggleEquipped(g: Gear) {
    g.equipped = !g.equipped;
    $pc = $pc;
  }

  function canInteractWithGear(gear: Gear): boolean {
    if (gear.equipped) return true;
    const g = findAny(gear.name);
    if (!g || !g.canBeEquipped) return false;
    if (g.type === "Weapon") {
      const equippedWeapons = $pc.gear
        .filter((w) => w.equipped)
        .map((w) => findAny(w.name))
        .filter((w) => w.type === "Weapon")
        .map((w) => w as WeaponInfo);
      if (equippedWeapons.length == 0) return true; // no equipped weapons means i can equip
      if (equippedWeapons.length > 1) return false; // more than 1 equpped weapons means i can't equip
      // at this point, we know that there is exactly 1 equipped weapon.
      const isEquippedWeaponTwoHanded = !equippedWeapons[0].damage.oneHanded;
      const isNewWeaponTwoHanded = !(g as WeaponInfo).damage.oneHanded;
      if (isEquippedWeaponTwoHanded || isNewWeaponTwoHanded) return false; // holding a two handed means I can't equip
      return true;
    } else if (g.type === "Armor") {
      const equippedArmor = $pc.gear
        .filter((a) => a.equipped)
        .map((a) => findAny(a.name))
        .filter((a) => a.type === "Armor");
      return equippedArmor.length === 0; // must not be wearing armor
    }
    return false;
  }
</script>

<div class="flex gap-1 p-1">
  <h2>GEAR</h2>
  <span>({totalSlots} slots, {freeSlots} free)</span>
  <AddGearButton />
</div>

<div class="flex gap-1">
  <div class="flex items-center">
    <div>GP:</div>
    <input
      type="number"
      bind:value={$pc.gold}
      class="bg-gray-200 rounded-md p-1 w-16"
    />
  </div>
  <div class="flex items-center">
    <div>SP:</div>
    <input
      type="number"
      bind:value={$pc.silver}
      class="bg-gray-200 rounded-md p-1 w-16"
    />
  </div>
  <div class="flex items-center">
    <div>CP:</div>
    <input
      type="number"
      bind:value={$pc.copper}
      class="bg-gray-200 rounded-md p-1 w-16"
    />
  </div>
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
          <div class="flex gap-1 items-center">
            {#if findAny(g.name).canBeEquipped}
              <input
                title="equipped"
                type="checkbox"
                class="w-6 h-6"
                checked={g.equipped}
                disabled={!canInteractWithGear(g)}
                on:click={() => toggleEquipped(g)}
              />
            {/if}
            <button
              on:click={() => deleteGear(g.name)}
              class="px-1 pt-1 rounded-md bg-black text-white"
              ><i class="material-icons">delete</i></button
            >
          </div>
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
