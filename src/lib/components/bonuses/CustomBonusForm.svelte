<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ARMORS } from "../../compendium/armorCompendium";
  import { SPELLS } from "../../compendium/spellCompendium";
  import { WEAPONS } from "../../compendium/weaponCompendium";
  import {
    ROLL_BONUS_TOS,
    BONUS_TOS,
    DICE_TYPES,
    STATS,
  } from "../../constants";
  import { addBonusToPlayer, pc } from "../../model/PlayerCharacter";
  import type {
    WeaponInfo,
    ArmorInfo,
    Bonus,
    BonusTo,
    BonusMetaData,
    DiceType,
    Stat,
    WeaponType,
    RollBonusTo,
  } from "../../types";

  const dispatch = createEventDispatcher();

  export let bonus: Bonus = undefined;

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

  let name: string = bonus?.name ?? "";
  let desc: string = bonus?.desc ?? "";
  let type: Bonus["type"] = bonus?.type ?? "generic";
  let bonusTo: BonusTo =
    bonus && "bonusTo" in bonus ? (bonus.bonusTo as BonusTo) : undefined;
  let bonusAmount: number =
    bonus?.type === "modifyAmt" ? bonus.bonusAmount : 1;
  let bonusIncreaseRatePerLevel: number =
    bonus?.type === "modifyAmt" ? (bonus.bonusIncreaseRatePerLevel ?? 0) : 0;
  let mdType: BonusMetaData["type"] | "" = bonus?.metadata?.type ?? "";
  let diceType: DiceType = bonus?.type === "diceType" ? bonus.diceType : "d8";
  let selectedWeapon: string =
    bonus?.metadata?.type === "weapon" ? bonus.metadata.weapon : "";
  let selectedArmor: string =
    bonus?.metadata?.type === "armor" ? bonus.metadata.armor : "";
  let selectedSpell: string =
    bonus?.metadata?.type === "spell" ? bonus.metadata.spell : "";
  let selectedStat: Stat | "" =
    bonus?.metadata?.type === "stat" ? bonus.metadata.stat : "";
  let weaponType: WeaponType | "" =
    bonus?.metadata?.type === "weaponType" ? bonus.metadata.weaponType : "";

  let previousBonusTo = bonusTo;
  $: if (bonusTo && previousBonusTo !== bonusTo) {
    selectedWeapon = "";
    selectedArmor = "";
    selectedSpell = "";
    selectedStat = "";
    weaponType = "";
    previousBonusTo = bonusTo;
  }

  let reqsMet = Boolean(name) && Boolean(desc);
  let buttonText = bonus ? "UPDATE" : "ADD";
  $: {
    if (bonusTo === "stat" || bonusTo === "statRoll") {
      mdType = "stat";
      reqsMet = Boolean(name) && Boolean(desc) && Boolean(selectedStat);
    } else {
      if (mdType === "stat") mdType = "";
      reqsMet = Boolean(name) && Boolean(desc);
    }
    buttonText = reqsMet ? (bonus ? "UPDATE" : "ADD") : "Please add required fields";
  }

  function addBonus() {
    let b: Bonus;
    switch (type) {
      case "generic":
        b = { name, desc, type };
        break;
      case "modifyAmt":
        b = { name, desc, type, bonusTo, bonusAmount };
        if (bonusIncreaseRatePerLevel) {
          b.bonusIncreaseRatePerLevel = bonusIncreaseRatePerLevel;
        }
        break;
      case "advantage":
      case "disadvantage": {
        let rbto = bonusTo as RollBonusTo;
        b = { name, desc, type, bonusTo: rbto };
        break;
      }
      case "diceType":
        let rbto = bonusTo as RollBonusTo;
        b = { name, desc, type, bonusTo: rbto, diceType };
        break;
    }
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
    b.editable = true; // custom bonuses are editable
    if (bonus?.bonusSource) b.bonusSource = bonus.bonusSource;
    if (bonus) {
      for (let k in bonus) {
        if (bonus.hasOwnProperty(k)) {
          delete bonus[k];
        }
      }
      Object.assign(bonus, b);
    } else {
      addBonusToPlayer($pc, b);
    }
    $pc = $pc;
    dispatch("finish");
  }
</script>

<div class="flex flex-col gap-1 w-full">
  <label for="name">Name</label>
  <input id="name" type="text" placeholder="Poison" bind:value={name} />
  <label for="desc">Description</label>
  <input id="desc" placeholder="-2 CON for 10 rounds" bind:value={desc} />
  <label for="type">What kind of bonus is it?</label>
  <select id="type" bind:value={type}>
    <option value="generic">Generic</option>
    <option value="modifyAmt"> Numerical Modifier </option>
    <option value="advantage"> Advantage </option>
    <option value="disadvantage"> Disadvantage </option>
    <option value="diceType"> Dice Type </option>
  </select>
  {#if type === "diceType" || type === "advantage" || type === "disadvantage"}
    <label for="bto">Bonus To:</label>
    <select id="bto" bind:value={bonusTo}>
      {#each ROLL_BONUS_TOS as bto}
        <option>{bto}</option>
      {/each}
    </select>
  {:else if type === "modifyAmt"}
    <label for="bto">Bonus To:</label>
    <select id="bto" bind:value={bonusTo}>
      {#each BONUS_TOS as bto}
        <option>{bto}</option>
      {/each}
    </select>
  {/if}
  {#if type === "modifyAmt"}
    <label for="modifyAmt">By how much?</label>
    <input
      id="modifyAmt"
      type="number"
      inputmode="numeric"
      bind:value={bonusAmount}
    />
    <label for="bonusIncreaseRatePerLevel">Additional amount per level</label>
    <input
      id="bonusIncreaseRatePerLevel"
      type="number"
      inputmode="decimal"
      step="0.5"
      bind:value={bonusIncreaseRatePerLevel}
    />
  {:else if type === "diceType"}
    <label for="diceType">Dice Type</label>
    <select id="diceType" bind:value={diceType}>
      {#each DICE_TYPES as d}
        <option>{d}</option>
      {/each}
    </select>
  {/if}
  <label for="metaDataType"
    >Does this bonus target a specific item, spell, or stat?</label
  >
  <select id="metaDataType" bind:value={mdType}>
    <option value="">No</option>
    <option value="weapon">Equipped Weapon</option>
    <option value="armor">Equipped Armor</option>
    <option value="spell">Spell</option>
    <option value="stat">Stat</option>
    <option value="weaponType">Weapon Type</option>
  </select>

  {#if mdType === "weapon"}
    <label for="weapon">Which weapon?</label>
    <select id="weapon" bind:value={selectedWeapon}>
      {#each allWeapons as w}
        <option>{w.name}</option>
      {/each}
    </select>
  {:else if mdType === "armor"}
    <label for="armor">Which armor?</label>
    <select id="armor" bind:value={selectedArmor}>
      {#each allArmors as a}
        <option>{a.name}</option>
      {/each}
    </select>
  {:else if mdType === "spell"}
    <label for="spell">Which spell?</label>
    <select id="spell" bind:value={selectedSpell}>
      {#each allSpells as s}
        <option>{s.name}</option>
      {/each}
    </select>
  {:else if mdType === "stat"}
    <label for="stat">Which stat?</label>
    <select id="stat" bind:value={selectedStat}>
      {#each STATS as s}
        <option>{s}</option>
      {/each}
    </select>
  {:else if mdType === "weaponType"}
    <label for="weaponType">Which weapon type?</label>
    <select id="weaponType" bind:value={weaponType}>
      {#each ["Melee", "Ranged"] as s}
        <option>{s}</option>
      {/each}
    </select>
  {/if}

  <button
    class="w-full p-2 bg-black text-white mt-1"
    disabled={!reqsMet}
    class:opacity-50={!reqsMet}
    on:click={addBonus}>{buttonText}</button
  >
</div>
