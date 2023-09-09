<script lang="ts">
  import ARMOR_COMPENDIUM from "../../compendium/armorCompendium";
  import GEAR_COMPENDIUM from "../../compendium/basicGearCompendium";
  import WEAPON_COMPENDIUM from "../../compendium/weaponCompendium";
  import { canPlayerAffordGear } from "../../model/PlayerCharacter";
  import type { GearInfo, Gear } from "../../types";
  import { pc } from "../../model/PlayerCharacter";
  import Modal from "../Modal.svelte";
  import CustomGearForm from "./CustomGearForm.svelte";

  let gear: GearInfo = undefined;
  let showCustomGearEditModal = false;

  let showOnlyWhatICanAfford = false;
  let showWeapon = true;
  let showArmor = true;
  let showBasic = true;
  let showCustom = false;

  let gearInput: string = "";
  $: allResults = Object.values(GEAR_COMPENDIUM)
    .concat(Object.values(ARMOR_COMPENDIUM))
    .concat(Object.values(WEAPON_COMPENDIUM))
    .concat($pc.customGear ?? [])
    .filter((g) => {
      if (showCustom && !$pc.customGear.find((cg) => cg.name === g.name))
        return false;
      if (!showWeapon && g.type === "Weapon") return false;
      if (!showArmor && g.type === "Armor") return false;
      if (!showBasic && g.type === "Basic") return false;
      if (showOnlyWhatICanAfford && !canPlayerAffordGear($pc, g)) return false;
      return g.name.toLowerCase().includes(gearInput.toLowerCase());
    });

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

  function deleteCustomGear(gear: GearInfo) {
    $pc.gear = $pc.gear.filter((g) => g.name !== gear.name);
    $pc.bonuses = $pc.bonuses.filter((b) => {
      if (b.metadata?.type === "weapon" && b.metadata.weapon === gear.name)
        return false;
      if (b.metadata?.type === "armor" && b.metadata.armor === gear.name)
        return false;
      return true;
    });
    $pc.customGear = $pc.customGear.filter((g) => g.name !== gear.name);
  }
</script>

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
  <div class="flex gap-1 items-center flex-wrap">
    <div class="font-bold">Filter:</div>
    <input id="showWeapon" type="checkbox" bind:checked={showWeapon} />
    <label for="showWeapon">Weapon</label>
    <input id="showArmor" type="checkbox" bind:checked={showArmor} />
    <label for="showArmor">Armor</label>
    <input id="showBasic" type="checkbox" bind:checked={showBasic} />
    <label for="showBasic">Basic</label>
    <input id="showCustom" type="checkbox" bind:checked={showCustom} />
    <label for="showCustom">Custom</label>
    <input
      id="showAffordable"
      type="checkbox"
      bind:checked={showOnlyWhatICanAfford}
    />
    <label for="showAffordable">Affordable</label>
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
            <td class="flex justify-end gap-1">
              {#if g.editable}
                <button
                  class="bg-black rounded-md text-white px-1 text-xs"
                  on:click={() => deleteCustomGear(g)}
                  ><i class="material-icons">delete</i></button
                >
                <button
                  class="bg-black rounded-md text-white px-1 text-xs"
                  on:click={() => {
                    gear = g;
                    showCustomGearEditModal = true;
                  }}><i class="material-icons">edit</i></button
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
</div>

{#if showCustomGearEditModal && gear}
  <Modal bind:showModal={showCustomGearEditModal}>
    <h2 slot="header">Custom Gear</h2>
    <CustomGearForm
      {gear}
      on:finish={() => {
        showCustomGearEditModal = false;
        gear = undefined;
      }}
    />
  </Modal>
{/if}
