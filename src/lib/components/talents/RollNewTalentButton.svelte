<script lang="ts">
  import Modal from "../Modal.svelte";
  import { addBonusToPlayer, pc } from "../../model/PlayerCharacter";
  import { CLASS_TALENTS } from "../../compendium/talentCompendium";
  import { rollDice } from "../../utils";
  import { STATS } from "../../constants";
  import type {
    Bonus,
    ModifyBonus,
    SpellBonusMetaData,
    Stat,
  } from "../../types";

  let showModal = false;

  $: if (!showModal) {
    reset();
  }

  const ranges: { min: number; max: number }[] = [
    { min: 2, max: 2 },
    { min: 3, max: 7 },
    { min: 8, max: 9 },
    { min: 10, max: 11 },
  ];

  function getRangeString(i: number, classTalents: any[]): string {
    const t = classTalents && classTalents[i];
    if (t && t.min !== undefined && t.max !== undefined) {
      return t.min === t.max ? `${t.min}` : `${t.min}-${t.max}`;
    }
    const r = ranges[i];
    if (r) {
      return r.min === r.max ? `${r.min}` : `${r.min}-${r.max}`;
    }
    return "";
  }

  let highlight = -1;
  function rollTalent() {
    const result = rollDice("d6") + rollDice("d6");

    if (result === 12) {
      highlight = 4;
      return;
    }
    const talents = CLASS_TALENTS[$pc.class] ?? [];
    for (let i = 0; i < talents.length; i++) {
      const t = talents[i];
      if (t && t.min !== undefined && t.max !== undefined) {
        if (result >= t.min && result <= t.max) {
          highlight = i;
          break;
        }
      } else {
        const r = ranges[i];
        if (r && result >= r.min && result <= r.max) {
          highlight = i;
          break;
        }
      }
    }
  }

  let options: (Bonus | Bonus[])[] = [];
  let selectedOption: Bonus | Bonus[];
  let updateAction = () => {};

  function setOptionsForHighlight(highlight: number) {
    const highlightedTalent = CLASS_TALENTS[$pc.class][highlight];

    switch (highlightedTalent?.type) {
      case "generic":
        updateAction = () => {
          addBonusToPlayer($pc, {
            name: highlightedTalent.name,
            desc: highlightedTalent.name,
            type: "generic",
            bonusSource: "Talent",
            editable: true,
          });
        };
        break;
      case "bonus":
        updateAction = () => {
          for (const b of highlightedTalent.bonuses) {
            addBonusToPlayer($pc, b);
          }
        };
        break;
      case "chooseBonus":
        const firstChoice = highlightedTalent.choices[0];
        // hacky solution to filter out known spells
        if (
          !Array.isArray(firstChoice) &&
          firstChoice.metadata &&
          firstChoice.metadata.type === "spell"
        ) {
          options = (highlightedTalent.choices as ModifyBonus[]).filter((b) =>
            $pc.spells.find(
              (s) => s.name === (b.metadata as SpellBonusMetaData)?.spell,
            ),
          );
        } else {
          options = highlightedTalent.choices;
        }
        selectedOption = options[0];
        break;
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

  $: if (talentChoiceOrStatsChoice === "talent") {
    setOptionsForHighlight(0);
  }

  function reset() {
    highlight = -1;
    options = [];
    selectedOption = undefined;
    talentChoiceOrStatsChoice = undefined;
    statDistributionRemaining = 2;
    newStats = {
      STR: $pc.stats.STR,
      DEX: $pc.stats.DEX,
      CON: $pc.stats.CON,
      INT: $pc.stats.INT,
      WIS: $pc.stats.WIS,
      CHA: $pc.stats.CHA,
    };
  }

  $: newStats = {
    STR: $pc.stats.STR,
    DEX: $pc.stats.DEX,
    CON: $pc.stats.CON,
    INT: $pc.stats.INT,
    WIS: $pc.stats.WIS,
    CHA: $pc.stats.CHA,
  };

  function updateSheet() {
    if (talentChoiceOrStatsChoice === "stats") {
      $pc.stats = newStats;
    } else if (selectedOption) {
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

  let talentChoiceOrStatsChoice: "talent" | "stats";
  let statDistributionRemaining = 2;

  function onTalentSelectChange(e: Event) {
    options = [];
    setOptionsForHighlight(parseInt((e.target as HTMLSelectElement).value));
  }

  function onStatAdd(s: Stat) {
    if (statDistributionRemaining < 1) return;
    newStats[s] += 1;
    statDistributionRemaining -= 1;
  }
  function onStatSubtract(s: Stat) {
    if (statDistributionRemaining === 2 || newStats[s] - 1 < $pc.stats[s])
      return;
    newStats[s] = Math.max($pc.stats[s], newStats[s] - 1);
    statDistributionRemaining += 1;
  }
</script>

<button
  class="bg-black text-white w-full p-2"
  on:click={() => (showModal = true)}>Select New Talent</button
>

<Modal bind:showModal>
  <h2 slot="header" class="text-lg">Select New Talent</h2>
  <table>
    <tr class="text-left border-b border-black">
      <th class="w-20">2d6</th>
      <th>Effect</th>
    </tr>
    {#each ranges as r, i}
      <tr class="border-b border-black" class:bg-yellow-300={highlight === i}>
        <td>{getRangeString(i, CLASS_TALENTS[$pc.class])}</td>
        <td>{CLASS_TALENTS[$pc.class]?.[i]?.name}</td>
      </tr>
    {/each}
    <tr class="border-b border-black" class:bg-yellow-300={highlight === 4}>
      <td>12</td>
      <td>Choose a talent or +2 points to distribute to stats</td>
    </tr>
  </table>

  <div class="flex flex-col gap-2 mt-3 border-t pt-3 text-black">
    <label for="talent-select" class="font-semibold text-sm">Select Talent</label>
    <select id="talent-select" bind:value={highlight} class="w-full border p-1 rounded text-black bg-white">
      <option value={-1}>Select a talent...</option>
      {#each ranges as r, i}
        <option value={i}>
          {getRangeString(i, CLASS_TALENTS[$pc.class])}: {CLASS_TALENTS[$pc.class]?.[i]?.name}
        </option>
      {/each}
      <option value={4}>
        12: Choose a talent or +2 points to distribute to stats
      </option>
    </select>

    <div class="flex gap-2 w-full mt-1">
      <button type="button" class="w-full bg-black text-white p-2 font-bold rounded hover:bg-gray-800" on:click={rollTalent}>
        Roll
      </button>
      <button type="button" class="w-full bg-black text-white p-2 font-bold rounded hover:bg-gray-800 disabled:opacity-50" on:click={updateSheet} disabled={highlight === -1}>
        Add
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-1 text-black">
    {#if highlight === 4}
      <div class="flex gap-5 items-center justify-center p-2">
        <label for="chooseTalentCheckBox">Choose Talent</label>
        <input
          id="chooseTalentCheckBox"
          type="radio"
          name="pick"
          bind:group={talentChoiceOrStatsChoice}
          value="talent"
        />
        <label for="distributeStatsCheckBox">Distribute Stats</label>
        <input
          id="distributeStatsCheckBox"
          type="radio"
          name="pick"
          bind:group={talentChoiceOrStatsChoice}
          value="stats"
        />
      </div>
    {/if}
    {#if talentChoiceOrStatsChoice === "talent"}
      <select on:change={onTalentSelectChange} value={highlight} class="w-full">
        {#each CLASS_TALENTS[$pc.class].map((t) => t.name) as t, i}
          <option value={i}>{t}</option>
        {/each}
      </select>
    {/if}
    {#if talentChoiceOrStatsChoice === "stats"}
      <div class="self-center">
        Stats Points remaining: {statDistributionRemaining}
      </div>
      <div class="flex flex-col gap-1 items-center">
        {#each STATS as s}
          <div class="flex items-center">
            <div class="w-12">{s}</div>
            <div
              class="p-1 bg-gray-200 rounded-md"
              class:text-green-600={newStats[s] > $pc.stats[s]}
            >
              {newStats[s]}
            </div>
            <button on:click={() => onStatSubtract(s)}
              ><i class="material-icons">remove</i></button
            >
            <button on:click={() => onStatAdd(s)}
              ><i class="material-icons">add</i></button
            >
          </div>
        {/each}
      </div>
    {/if}
    {#if options.length}
      <select bind:value={selectedOption}>
        {#each options as o}
          <option value={o}>{stringForOption(o)}</option>
        {/each}
      </select>
    {/if}
  </div>
</Modal>

<style lang="postcss">
  select {
    @apply my-1;
  }
</style>
