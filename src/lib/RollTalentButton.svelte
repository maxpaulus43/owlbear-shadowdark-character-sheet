<script lang="ts">
  import type { Class, Stat } from "../types";
  import Modal from "./Modal.svelte";
  import { PlayerCharacterStore as pc } from "./PlayerCharacter";
  import Menu from "./components/Menu/Menu.svelte";
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

  let showMeleeOrRanged = false;
  let meleeRangedSelection = "melee";
  let showStrOrWis = false;
  let strWisSelection: Stat = "STR";

  let doneAction = () => {};

  const talents: {
    [key in Class]: { [desc: string]: Function };
  } = {
    Priest: {
      "Gain advantage on casting one spell you know": () => {},
      "+1 to melee or ranged attacks": () => {
        showMeleeOrRanged = true;
        doneAction = () => {
          $pc.bonuses.push({
            bonusTo: "attackRoll",
            bonusType: "modifyAmt",
            bonusAmount: 1,
            name: `+1${meleeRangedSelection}`,
            desc: `+1 to ${meleeRangedSelection}  weapon attack rolls`,
          });
        };
      },
      "+1 to priest spellcasting checks": () => {
        doneAction = () => {
          $pc.bonuses.push({
            bonusTo: "spellcastRoll",
            bonusType: "modifyAmt",
            bonusAmount: 1,
            name: "blah",
            desc: "+1 to spellcasting checks",
          });
        };
      },
      "+2 to Strength or Wisdom stat": () => {
        showStrOrWis = true;
        doneAction = () => {
          $pc.stats[strWisSelection] += 2;
        };
      },
      "Choose a talent or +2 points to distribute to stats": () => {},
    },
    Fighter: {
      "Gain Weapon Mastery with one additional weapon": () => {},
      "+1 to melee and ranged attacks": () => {},
      "+2 to Strength, Dexterity, or Constitution stat": () => {},
      "Choose one kind of armor. You get +1 AC from that armor": () => {},
      "Choose a talent or +2 points to distribute to stats": () => {},
    },
    Thief: {
      "Gain advantage on initiative rolls (reroll if duplicate)": () => {},
      "Your Backstab deals +1 dice of damage": () => {},
      "+2 to Strength, Dexterity, or Charisma stat": () => {},
      "+1 to melee and ranged attacks": () => {},
      "Choose a talent or +2 points to distribute to stats": () => {},
    },
    Wizard: {
      "Make one random magic item (see GM Quickstart Guide)": () => {},
      "+2 to Intelligence stat or +1 to wizard spellcasting checks": () => {},
      "Gain advantage on casting one spell you know": () => {},
      "Learn one additional wizard spell of any tier you know": () => {},
      "Choose a talent or +2 points to distribute to stats": () => {},
    },
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

  $: if (highlight > -1) {
    Object.values(talents[$pc.class])[highlight]();
  }

  function reset() {
    canRoll = true;
    highlight = -1;
    showDone = false;
    showStrOrWis = false;
    showMeleeOrRanged = false;
    doneAction = () => {};
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
          <td>{Object.keys(talents[$pc.class])[i]}</td>
        </tr>
      {/each}
    </table>
    {#if canRoll}
      <button class="w-full bg-black text-white p-1" on:click={rollTalent}>
        ROLL
      </button>
    {/if}
    {#if showMeleeOrRanged}
      <select class="border" bind:value={meleeRangedSelection}>
        <option value="melee">Melee</option>
        <option value="ranged">Ranged</option>
      </select>
    {/if}
    {#if showStrOrWis}
      <select class="border" bind:value={strWisSelection}>
        <option value="STR">STR</option>
        <option value="WIS">WIS</option>
      </select>
    {/if}
    {#if showDone}
      <button
        class="w-full bg-black text-white p-1"
        on:click={() => {
          doneAction();
          $pc = $pc;
          showModal = false;
        }}
      >
        Update Sheet
      </button>
    {/if}
  </div>
</Modal>
