<script lang="ts">
  import Modal from "./Modal.svelte";
  import { rollDice } from "../utils";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";
  import { CLASS_TALENTS } from "../compendium/talentCompendium";

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

  let options = [];
  let selectedOption: string;

  // $: if (highlight > -1) {
  //   const highlightedTalent = CLASS_TALENTS[$pc.class][highlight];
  //
  //   if (highlightedTalent.type === "bonus") {
  //     for (const b of highlightedTalent.bonuses) {
  //       const metadata = b.metadata;
  //
  //       switch (metadata.type) {
  //         case "weapon":
  //         // fall through
  //         case "weaponType":
  //         // fall through
  //         case "armor":
  //         // fall through
  //         case "stat":
  //           $pc.bonuses.push(b);
  //           break;
  //         case "chooseArmor":
  //           options = ARMORS.map((a) => a.name);
  //           break;
  //         case "chooseWeapon":
  //           options = WEAPONS.map((w) => w.name);
  //           break;
  //         case "chooseStat":
  //           options = (metadata as ChooseStatBonusMetaData).filterByStat ?? [
  //             ...STATS,
  //           ];
  //           break;
  //       }
  //     }
  //   }
  // }

  $: if (highlight > -1) {
    const highlightedTalent = CLASS_TALENTS[$pc.class][highlight];
  }

  function reset() {
    canRoll = true;
    highlight = -1;
    showDone = false;
    options = [];
  }

  function updateSheet() {
    // TODO apply the bonuses here
    $pc = $pc;
    showModal = false;
  }
</script>

<button
  class="bg-black text-white p-2 w-full"
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
    <select bind:value={selectedOption}>
      {#each options as o}
        <option>{o}</option>
      {/each}
    </select>
  {/if}
  {selectedOption}
  {#if showDone}
    <button class="w-full bg-black text-white p-1" on:click={updateSheet}>
      Update Sheet
    </button>
  {/if}
</Modal>
