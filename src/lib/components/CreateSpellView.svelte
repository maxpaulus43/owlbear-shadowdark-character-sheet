<script lang="ts">
  import type {
    DiceType,
    DurationSubType,
    DurationType,
    RangeType,
  } from "../types";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";
  import Modal from "./Modal.svelte";
  import type { SpellClass, SpellInfo, SpellTier } from "../model/Spell";

  let showModal = false;

  let spellName: string;
  let spellDesc: string;

  $: isValid = Boolean(spellName && spellDesc);

  let spellTier: "1" | "2" | "3" | "4" | "5" = "1";
  let spellDurationType: DurationType = "Instant";
  let spellDurationSubType: DurationSubType = "InGame";
  let spellClass: SpellClass = "Wizard";
  let spellRange: RangeType = "Self";
  let spellRollDiceType: DiceType = "d8";
  let spellAmtType: "Roll" | "Static" = "Static";
  let spellAmt: number = 1;

  function onCreateSpell() {
    const s: SpellInfo = {
      editable: true,
      name: spellName,
      class: spellClass,
      tier: parseInt(spellTier) as SpellTier,
      range: spellRange,
      duration: {
        type: spellDurationType,
      },
      desc: spellDesc,
    };

    if (!["Instant", "Focus"].includes(spellDurationType)) {
      s.duration.subType = spellDurationSubType;
      if (spellAmtType === "Roll") {
        s.duration.roll = { diceType: spellRollDiceType, numDice: spellAmt };
      } else {
        s.duration.amt = spellAmt;
      }
    }

    console.log(s);
    $pc.spells.push({ name: s.name });
    $pc.customSpells.push(s);
    $pc = $pc;
    showModal = false;
    spellName = undefined;
    spellDesc = undefined;
  }
</script>

<button
  class="bg-black text-white rounded-md text-center w-full"
  on:click={() => {
    showModal = true;
  }}>Custom Spell</button
>

<Modal bind:showModal>
  <h1 slot="header">CREATE SPELL</h1>
  <div class="w-full flex flex-col gap-1 min-w-[250px]">
    <label for="spellName">Name</label>
    <input type="text" id="spellName" bind:value={spellName} />

    <label for="spellClass">Class</label>
    <select bind:value={spellClass}>
      <option>Priest</option>
      <option>Wizard</option>
      <option value="PriestWizard">Priest or Wizard</option>
    </select>

    <label for="spellTier">Tier</label>
    <select bind:value={spellTier}>
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>

    <label for="spellRange">Range</label>
    <select bind:value={spellRange}>
      <option>Self</option>
      <option>Close</option>
      <option>Near</option>
      <option>Far</option>
    </select>

    <label for="spellDuration">Time Unit</label>
    <select bind:value={spellDurationType}>
      <option>Focus</option>
      <option>Instant</option>
      <option>Second</option>
      <option>Minute</option>
      <option>Round</option>
      <option>Hour</option>
      <option>Day</option>
      <option>Week</option>
      <option>Month</option>
      <option>Year</option>
    </select>

    {#if !["Instant", "Focus"].includes(spellDurationType)}
      <label for="durSubType">In Game Time or Real Time?</label>
      <select id="durSubType" bind:value={spellDurationSubType}>
        <option>InGame</option>
        <option>RealTime</option>
      </select>

      <label for="durType">Duration Type</label>
      <select id="durType" bind:value={spellAmtType}>
        <option value="Static">Static number</option>
        <option value="Roll">Roll some dice</option>
      </select>

      <label for="spellDurationAmount">How Many</label>
      <input
        id="spellDurationAmount"
        type="number"
        inputmode="numeric"
        bind:value={spellAmt}
      />

      {#if spellAmtType === "Roll"}
        <label for="diceType">Dice Type</label>
        <select id="diceType">
          <option>d4</option>
          <option>d6</option>
          <option>d8</option>
          <option>d10</option>
          <option>d12</option>
          <option>d20</option>
        </select>
      {/if}
    {/if}

    <label for="spellDesc">Description</label>
    <textarea id="spellDesc" cols="10" bind:value={spellDesc} />

    <button
      class="bg-black text-white p-2"
      disabled={!isValid}
      class:opacity-50={!isValid}
      on:click={() => onCreateSpell()}>Create Spell</button
    >
  </div>
</Modal>
