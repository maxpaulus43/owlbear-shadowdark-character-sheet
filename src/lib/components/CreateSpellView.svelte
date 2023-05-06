<script lang="ts">
  import { STATS, RANGE_TYPES, DICE_TYPES, TIME_UNITS } from "../constants";
  import type {
    DiceType,
    DurationSubType,
    DurationType,
    RangeType,
    SpellClass,
    SpellInfo,
    SpellTier,
    Stat,
  } from "../types";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";
  import Modal from "./Modal.svelte";

  let showModal = false;

  let spellName: string;
  let spellDesc: string;

  $: isValid = Boolean(spellName && spellDesc);

  let spellTier: "1" | "2" | "3" | "4" | "5" = "1";
  let spellDurationT: "Instant" | "Focus" | "Time" = "Instant";
  let spellDurationType: DurationType = "Round";
  let spellDurationSubType: DurationSubType = "InGame";
  let spellClass: SpellClass = "Wizard";
  let spellRange: RangeType = "Self";
  let spellRollDiceType: DiceType | "" = "d8";
  let spellAmt: number = 1;
  let spellStat: Stat = "INT";

  function onCreateSpell() {
    const durType =
      spellDurationT === "Time" ? spellDurationType : spellDurationT;
    const s: SpellInfo = {
      editable: true,
      name: spellName,
      class: spellClass,
      stat: spellStat,
      tier: parseInt(spellTier) as SpellTier,
      range: spellRange,
      duration: {
        type: durType,
      },
      desc: spellDesc,
    };

    if (spellDurationT === "Time") {
      s.duration.subType = spellDurationSubType;
      if (spellRollDiceType.length > 0) {
        s.duration.roll = {
          diceType: spellRollDiceType as DiceType,
          numDice: spellAmt,
        };
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

    <label for="spellStat">Spell Stat</label>
    <select bind:value={spellStat}>
      {#each STATS as s}
        <option>{s}</option>
      {/each}
    </select>

    <label for="spellRange">Range</label>
    <select bind:value={spellRange}>
      {#each RANGE_TYPES as r}
        <option>{r}</option>
      {/each}
    </select>

    <label for="spellDuration">Duration</label>
    <select bind:value={spellDurationT}>
      <option>Focus</option>
      <option>Instant</option>
      <option>Time</option>
    </select>

    {#if spellDurationT === "Time"}
      <label for="">How Much Time?</label>
      <div class="flex gap-1">
        <input
          id="dice"
          type="number"
          min="1"
          inputmode="numeric"
          bind:value={spellAmt}
          class="w-10 text-center"
        />
        <select bind:value={spellRollDiceType}>
          <option />
          {#each DICE_TYPES as d}
            <option>{d}</option>
          {/each}
        </select>
        <select bind:value={spellDurationType}>
          {#each TIME_UNITS as t}
            <option>{t}</option>
          {/each}
        </select>
      </div>

      {#if spellDurationType !== "Round"}
        <label for="durSubType">In Game Time or Real Time?</label>
        <select id="durSubType" bind:value={spellDurationSubType}>
          <option>InGame</option>
          <option>RealTime</option>
        </select>
      {/if}

      <!-- <label for="durType">Duration Type</label> -->
      <!-- <select id="durType" bind:value={spellAmtType}> -->
      <!--   <option value="Static">Static number</option> -->
      <!--   <option value="Roll">Roll some dice</option> -->
      <!-- </select> -->

      <!-- {#if spellAmtType === "Roll"} -->
      <!--   <label for="dice">Dice</label> -->
      <!---->
      <!--   <div class="flex gap-1 items-center"> -->
      <!--     <input -->
      <!--       id="dice" -->
      <!--       type="number" -->
      <!--       min="1" -->
      <!--       inputmode="numeric" -->
      <!--       bind:value={spellAmt} -->
      <!--       class="w-10 text-center" -->
      <!--     /> -->
      <!--     <select bind:value={spellRollDiceType}> -->
      <!--       {#each DICE_TYPES as d} -->
      <!--         <option>{d}</option> -->
      <!--       {/each} -->
      <!--     </select> -->
      <!--   </div> -->
      <!-- {:else} -->
      <!--   <label for="spellDurationAmount">How Many</label> -->
      <!--   <input -->
      <!--     id="spellDurationAmount" -->
      <!--     min="0" -->
      <!--     type="number" -->
      <!--     inputmode="numeric" -->
      <!--     bind:value={spellAmt} -->
      <!--   /> -->
      <!-- {/if} -->
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

<style lang="postcss">
  input {
    @apply transition-all;
  }
</style>
