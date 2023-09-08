<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    WEAPON_PROPERTIES,
    RANGE_TYPES,
    DICE_TYPES,
    SHIELD_PROPERTIES,
    STATS,
  } from "../constants";
  import type {
    Currency,
    GearInfo,
    WeaponInfo,
    ArmorInfo,
    RangeType,
    ModifyBonus,
  } from "../types";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";
  import MultiSelect from "./MultiSelect.svelte";

  const dispatch = createEventDispatcher();

  export let gear: GearInfo = undefined;
  const currGear = $pc.gear.find((g) => g.name === gear?.name);

  function getMagicWeaponModifierFromGear(g?: GearInfo): number {
    if (!g) return 0;
    let b = (g as WeaponInfo)?.playerBonuses?.find(
      (b) => b.type === "modifyAmt" && b.bonusTo === "attackRoll"
    ) as ModifyBonus | undefined;
    return b?.bonusAmount ?? 0;
  }

  function getRangeTypeFromGear(g?: GearInfo): RangeType[] {
    if (!g) return ["Close"];
    const r = (g as WeaponInfo).range;
    if (Array.isArray(r)) {
      return r;
    } else {
      return [r];
    }
  }

  const defaultViewModel = {
    // basic fields
    name: gear?.name ?? undefined,
    slots: gear?.slots?.slotsUsed ?? 1,
    cost: gear?.cost?.gp ?? 0,
    currency: "gp" as Currency,
    quantity: currGear?.quantity ?? 1,
    quantityPerSlot: gear?.slots?.perSlot ?? 1,

    showAdvanced: gear?.type !== undefined && gear?.type !== "Basic",

    // advanced fields
    gearType: gear?.type ?? "Basic",
    canBeEquipped: gear?.canBeEquipped ?? false,
    attackable: gear?.properties?.includes("Attackable") ?? false,

    // weapon fields
    weaponProperties: (gear as WeaponInfo)?.properties ?? [],
    magicWeaponModifier: getMagicWeaponModifierFromGear(gear),
    weaponType: (gear as WeaponInfo)?.weaponType ?? "Melee",
    weaponRanges: getRangeTypeFromGear(gear), // TODO
    hasOneHandedAttack: gear
      ? Boolean((gear as WeaponInfo)?.damage?.oneHanded)
      : true,
    oneHandedNumDice: (gear as WeaponInfo)?.damage?.oneHanded?.numDice ?? 1,
    oneHandedDiceType:
      (gear as WeaponInfo)?.damage?.oneHanded?.diceType ?? "d6",
    hasTwoHandedAttack: Boolean((gear as WeaponInfo)?.damage?.twoHanded),
    twoHandedNumDice: (gear as WeaponInfo)?.damage?.twoHanded?.numDice ?? 1,
    twoHandedDiceType:
      (gear as WeaponInfo)?.damage?.twoHanded?.diceType ?? "d8",

    // armor fields
    baseAC: (gear as ArmorInfo)?.ac?.base ?? 10,
    armorProperties: (gear as ArmorInfo)?.properties ?? [],
    acModifier: (gear as ArmorInfo)?.ac?.modifier ?? 0,
    armorStat: (gear as ArmorInfo)?.ac?.stat,
  };

  let vm = JSON.parse(
    JSON.stringify(defaultViewModel)
  ) as typeof defaultViewModel;

  $: weaponHasAtLeastDamage =
    vm.gearType !== "Weapon" || vm.hasOneHandedAttack || vm.hasTwoHandedAttack;

  $: canAdd = vm.name?.length > 0 && vm.quantity > 0 && weaponHasAtLeastDamage;

  $: if (vm.hasOneHandedAttack && vm.hasTwoHandedAttack) {
    if (!vm.weaponProperties.includes("Versatile")) {
      vm.weaponProperties.push("Versatile");
    }
  } else {
    const i = vm.weaponProperties.findIndex((w) => w === "Versatile");
    if (i >= 0) {
      vm.weaponProperties.splice(i, 1);
    }
  }

  $: if (
    vm.armorProperties.includes("Shield") &&
    !vm.armorProperties.includes("OneHanded") &&
    !vm.armorProperties.includes("TwoHanded")
  ) {
    vm.armorProperties.push("OneHanded");
  }

  $: if (!vm.showAdvanced) {
    vm.gearType = "Basic";
    vm.canBeEquipped = false;
    vm.attackable = false;
  }

  function reset() {
    vm = JSON.parse(
      JSON.stringify(defaultViewModel)
    ) as typeof defaultViewModel;
  }

  function createGearItem() {
    let g: GearInfo = {
      name: vm.name,
      type: vm.gearType,
      canBeEquipped: vm.canBeEquipped,
      desc: vm.name,
      slots: {
        slotsUsed: vm.slots,
        perSlot: vm.quantityPerSlot,
        freeCarry: vm.slots > 0 ? 0 : 1,
      },
      editable: true,
      playerBonuses: [],
      cost: {
        gp: 0,
        sp: 0,
        cp: 0,
        [vm.currency]: vm.cost,
      },
    };

    switch (vm.gearType) {
      case "Basic": {
        if (vm.canBeEquipped && vm.attackable) g.properties = ["Attackable"];
        break;
      }
      case "Weapon": {
        let w = g as WeaponInfo;
        w.properties = vm.weaponProperties;
        w.weaponType = vm.weaponType;
        w.range = vm.weaponRanges;
        w.canBeEquipped = true;
        w.damage = {};
        if (vm.hasOneHandedAttack) {
          w.damage.oneHanded = {
            numDice: vm.oneHandedNumDice,
            diceType: vm.oneHandedDiceType,
          };
        }
        if (vm.hasTwoHandedAttack) {
          w.damage.twoHanded = {
            numDice: vm.twoHandedNumDice,
            diceType: vm.twoHandedDiceType,
          };
        }
        if (
          vm.weaponProperties.includes("Magic") &&
          vm.magicWeaponModifier > 0
        ) {
          w.playerBonuses.push({
            name: w.name + `: +${vm.magicWeaponModifier} to atk`,
            desc: `+${vm.magicWeaponModifier} to attack rolls when ${w.name} is equipped`,
            type: "modifyAmt",
            bonusAmount: vm.magicWeaponModifier,
            bonusTo: "attackRoll",
            bonusSource: "Gear",
            editable: false,
            metadata: {
              type: "weapon",
              weapon: w.name,
            },
          });
          w.playerBonuses.push({
            name: w.name + `: +${vm.magicWeaponModifier} to dmg`,
            desc: `+${vm.magicWeaponModifier} to damage rolls when ${w.name} is equipped`,
            type: "modifyAmt",
            bonusAmount: vm.magicWeaponModifier,
            bonusTo: "damageRoll",
            bonusSource: "Gear",
            editable: false,
            metadata: {
              type: "weapon",
              weapon: w.name,
            },
          });
        }
        break;
      }
      case "Armor": {
        let a = g as ArmorInfo;
        a.properties = vm.armorProperties;
        a.canBeEquipped = true;
        a.ac = {
          base: vm.baseAC,
          modifier: vm.acModifier,
          stat: vm.armorStat,
        };
        break;
      }
    }

    if (gear) {
      for (let k in gear) {
        if (gear.hasOwnProperty(k)) {
          delete gear[k];
        }
      }
      if (g.type !== "Basic") {
        g.properties = g.properties?.filter((p) => p !== "Attackable");
      }
      Object.assign(gear, g);
      currGear.name = g.name;
      currGear.quantity = vm.quantity;
    } else {
      $pc.customGear.push(g);
      $pc.gear.push({
        name: g.name,
        quantity: vm.quantity,
      });
    }
    $pc = $pc;
    dispatch("finish");
    reset();
  }
</script>

<div class="flex flex-col gap-1">
  <label for="name">Name<span class="text-red-700">*</span></label>
  <input id="name" type="text" bind:value={vm.name} />
  <label for="slots">Slots</label>
  <input
    id="slots"
    type="number"
    inputmode="numeric"
    min="0"
    bind:value={vm.slots}
  />
  <label for="perSlot">How Many of this item take up one slot?</label>
  <input
    id="perSlot"
    type="number"
    inputmode="numeric"
    min="1"
    bind:value={vm.quantityPerSlot}
  />
  <label for="cost">Cost</label>
  <input
    id="cost"
    type="number"
    inputmode="numeric"
    min="0"
    bind:value={vm.cost}
  />
  <label for="currency">Currency</label>
  <select id="currency" bind:value={vm.currency}>
    {#each ["gp", "sp", "cp"] as currency}
      <option>{currency}</option>
    {/each}
  </select>
  <label for="quantity">Quantity<span class="text-red-700">*</span></label>
  <input
    id="quantity"
    type="number"
    inputmode="numeric"
    bind:value={vm.quantity}
    min="1"
  />
  <div class="flex gap-1 items-center">
    <input id="showAdvanced" type="checkbox" bind:checked={vm.showAdvanced} />
    <label for="showAdvanced">Advanced Options</label>
  </div>

  {#if vm.showAdvanced}
    <label for="gearType">Gear Type</label>
    <select name="gearType" bind:value={vm.gearType}>
      <option>Basic</option>
      <option>Weapon</option>
      <option>Armor</option>
    </select>

    {#if vm.gearType === "Basic"}
      <div class="flex gap-1">
        <input
          id="canBeEquipped"
          type="checkbox"
          bind:checked={vm.canBeEquipped}
        />
        <label for="canBeEquipped">Can this item be equipped?</label>
      </div>
      {#if vm.canBeEquipped}
        <div class="flex gap-1 items-center">
          <input id="attackable" type="checkbox" bind:checked={vm.attackable} />
          <label for="attackable">
            Should this item appear in <span class="pirata text-lg"
              >ATTACKS</span
            >
            when equipped?
          </label>
        </div>
      {/if}
    {:else if vm.gearType === "Weapon"}
      <label for="">Weapon Type</label>
      <select name="" id="" bind:value={vm.weaponType}>
        <option>Melee</option>
        <option>Ranged</option>
        <option value="MeleeRanged">Melee or Ranged</option>
      </select>

      <label for="weaponProperties">Weapon Properties</label>
      <MultiSelect
        id="weaponProperties"
        bind:values={vm.weaponProperties}
        options={WEAPON_PROPERTIES}
      />

      {#if vm.weaponProperties.includes("Magic")}
        <div class="flex flex-row gap-1 items-center">
          <label for="magicWeaponModifier">Magic weapon modifier: +</label>
          <input
            id="magicWeaponModifier"
            type="number"
            min="0"
            inputmode="numeric"
            bind:value={vm.magicWeaponModifier}
            class="w-10 text-center"
          />
        </div>
      {/if}

      <label for="range">Range</label>
      <MultiSelect
        id="ranges"
        bind:values={vm.weaponRanges}
        minSelected={1}
        options={RANGE_TYPES}
      />

      <label for="damage">Damage<span class="text-red-700">*</span></label>

      <div class="flex gap-1 items-center">
        <input type="checkbox" bind:checked={vm.hasOneHandedAttack} />
        <div
          class="flex gap-1 items-center"
          class:opacity-25={!vm.hasOneHandedAttack}
        >
          <div>One Handed:</div>
          <input
            disabled={!vm.hasOneHandedAttack}
            type="number"
            inputmode="numeric"
            bind:value={vm.oneHandedNumDice}
            class="w-10 text-center"
          />
          <select
            name=""
            id=""
            bind:value={vm.oneHandedDiceType}
            disabled={!vm.hasOneHandedAttack}
          >
            {#each DICE_TYPES as d}
              <option>{d}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="flex gap-1 items-center">
        <input type="checkbox" bind:checked={vm.hasTwoHandedAttack} />
        <div
          class="flex gap-1 items-center"
          class:opacity-25={!vm.hasTwoHandedAttack}
        >
          <div>Two Handed:</div>
          <input
            disabled={!vm.hasTwoHandedAttack}
            type="number"
            inputmode="numeric"
            bind:value={vm.twoHandedNumDice}
            class="w-10 text-center"
          />
          <select
            name=""
            id=""
            bind:value={vm.twoHandedDiceType}
            disabled={!vm.hasTwoHandedAttack}
          >
            {#each DICE_TYPES as d}
              <option>{d}</option>
            {/each}
          </select>
        </div>
      </div>
    {:else if vm.gearType === "Armor"}
      <label for="armorProperties">Armor Properties</label>
      <MultiSelect
        id="armorProperties"
        bind:values={vm.armorProperties}
        options={SHIELD_PROPERTIES}
      />

      <label for="baseAC">Base AC</label>
      <input type="number" inputmode="numeric" bind:value={vm.baseAC} />

      <label for="acModifier">AC Modifier</label>
      <input type="number" inputmode="numeric" bind:value={vm.acModifier} />

      <label for="armorStat">Should this armor scale with a stat?</label>
      <select name="" id="" bind:value={vm.armorStat}>
        <option value={undefined}>No</option>
        {#each STATS as s}
          <option>{s}</option>
        {/each}
      </select>
    {/if}
  {/if}

  <button
    on:click={createGearItem}
    class="px-3 hover:bg-gray-400 bg-black text-white p-2"
    class:opacity-50={!canAdd}
    disabled={!canAdd}
  >
    {#if gear}
      UPDATE
    {:else}
      ADD
    {/if}
  </button>
</div>

<style lang="postcss">
  input[type="checkbox"] {
    @apply w-5 h-5;
  }
</style>
