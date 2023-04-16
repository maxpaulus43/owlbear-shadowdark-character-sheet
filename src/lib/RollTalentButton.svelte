<script lang="ts">
  import type { Class } from "../types";
  import Modal from "./Modal.svelte";
  import MenuOption from "./components/Menu/MenuOption.svelte";
  import { PlayerCharacterStore as pc } from "./PlayerCharacter";
  import { rollDice } from "./utils";
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

  const talents: {
    [key in Class]: string[];
  } = {
    Priest: [
      "Gain advantage on casting one spell you know",
      "+1 to melee or ranged attacks",
      "+1 to priest spellcasting checks",
      "+2 to Strength or Wisdom stat",
      "Choose a talent or +2 points to distribute to stats",
    ],
    Fighter: [
      "Gain Weapon Mastery with one additional weapon",
      "+1 to melee and ranged attacks",
      "+2 to Strength, Dexterity, or Constitution stat",
      "Choose one kind of armor. You get +1 AC from that armor",
      "Choose a talent or +2 points to distribute to stats",
    ],
    Thief: [
      "Gain advantage on initiative rolls (reroll if duplicate)",
      "Your Backstab deals +1 dice of damage",
      "+2 to Strength, Dexterity, or Charisma stat",
      "+1 to melee and ranged attacks",
      "Choose a talent or +2 points to distribute to stats",
    ],
    Wizard: [
      "Make one random magic item (see GM Quickstart Guide)",
      "+2 to Intelligence stat or +1 to wizard spellcasting checks",
      "Gain advantage on casting one spell you know",
      "Learn one additional wizard spell of any tier you know",
      "Choose a talent or +2 points to distribute to stats",
    ],
  };

  let canRoll = true;
  let showDone = false;
  let highlight = -1;
  function rollTalent() {
    const result = rollDice("d6") + rollDice("d6");
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

  function reset() {
    canRoll = true;
    highlight = -1;
    showDone = false;
  }
</script>

<button
  class="bg-black text-white p-2 w-full"
  on:click={() => (showModal = true)}>Roll New Talent</button
>

<Modal bind:showModal>
  <h2 slot="header" class="text-lg font-bold">Roll New Talent</h2>
  <div class="flex flex-col gap-1">
    <table>
      <tr class="text-left border-b">
        <th class="w-20">2d6</th>
        <th>Effect</th>
      </tr>
      {#each ranges as r, i}
        <tr class="border-b border-black" class:bg-yellow-300={highlight === i}>
          <td>{r.min === r.max ? r.min : `${r.min}-${r.max}`}</td>
          <td>{talents[$pc.class][i]}</td>
        </tr>
      {/each}
    </table>
    {#if canRoll}
      <button class="w-full bg-black text-white p-1" on:click={rollTalent}>
        ROLL
      </button>
    {/if}
    {#if showDone}
      <button
        class="w-full bg-black text-white p-1"
        on:click={() => {
          showModal = false;
        }}>Update Sheet</button
      >
    {/if}
  </div>
</Modal>
