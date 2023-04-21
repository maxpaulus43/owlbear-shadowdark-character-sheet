<script lang="ts">
  import { importFromJson } from "./lib/ShadowDarklingsImporter";
  import {
    calculateArmorClassForPlayer,
    calculateTitleForPlayer,
    levelUpPlayer,
    PlayerCharacterStore as pc,
  } from "./lib/model/PlayerCharacter";
  import {
    ALIGNMENTS,
    ANCESTRIES,
    BACKGROUNDS,
    CLASSES,
    DEITIES,
  } from "./lib/constants";
  import drance from "./lib/compendium/Drance.json";
  import TalentsSpellsView from "./lib/components/TalentsSpellsView.svelte";
  import StatView from "./lib/components/StatView.svelte";
  import GearView from "./lib/components/GearView.svelte";
  import AttacksView from "./lib/components/AttacksView.svelte";

  $pc = importFromJson(drance);
  // trackPlayerHistory();

  $: ac = calculateArmorClassForPlayer($pc);
  $: title = calculateTitleForPlayer($pc);
  $: xpCap = $pc.level === 0 ? 10 : $pc.level * 10;
  $: canLevel = $pc.level < 10 && $pc.xp >= xpCap;
</script>

<main>
  <div
    id="sheet"
    class="bg-black min-w-[277px] max-w-[1000px] p-2 flex flex-wrap gap-2"
  >
    <div
      class="flex-[2] min-w-[257px] h-[700px] grid grid-rows-8 grid-cols-2 gap-2"
    >
      <div class="col-span-full cell">
        <div class="flex gap-1 justify-around">
          <h1 class="">Shadowdark</h1>
          <div class="flex flex-col gap-1">
            <button class="bg-black text-white p-2 text-xs"
              >Import from JSON</button
            >
            <button class="bg-black text-white p-2 text-xs" on:click={() => {}}
              >Export to JSON</button
            >
          </div>
        </div>
      </div>
      <div class="cell">
        <StatView forStat="STR" />
      </div>
      <div class="cell">
        <StatView forStat="INT" />
      </div>
      <div class="cell">
        <StatView forStat="DEX" />
      </div>
      <div class="cell">
        <StatView forStat="WIS" />
      </div>
      <div class="cell">
        <StatView forStat="CON" />
      </div>
      <div class="cell">
        <StatView forStat="CHA" />
      </div>
      <div class="row-span-2 cell">
        <h2>HP</h2>
        <input
          type="number"
          inputmode="numeric"
          min="0"
          bind:value={$pc.hitPoints}
        />
      </div>
      <div class="row-span-2 cell">
        <h2>AC</h2>
        <div>{ac}</div>
      </div>
      <div class="col-span-full row-span-2 cell">
        <AttacksView />
      </div>
    </div>
    <div
      class="flex-[2] min-w-[257px] h-[700px] grid grid-rows-8 grid-cols-2 gap-2"
    >
      <div class="col-span-full cell">
        <h2>NAME</h2>
        <input type="text" bind:value={$pc.name} />
      </div>
      <div class="col-span-full cell">
        <h2>ANCESTRY</h2>
        <select bind:value={$pc.ancestry}>
          {#each ANCESTRIES as ancestry}
            <option value={ancestry}>
              {ancestry}
            </option>
          {/each}
        </select>
      </div>
      <div class="col-span-full cell">
        <h2>CLASS</h2>
        <select bind:value={$pc.class}>
          {#each CLASSES as clazz}
            <option value={clazz}>
              {clazz}
            </option>
          {/each}
        </select>
      </div>
      <div class="cell">
        <h2>LEVEL</h2>
        <input type="number" bind:value={$pc.level} max="10" min="0" />
      </div>
      <div class="cell">
        <h2>XP</h2>
        <div class="sheet-stat flex gap-1">
          {#if $pc.level < 10}
            <input type="number" min="0" bind:value={$pc.xp} /> /
            <div>{xpCap}</div>
          {:else}
            MAX LEVEL
          {/if}
          <button
            class="text-2xl"
            class:opacity-20={!canLevel}
            disabled={!canLevel}
            on:click={() => {
              levelUpPlayer($pc);
              $pc = $pc;
            }}>🆙</button
          >
        </div>
      </div>
      <div class="col-span-full cell">
        <h2>TITLE</h2>
        <div>{title}</div>
      </div>
      <div class="col-span-full cell">
        <h2>ALIGNMENT</h2>
        <select bind:value={$pc.alignment}>
          {#each ALIGNMENTS as alignment}
            <option value={alignment}>
              {alignment}
            </option>
          {/each}
        </select>
      </div>
      <div class="col-span-full cell">
        <h2>BACKGROUND</h2>
        <select>
          {#each BACKGROUNDS as background}
            <option value={$pc.background}>
              {background}
            </option>
          {/each}
        </select>
      </div>

      <div class="col-span-full cell">
        <h2>DEITY</h2>
        <select>
          {#each DEITIES as deity}
            <option value={deity}>
              {deity}
            </option>
          {/each}
        </select>
      </div>
    </div>
    <div class="flex-[3] min-w-[257px] h-[700px] grid grid-rows-2 gap-2">
      <div class="cell">
        <TalentsSpellsView />
      </div>
      <div class="cell">
        <GearView />
      </div>
    </div>
  </div>
</main>

<style>
  input,
  select {
    width: 100%;
    padding: 0.25rem;
    border: 1px solid gray;
  }

  .cell {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity));
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 0.5rem;
    box-shadow: inset 0 0 5px #000;
  }
</style>
