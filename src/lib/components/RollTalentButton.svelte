<script lang="ts">
  import Modal from "./Modal.svelte";
  import { rollDice } from "../utils";
  import {
    addBonusToPlayer,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import { CLASS_TALENTS } from "../compendium/talentCompendium";
  import type { Bonus } from "../model/Bonus";

  let showModal = false;

  $: if (!showModal) {
    reset();
  }

  const ranges: { min: number; max: number }[] = [
    { min: 2, max: 2 },
    { min: 3, max: 7 },
    { min: 8, max: 9 },
    { min: 10, max: 11 },
    { min: 12, max: 12 },
  ];

  let canRoll = true;
  let showDone = false;
  let highlight = -1;
  function rollTalent() {
    const result = rollDice("d6") + rollDice("d6");
    // const result = 2;

    canRoll = false;
    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
      if (result >= r.min && result <= r.max) {
        highlight = i;
        showDone = true;
        break;
      }
    }
  }

  let options: (Bonus | Bonus[])[] = [];
  let selectedOption: Bonus | Bonus[];
  let updateAction = () => {};

  function setOptionsForHighlight(highlight: number) {
    const highlightedTalent = CLASS_TALENTS[$pc.class][highlight];

    switch (highlightedTalent.type) {
      case "generic":
        // TODO generic talent?
        break;
      case "bonus":
        updateAction = () => {
          for (const b of highlightedTalent.bonuses) {
            addBonusToPlayer($pc, b);
          }
        };
        break;
      case "chooseBonus":
        options = highlightedTalent.choices;
    }
  }

  function stringForOption(o: Bonus | Bonus[]): string {
    if (Array.isArray(o)) {
      return o.map((o) => o.name).join(" & ");
    } else {
      return o.name;
    }
  }

  $: if (highlight > -1) {
    setOptionsForHighlight(highlight);
  }

  function reset() {
    canRoll = true;
    highlight = -1;
    showDone = false;
    options = [];
    selectedOption = undefined;
  }

  function updateSheet() {
    if (selectedOption) {
      if (Array.isArray(selectedOption)) {
        for (const b of selectedOption) {
          addBonusToPlayer($pc, b);
        }
      } else {
        addBonusToPlayer($pc, selectedOption);
      }
    } else {
      updateAction();
    }
    $pc = $pc;
    showModal = false;
  }
</script>

<button
  class="bg-black text-white w-full p-2"
  on:click={() => (showModal = true)}>Roll New Talent</button
>

<Modal bind:showModal>
  <h2 slot="header" class="text-lg">Roll New Talent</h2>
  <table>
    <tr class="text-left border-b border-black">
      <th class="w-20">2d6</th>
      <th>Effect</th>
    </tr>
    {#each ranges as r, i}
      <tr class="border-b border-black" class:bg-yellow-300={highlight === i}>
        <td>{r.min === r.max ? r.min : `${r.min}-${r.max}`}</td>
        <td>{CLASS_TALENTS[$pc.class][i]?.name}</td>
      </tr>
    {/each}
  </table>
  {#if canRoll}
    <button class="w-full bg-black text-white p-1" on:click={rollTalent}>
      ROLL
    </button>
  {/if}
  {#if options.length}
    <select
      bind:value={selectedOption}
      class="w-full p-1 bg-gray-200 my-4 rounded-md"
    >
      {#each options as o}
        <option value={o}>{stringForOption(o)}</option>
      {/each}
    </select>
  {/if}
  {#if showDone}
    <button class="w-full bg-black text-white p-1" on:click={updateSheet}>
      Update Sheet
    </button>
  {/if}
</Modal>
