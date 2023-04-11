<script lang="ts">
  import {
    ALIGNMENTS,
    ANCESTRIES,
    BACKGROUNDS,
    CLASSES,
    DEITIES,
    type PlayerCharacter,
  } from "./types";

  import ranal from "./data/Ranal.json";
  import {
    PlayerCharacterStore,
    calculateArmorClassForPlayer,
    calculateTitleForPlayer,
    levelUpPlayer,
  } from "./lib/PlayerCharacter";
  import StatView from "./lib/StatView.svelte";
  import AddGearButton from "./lib/AddGearButton.svelte";
  import TalentsSpellsView from "./lib/TalentsSpellsView.svelte";

  // TODO migration from JSON
  let playerCharacter = ranal as unknown as PlayerCharacter;
  playerCharacter.hitPoints = playerCharacter.maxHitPoints;

  const pc = PlayerCharacterStore;
  pc.set(playerCharacter);

  $: ac = calculateArmorClassForPlayer($pc);
  $: title = calculateTitleForPlayer($pc);
  $: xpCap = $pc.level === 0 ? 10 : $pc.level * 10;
  $: canLevel = $pc.level < 10 && $pc.xp >= xpCap;
</script>

<main>
  <div
    id="sheet"
    class="bg-black grid w-[1000px] h-[700px] p-2 grid-cols-6 grid-rows-8 gap-2"
  >
    <div class="col-span-2" id="sheet-shadowdark">
      <div class="flex gap-1 justify-around">
        <h1 class="">Shadowdark</h1>
        <div class="flex flex-col gap-1">
          <button class="bg-black text-white p-2 text-xs"
            >Import from JSON</button
          >
          <button class="bg-black text-white p-2 text-xs">Export to JSON</button
          >
        </div>
      </div>
    </div>

    <div class="col-span-2" id="sheet-name">
      <h2>NAME</h2>
      <input type="text" bind:value={$pc.name} />
    </div>

    <div class="col-span-2 row-span-4" id="sheet-talents">
      <h2>TALENTS/SPELLS</h2>
      <TalentsSpellsView />
    </div>

    <div>
      <StatView forStat="STR" />
    </div>

    <div>
      <StatView forStat="INT" />
    </div>

    <div class=" col-span-2 p-1" id="sheet-ancestry">
      <h2>ANCESTRY</h2>
      <select>
        {#each ANCESTRIES as ancestry}
          <option value={ancestry}>
            {ancestry}
          </option>
        {/each}
      </select>
    </div>

    <div>
      <StatView forStat="DEX" />
    </div>

    <div>
      <StatView forStat="WIS" />
    </div>

    <div class=" col-span-2" id="sheet-class">
      <h2>CLASS</h2>
      <select bind:value={$pc.class}>
        {#each CLASSES as clazz}
          <option value={clazz}>
            {clazz}
          </option>
        {/each}
      </select>
    </div>

    <div>
      <StatView forStat="CON" />
    </div>

    <div>
      <StatView forStat="CHA" />
    </div>

    <div class="" id="sheet-level">
      <h2>LEVEL</h2>
      <input type="number" bind:value={$pc.level} max="10" min="0" />
    </div>

    <div class="" id="sheet-xp">
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

    <div class="row-span-2" id="sheet-hp">
      <h2>HP</h2>
      <input type="number" min="0" bind:value={$pc.hitPoints} />
    </div>

    <div class="row-span-2" id="sheet-ac">
      <h2>AC</h2>
      <div>{ac}</div>
    </div>

    <div class="col-span-2" id="sheet-title">
      <h2>TITLE</h2>
      <div>{title}</div>
    </div>

    <div class="col-span-2 row-span-4" id="sheet-gear">
      <h2>GEAR</h2>
      <ul>
        {#each $pc.gear as { name }}
          <li>{name}</li>
        {/each}
      </ul>
      <AddGearButton />
    </div>

    <div class="col-span-2" id="sheet-alignment">
      <h2>ALIGNMENT</h2>
      <select bind:value={$pc.alignment}>
        {#each ALIGNMENTS as alignment}
          <option value={alignment}>
            {alignment}
          </option>
        {/each}
      </select>
    </div>

    <div class="row-span-2 col-span-2" id="sheet-attacks">
      <h2>ATTACKS</h2>
      <textarea />
    </div>

    <div class="col-span-2" id="sheet-background">
      <h2>BACKGROUND</h2>
      <select>
        {#each BACKGROUNDS as background}
          <option value={$pc.background}>
            {background}
          </option>
        {/each}
      </select>
    </div>

    <div class="col-span-2" id="sheet-deity">
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
</main>

<style>
  input,
  select,
  textarea {
    width: 100%;
    padding: 0.25rem;
    border: 1px solid gray;
  }
  textarea {
    flex-grow: 1;
    resize: none;
  }
  #sheet > div {
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
