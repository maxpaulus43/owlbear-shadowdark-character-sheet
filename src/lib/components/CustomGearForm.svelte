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
    WeaponProperty,
    WeaponType,
    RangeType,
    DiceType,
    ShieldProperty,
    Stat,
    GearInfo,
    WeaponInfo,
    ArmorInfo,
  } from "../types";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";
  import MultiSelect from "./MultiSelect.svelte";

  const dispatch = createEventDispatcher();

  // basic fields
  let gearName: string;
  let gearSlots: number = 1;
  let gearCost: number = 0;
  let gearCurrency: Currency = "gp";
  let gearQuantity: number = 1;
  let quantityPerSlot: number = 1;

  let showAdvanced = false;

  // advanced fields
  let gearType: "Basic" | "Weapon" | "Armor" = "Basic";
  let canBeEquipped = false;
  let attackable = false;

  // weapon fields
  let weaponProperties: WeaponProperty[] = [];
  let weaponType: WeaponType = "Melee";
  let weaponRanges: RangeType[] = ["Close"];
  let magicWeaponModifier: number = 0;
  let hasOneHandedAttack: boolean = true;
  let oneHandedNumDice: number = 1;
  let oneHandedDiceType: DiceType = "d6";
  let hasTwoHandedAttack: boolean = false;
  let twoHandedNumDice: number = 1;
  let twoHandedDiceType: DiceType = "d8";

  // armor fields
  let baseAC: number = 10;
  let armorProperties: ShieldProperty[] = [];
  let acModifier: number = 0;
  let armorStat: Stat;

  $: freeCarry = gearSlots > 0 ? 0 : 1;

  $: weaponHasAtLeastDamage =
    gearType !== "Weapon" || hasOneHandedAttack || hasTwoHandedAttack;

  $: canAdd =
    gearName?.length > 0 && gearQuantity > 0 && weaponHasAtLeastDamage;

  $: if (hasOneHandedAttack && hasTwoHandedAttack) {
    if (!weaponProperties.includes("Versatile")) {
      weaponProperties = [...weaponProperties, "Versatile"];
    }
  } else {
    const i = weaponProperties.findIndex((w) => w === "Versatile");
    if (i >= 0) {
      weaponProperties.splice(i, 1);
      weaponProperties = weaponProperties;
    }
  }

  $: if (!showAdvanced) {
    gearType = "Basic";
    canBeEquipped = false;
    attackable = false;
  }

  function reset() {
    gearName = undefined;
    gearSlots = 1;
    gearCost = 0;
    gearCurrency = "gp";
    gearQuantity = 1;
    quantityPerSlot = 1;

    // advanced fields
    weaponProperties = [];
    weaponType = "Melee";
    weaponRanges = ["Close"];
    hasOneHandedAttack = true;
    oneHandedNumDice = 1;
    oneHandedDiceType = "d6";
    hasTwoHandedAttack = false;
    twoHandedNumDice = 1;
    twoHandedDiceType = "d8";
    baseAC = 10;
    armorProperties = [];
    acModifier = 0;
    armorStat = undefined;

    showAdvanced = false;
  }

  function createGearItem() {
    let g: GearInfo = {
      name: gearName,
      type: gearType,
      canBeEquipped,
      desc: gearName,
      slots: { slotsUsed: gearSlots, perSlot: quantityPerSlot, freeCarry },
      editable: true,
      playerBonuses: [],
      cost: {
        gp: 0,
        sp: 0,
        cp: 0,
        [gearCurrency]: gearCost,
      },
    };

    switch (gearType) {
      case "Basic": {
        if (canBeEquipped && attackable) g.properties = ["Attackable"];
        break;
      }
      case "Weapon": {
        let w = g as WeaponInfo;
        w.properties = weaponProperties;
        w.weaponType = weaponType;
        w.range = weaponRanges.length === 1 ? weaponRanges[0] : weaponRanges;
        w.canBeEquipped = true;
        w.damage = {};
        if (hasOneHandedAttack) {
          w.damage.oneHanded = {
            numDice: oneHandedNumDice,
            diceType: oneHandedDiceType,
          };
        }
        if (hasTwoHandedAttack) {
          w.damage.twoHanded = {
            numDice: twoHandedNumDice,
            diceType: twoHandedDiceType,
          };
        }
        if (weaponProperties.includes("Magic") && magicWeaponModifier > 0) {
          w.playerBonuses.push({
            name: w.name + `: +${magicWeaponModifier} to atk`,
            desc: `+${magicWeaponModifier} to attack rolls when ${w.name} is equipped`,
            type: "modifyAmt",
            bonusAmount: magicWeaponModifier,
            bonusTo: "attackRoll",
            bonusSource: "Gear",
            editable: true,
            metadata: {
              type: "weapon",
              weapon: w.name,
            },
          });
          w.playerBonuses.push({
            name: w.name + `: +${magicWeaponModifier} to dmg`,
            desc: `+${magicWeaponModifier} to damage rolls when ${w.name} is equipped`,
            type: "modifyAmt",
            bonusAmount: magicWeaponModifier,
            bonusTo: "damageRoll",
            bonusSource: "Gear",
            editable: true,
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
        a.properties = armorProperties;
        a.canBeEquipped = true;
        a.ac = {
          base: baseAC,
          modifier: acModifier,
          stat: armorStat,
        };
        break;
      }
    }

    $pc.customGear.push(g);
    $pc.gear.push({
      name: gearName,
      quantity: gearQuantity,
    });
    $pc = $pc;
    dispatch("finish");
    reset();
  }
</script>

<div class="flex flex-col gap-1">
  <label for="name">Name<span class="text-red-700">*</span></label>
  <input id="name" type="text" bind:value={gearName} />
  <label for="slots">Slots</label>
  <input
    id="slots"
    type="number"
    inputmode="numeric"
    min="0"
    bind:value={gearSlots}
  />
  <label for="perSlot">How Many of this item take up one slot?</label>
  <input
    id="perSlot"
    type="number"
    inputmode="numeric"
    min="1"
    bind:value={quantityPerSlot}
  />
  <label for="cost">Cost</label>
  <input
    id="cost"
    type="number"
    inputmode="numeric"
    min="0"
    bind:value={gearCost}
  />
  <label for="currency">Currency</label>
  <select id="currency" bind:value={gearCurrency}>
    {#each ["gp", "sp", "cp"] as currency}
      <option>{currency}</option>
    {/each}
  </select>
  <label for="quantity">Quantity<span class="text-red-700">*</span></label>
  <input
    id="quantity"
    type="number"
    inputmode="numeric"
    bind:value={gearQuantity}
    min="1"
  />
  <div class="flex gap-1 items-center">
    <input id="showAdvanced" type="checkbox" bind:checked={showAdvanced} />
    <label for="showAdvanced">Advanced Options</label>
  </div>

  {#if showAdvanced}
    <label for="gearType">Gear Type</label>
    <select name="gearType" bind:value={gearType}>
      <option>Basic</option>
      <option>Weapon</option>
      <option>Armor</option>
    </select>

    {#if gearType === "Basic"}
      <div class="flex gap-1">
        <input
          id="canBeEquipped"
          type="checkbox"
          bind:checked={canBeEquipped}
        />
        <label for="canBeEquipped">Can this item be equipped?</label>
      </div>
      {#if canBeEquipped}
        <div class="flex gap-1 items-center">
          <input id="attackable" type="checkbox" bind:checked={attackable} />
          <label for="attackable">
            Should this item appear in <span class="pirata text-lg"
              >ATTACKS</span
            >
            when equipped?
          </label>
        </div>
      {/if}
    {:else if gearType === "Weapon"}
      <label for="">Weapon Type</label>
      <select name="" id="" bind:value={weaponType}>
        <option>Melee</option>
        <option>Ranged</option>
        <option value="MeleeRanged">Melee or Ranged</option>
      </select>

      <label for="weaponProperties">Weapon Properties</label>
      <MultiSelect
        id="weaponProperties"
        bind:values={weaponProperties}
        options={WEAPON_PROPERTIES}
      />

      {#if weaponProperties.includes("Magic")}
        <div class="flex flex-row gap-1 items-center">
          <label for="magicWeaponModifier">Magic weapon modifier: +</label>
          <input
            id="magicWeaponModifier"
            type="number"
            min="0"
            inputmode="numeric"
            bind:value={magicWeaponModifier}
            class="w-10 text-center"
          />
        </div>
      {/if}

      <label for="range">Range</label>
      <MultiSelect
        id="ranges"
        bind:values={weaponRanges}
        minSelected={1}
        options={RANGE_TYPES}
      />

      <label for="damage">Damage<span class="text-red-700">*</span></label>

      <div class="flex gap-1 items-center">
        <input type="checkbox" bind:checked={hasOneHandedAttack} />
        <div
          class="flex gap-1 items-center"
          class:opacity-25={!hasOneHandedAttack}
        >
          <div>One Handed:</div>
          <input
            disabled={!hasOneHandedAttack}
            type="number"
            inputmode="numeric"
            bind:value={oneHandedNumDice}
            class="w-10 text-center"
          />
          <select
            name=""
            id=""
            bind:value={oneHandedDiceType}
            disabled={!hasOneHandedAttack}
          >
            {#each DICE_TYPES as d}
              <option>{d}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="flex gap-1 items-center">
        <input type="checkbox" bind:checked={hasTwoHandedAttack} />
        <div
          class="flex gap-1 items-center"
          class:opacity-25={!hasTwoHandedAttack}
        >
          <div>Two Handed:</div>
          <input
            disabled={!hasTwoHandedAttack}
            type="number"
            inputmode="numeric"
            bind:value={twoHandedNumDice}
            class="w-10 text-center"
          />
          <select
            name=""
            id=""
            bind:value={twoHandedDiceType}
            disabled={!hasTwoHandedAttack}
          >
            {#each DICE_TYPES as d}
              <option>{d}</option>
            {/each}
          </select>
        </div>
      </div>
    {:else if gearType === "Armor"}
      <label for="armorProperties">Armor Properties</label>
      <MultiSelect
        id="armorProperties"
        bind:values={armorProperties}
        options={SHIELD_PROPERTIES}
      />

      <label for="baseAC">Base AC</label>
      <input type="number" inputmode="numeric" bind:value={baseAC} />

      <label for="acModifier">AC Modifier</label>
      <input type="number" inputmode="numeric" bind:value={acModifier} />

      <label for="armorStat">Should this armor scale with a stat?</label>
      <select name="" id="" bind:value={armorStat}>
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
    ADD
  </button>
</div>

<style lang="postcss">
  input[type="checkbox"] {
    @apply w-5 h-5;
  }
</style>
