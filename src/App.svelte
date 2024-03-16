<script lang="ts">
  import {
    calculateTitleForPlayer,
    levelUpPlayer,
    PlayerCharacterStore as pc,
  } from "./lib/model/PlayerCharacter";
  import { ALIGNMENTS } from "./lib/constants";
  import TalentsSpellsView from "./lib/components/talents/TalentsSpellsView.svelte";
  import StatView from "./lib/components/StatView.svelte";
  import GearView from "./lib/components/gear/GearView.svelte";
  import AttacksView from "./lib/components/AttacksView.svelte";
  import { importFromJson } from "./lib/services/JSONImporter";
  import HpView from "./lib/components/HPView.svelte";
  import InfoButton from "./lib/components/InfoButton.svelte";
  import OptionsButton from "./lib/components/OptionsButton.svelte";
  import { setCustomGearForPlayer } from "./lib/compendium";
  import ClassView from "./lib/components/ClassView.svelte";
  import ArmorClassView from "./lib/components/ArmorClassView.svelte";
  import NotesButton from "./lib/components/NotesButton.svelte";
  import PlayersView from "./lib/components/PlayersView.svelte";
  import { onMount } from "svelte";
  import * as OBRHelper from "./lib/services/OBRHelper";
  import * as LocalStorageSaver from "./lib/services/LocalStorageSaver";
  import OBR from "@owlbear-rodeo/sdk";
  import AncestryView from "./lib/components/AncestryView.svelte";
  import { isSaveInProgress } from "./lib/services/LocalStorageSaver";
  import NotificationsButton from "./lib/components/NotificationsButton.svelte";

  const { isGM } = OBRHelper;

  onMount(() => {
    if (OBR.isAvailable) {
      OBRHelper.init();
    } else {
      LocalStorageSaver.init();
    }
  });
  $: setCustomGearForPlayer($pc);

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

  function onTitleInput(e: Event) {
    $pc.title = (e.target as HTMLInputElement).value;
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
              {#if $isSaveInProgress}
                <div
                  title="save in progress..."
                  class="absolute top-0 left-0 opacity-20 bg-black text-white p-1 rounded-md flex items-center"
                >
                  <i class="material-icons">save</i>...
                </div>
              {/if}
              <div class="-translate-y-2 flex gap-1">
                {#if !$isGM}
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
                {/if}
                <OptionsButton bind:files />
                <NotesButton />
                <NotificationsButton />
                <PlayersView />
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
          <ArmorClassView />
        </div>
        <div class="col-span-full row-span-2 cell">
          <AttacksView />
        </div>
      </div>
      <div
        class="flex-[2] min-w-[257px] h-[700px] grid grid-rows-8 grid-cols-2 gap-2"
      >
        <div class="col-span-full cell">
          <label>
            <h2>NAME</h2>
            <input type="text" bind:value={$pc.name} />
          </label>
        </div>
        <div class="col-span-full cell">
          <AncestryView />
        </div>
        <div class="col-span-full cell">
          <ClassView />
        </div>
        <div class="cell">
          <label>
            <h2>LEVEL</h2>
            <input
              type="number"
              inputmode="numeric"
              bind:value={$pc.level}
              max="10"
              min="1"
            />
          </label>
        </div>
        <div class="cell">
          <h2>XP</h2>
          <label for="xp" />
          <div class="sheet-stat flex gap-1">
            {#if $pc.level < 10}
              <input
                id="xp"
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
          {#if $pc.hasCustomClass}
            <input
              type="text"
              value={title ?? $pc.title}
              on:input={onTitleInput}
            />
          {:else}
            <div>{title}</div>
          {/if}
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
          <input type="text" bind:value={$pc.background} />
        </div>

        <div class="col-span-full cell">
          <h2>DEITY</h2>
          <input bind:value={$pc.deity} />
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

<style lang="postcss">
  input,
  select {
    @apply w-full;
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
