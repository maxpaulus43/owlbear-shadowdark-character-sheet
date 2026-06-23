<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ARMORS } from "../../compendium/armorCompendium";
  import { SPELLS } from "../../compendium/spellCompendium";
  import { WEAPONS } from "../../compendium/weaponCompendium";
  import {
    BONUS_TOS,
    DICE_TYPES,
    STATS,
  } from "../../constants";
  import { pc } from "../../model/PlayerCharacter";
  import type {
    WeaponInfo,
    ArmorInfo,
    Bonus,
    BonusTo,
    BonusMetaData,
    DiceType,
    Stat,
    WeaponType,
  } from "../../types";

  const dispatch = createEventDispatcher();

  $: allWeapons = WEAPONS.concat(
    $pc.customGear
      .filter((g) => g.type === "Weapon")
      .map((g) => g as WeaponInfo) ?? []
  );

  $: allArmors = ARMORS.concat(
    $pc.customGear
      .filter((g) => g.type === "Armor")
      .map((g) => g as ArmorInfo) ?? []
  );

  $: allSpells = SPELLS.concat($pc.customSpells ?? []);

  let type: Bonus["type"] = "modifyAmt";
  let bonusTo: BonusTo = "attackRoll";
  let bonusAmount: number = 1;
  let mdType: BonusMetaData["type"] | "" = "";
  let diceType: DiceType = "d8";
  let selectedWeapon: string = "";
  let selectedArmor: string = "";
  let selectedSpell: string = "";
  let selectedStat: Stat | "" = "";
  let weaponType: WeaponType | "" = "";
  let desc: string = "";

  $: if (bonusTo) {
    selectedWeapon = "";
    selectedArmor = "";
    selectedSpell = "";
    selectedStat = "";
    weaponType = "";
  }

  $: validBonusTos = BONUS_TOS;

  $: if (type) {
    if (type !== "generic" && !validBonusTos.includes(bonusTo as any)) {
      bonusTo = validBonusTos[0];
    }
  }

  let reqsMet = false;
  $: {
    if (type === "generic") {
      reqsMet = Boolean(desc);
    } else if (bonusTo === "stat" || bonusTo === "statRoll") {
      mdType = "stat";
      reqsMet = Boolean(selectedStat);
    } else {
      if (mdType === "stat") mdType = "";
      reqsMet = true;
    }
  }

  function addBonus() {
    let b: Bonus;
    const name = "";
    switch (type) {
      case "generic":
        b = { name, desc, type };
        break;
      case "modifyAmt":
        b = { name, desc: "", type, bonusTo, bonusAmount };
        break;
      case "advantage":
      case "disadvantage": {
        b = { name, desc: "", type, bonusTo };
        break;
      }
      case "diceType":
        b = { name, desc: "", type, bonusTo, diceType };
        break;
    }
    if (type !== "generic") {
      switch (mdType) {
        case "weapon":
          if (selectedWeapon)
            b.metadata = { type: mdType, weapon: selectedWeapon };
          break;
        case "weaponType":
          if (weaponType) b.metadata = { type: mdType, weaponType };
          break;
        case "armor":
          if (selectedArmor) b.metadata = { type: mdType, armor: selectedArmor };
          break;
        case "stat":
          if (selectedStat) b.metadata = { type: mdType, stat: selectedStat };
          break;
        case "spell":
          if (selectedSpell) b.metadata = { type: mdType, spell: selectedSpell };
          break;
      }
    }
    dispatch("add", b);
  }
</script>

<div class="flex flex-col gap-1 w-full border p-3 bg-gray-50 rounded-md mt-2 text-sm text-black">
  <div class="font-bold border-b pb-1">Configure New Bonus</div>

  <label for="sub-type" class="mt-1 font-semibold">Bonus Type</label>
  <select id="sub-type" bind:value={type}>
    <option value="modifyAmt">Numerical Modifier</option>
    <option value="advantage">Advantage</option>
    <option value="disadvantage">Disadvantage</option>
    <option value="diceType">Dice Type</option>
    <option value="generic">Generic</option>
  </select>

  {#if type === "generic"}
    <label for="sub-desc" class="font-semibold">Description</label>
    <input
      id="sub-desc"
      type="text"
      placeholder="e.g. You can't be surprised"
      bind:value={desc}
      class="border p-1 rounded"
    />
  {:else}
      <label for="sub-bto" class="font-semibold">Bonus To</label>
      <select id="sub-bto" bind:value={bonusTo}>
        {#each BONUS_TOS as bto}
          <option>{bto}</option>
        {/each}
      </select>

    {#if type === "modifyAmt"}
      <label for="sub-modifyAmt" class="font-semibold">Amount</label>
      <input
        id="sub-modifyAmt"
        type="number"
        inputmode="numeric"
        bind:value={bonusAmount}
        class="border p-1 rounded"
      />
    {:else if type === "diceType"}
      <label for="sub-diceType" class="font-semibold">Dice Type</label>
      <select id="sub-diceType" bind:value={diceType}>
        {#each DICE_TYPES as d}
          <option>{d}</option>
        {/each}
      </select>
    {/if}

    {#if bonusTo !== "stat" && bonusTo !== "statRoll"}
      <label for="sub-metaDataType" class="font-semibold">Targets a specific item, spell, or stat?</label>
      <select id="sub-metaDataType" bind:value={mdType}>
        <option value="">No</option>
        <option value="weapon">Equipped Weapon</option>
        <option value="armor">Equipped Armor</option>
        <option value="spell">Spell</option>
        <option value="stat">Stat</option>
        <option value="weaponType">Weapon Type</option>
      </select>
    {/if}

    {#if mdType === "weapon"}
      <label for="sub-weapon" class="font-semibold">Which weapon?</label>
      <select id="sub-weapon" bind:value={selectedWeapon}>
        <option value="">Select Weapon</option>
        {#each allWeapons as w}
          <option>{w.name}</option>
        {/each}
      </select>
    {:else if mdType === "armor"}
      <label for="sub-armor" class="font-semibold">Which armor?</label>
      <select id="sub-armor" bind:value={selectedArmor}>
        <option value="">Select Armor</option>
        {#each allArmors as a}
          <option>{a.name}</option>
        {/each}
      </select>
    {:else if mdType === "spell"}
      <label for="sub-spell" class="font-semibold">Which spell?</label>
      <select id="sub-spell" bind:value={selectedSpell}>
        <option value="">Select Spell</option>
        {#each allSpells as s}
          <option>{s.name}</option>
        {/each}
      </select>
    {:else if mdType === "stat" || bonusTo === "stat" || bonusTo === "statRoll"}
      <label for="sub-stat" class="font-semibold">Which stat?</label>
      <select id="sub-stat" bind:value={selectedStat}>
        <option value="">Select Stat</option>
        {#each STATS as s}
          <option>{s}</option>
        {/each}
      </select>
    {:else if mdType === "weaponType"}
      <label for="sub-weaponType" class="font-semibold">Which weapon type?</label>
      <select id="sub-weaponType" bind:value={weaponType}>
        <option value="">Select Type</option>
        {#each ["Melee", "Ranged"] as s}
          <option>{s}</option>
        {/each}
      </select>
    {/if}
  {/if}

  <button
    type="button"
    class="w-full p-2 bg-black text-white mt-2 font-bold hover:bg-gray-800 disabled:opacity-50"
    disabled={!reqsMet}
    on:click={addBonus}
  >
    Add Bonus To List
  </button>
</div>
