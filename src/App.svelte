<script lang="ts">
  import {
    calculateArmorClassForPlayer,
    calculateTitleForPlayer,
    levelUpPlayer,
    PlayerCharacterStore as pc,
    setAncestryForPlayer,
    setClassForPlayer,
  } from "./lib/model/PlayerCharacter";
  import type { Class, Ancestry } from "./lib/model/PlayerCharacter";
  import {
    ALIGNMENTS,
    ANCESTRIES,
    BACKGROUNDS,
    CLASSES,
    DEITIES,
  } from "./lib/constants";
  import TalentsSpellsView from "./lib/components/TalentsSpellsView.svelte";
  import StatView from "./lib/components/StatView.svelte";
  import GearView from "./lib/components/GearView.svelte";
  import AttacksView from "./lib/components/AttacksView.svelte";
  import { importFromJson } from "./lib/services/JSONImporter";
  import HpView from "./lib/components/HPView.svelte";
  import {
    loadPlayerFromLocalStorage,
    trackAndSavePlayerToLocalStorage,
  } from "./lib/services/LocalStorageSaver";
  import InfoButton from "./lib/components/InfoButton.svelte";
  import OptionsButton from "./lib/components/OptionsButton.svelte";
  import { CurrentSaveSlot } from "./lib/services/SaveSlotTracker";
  import { setCustomGearForPlayer } from "./lib/compendium";

  $: (async () => {
    $pc = await loadPlayerFromLocalStorage($CurrentSaveSlot);
  })();
  $: trackAndSavePlayerToLocalStorage($pc, $CurrentSaveSlot);
  $: setCustomGearForPlayer($pc);

  $: ac = calculateArmorClassForPlayer($pc);
  $: title = calculateTitleForPlayer($pc);
  $: xpCap = $pc.level === 0 ? 10 : $pc.level * 10;
  $: canLevel = $pc.level < 10 && $pc.xp >= xpCap;
  const { canUndo, canRedo } = pc;

  let files: FileList;
  $: if (files) {
    // https://developer.mozilla.org/en-US/docs/Web/API/FileList
    // there should only be one file
    for (const file of files) {
      file.text().then((txt) => {
        $pc = importFromJson(txt);
      });
      files = undefined;
      break;
    }
  }

  function onClassChange(e: Event) {
    const c: Class = (e.target as HTMLSelectElement).value as Class;
    setClassForPlayer($pc, c);
    $pc = $pc;
  }
  function onAncestryChange(e: Event) {
    const a: Ancestry = (e.target as HTMLSelectElement).value as Ancestry;
    setAncestryForPlayer($pc, a);
    $pc = $pc;
  }
</script>

<div class="flex items-center justify-center bg-black">
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
            <div class="flex flex-col items-center">
              <div class="flex items-center gap-1">
                <h1 class="">Shadowdark</h1>
                <InfoButton />
              </div>
              <div class="-translate-y-2 flex gap-1">
                <button
                  on:click={() => pc.undo()}
                  class:opacity-50={!$canUndo}
                  disabled={!$canUndo}
                  class="bg-black text-white rounded-md"
                >
                  <i class="material-icons translate-y-1 px-1">undo</i>
                </button>
                <button
                  on:click={() => pc.redo()}
                  class:opacity-50={!$canRedo}
                  disabled={!$canRedo}
                  class="bg-black text-white rounded-md"
                >
                  <i class="material-icons translate-y-1 px-1">redo</i>
                </button>
                <OptionsButton bind:files />
              </div>
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
          <HpView />
        </div>
        <div class="row-span-2 cell">
          <h2>AC</h2>
          <div
            class="flex justify-center items-center w-full h-full text-7xl pirata"
          >
            {ac}
          </div>
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
          <select value={$pc.ancestry} on:change={onAncestryChange}>
            {#each ANCESTRIES as ancestry}
              <option value={ancestry}>
                {ancestry}
              </option>
            {/each}
          </select>
        </div>
        <div class="col-span-full cell">
          <div class="flex">
            <h2>CLASS</h2>
            {#if !$pc.class}
              <div>(Must Be At Least Level 1)</div>
            {/if}
          </div>
          <select
            value={$pc.class}
            on:change={onClassChange}
            disabled={$pc.level === 0}
          >
            {#each CLASSES as clazz}
              <option value={clazz}>
                {clazz}
              </option>
            {/each}
          </select>
        </div>
        <div class="cell">
          <h2>LEVEL</h2>
          <input
            type="number"
            inputmode="numeric"
            bind:value={$pc.level}
            max="10"
            min="1"
          />
        </div>
        <div class="cell">
          <h2>XP</h2>
          <div class="sheet-stat flex gap-1">
            {#if $pc.level < 10}
              <input
                type="number"
                inputmode="numeric"
                min="0"
                bind:value={$pc.xp}
              />
              /
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
          <select bind:value={$pc.deity}>
            {#each DEITIES as deity}
              <option value={deity}>
                {deity}
              </option>
            {/each}
          </select>
        </div>
      </div>
      <div
        class="flex-[3] min-w-[257px] min-[805px]:h-[700px] grid grid-rows-2 gap-2"
      >
        <div class="cell">
          <TalentsSpellsView />
        </div>
        <div class="cell">
          <GearView />
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  input,
  select {
    width: 100%;
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
