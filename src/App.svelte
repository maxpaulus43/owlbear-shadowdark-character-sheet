<script lang="ts">
  import {
    ALIGNMENTS,
    ANCESTRIES,
    BACKGROUNDS,
    CLASSES,
    DEITIES,
    TITLE_MAP,
    type PlayerCharacter,
  } from "./model";
  import OBR from "@owlbear-rodeo/sdk";

  import ranal from "./data/Ranal.json";
  import {
    calculateArmorClassForPlayer,
    calculateModifierForPlayerStat,
    levelUpPlayer,
  } from "./lib/PlayerCharacter";
  import RollButton from "./lib/RollButton.svelte";

  // TODO migration from JSON
  let playerCharacter = ranal as PlayerCharacter;
  playerCharacter.hitPoints = playerCharacter.maxHitPoints;

  $: level = playerCharacter.level;
  $: strMod = calculateModifierForPlayerStat(playerCharacter, "STR");
  $: dexMod = calculateModifierForPlayerStat(playerCharacter, "DEX");
  $: conMod = calculateModifierForPlayerStat(playerCharacter, "CON");
  $: intMod = calculateModifierForPlayerStat(playerCharacter, "INT");
  $: wisMod = calculateModifierForPlayerStat(playerCharacter, "WIS");
  $: chaMod = calculateModifierForPlayerStat(playerCharacter, "CHA");
  $: ac = calculateArmorClassForPlayer(playerCharacter);
  $: spells = playerCharacter.spellsKnown.split(",");
  $: talents = playerCharacter.bonuses
    .filter((b) => b.sourceCategory === "Talent")
    .map((b) => b.bonusTo);
  $: bonuses = playerCharacter.bonuses.map(
    (b) => `${b.bonusName} to ${b.bonusTo}`
  );

  $: title =
    TITLE_MAP[playerCharacter.class][playerCharacter.alignment][
      Math.max(0, Math.floor((level - 1) / 2))
    ];

  $: xpCap = level === 0 ? 10 : level * 10;
  $: canLevel = playerCharacter.xp >= xpCap;

  function levelUp() {
    levelUpPlayer(playerCharacter);
    playerCharacter = playerCharacter;
  }
</script>

<main>
  <div
    id="sheet"
    class="bg-black grid w-[1000px] h-[700px] p-2 grid-cols-6 grid-rows-8 gap-2"
  >
    <div class="col-span-2" id="sheet-shadowdark">
      <div>Shadowdark</div>
      <div class="flex justify-around gap-1">
        <button class="bg-black text-white p-3">Import from JSON</button>
        <button class="bg-black text-white p-3">Export to JSON</button>
      </div>
    </div>

    <div class="col-span-2" id="sheet-name">
      <div>NAME</div>
      <input type="text" bind:value={playerCharacter.name} />
    </div>

    <div class="col-span-2 row-span-4" id="sheet-talents">
      <div>TALENTS/SPELLS</div>
      <div>
        {#each spells as spell}
          <div>{spell}</div>
        {/each}
        {#each bonuses as talent}
          <div>{talent}</div>
        {/each}
      </div>
    </div>

    <div class="" id="sheet-str">
      <div>STR</div>
      <div class="sheet-stat">
        <input
          type="number"
          bind:value={playerCharacter.stats.STR}
          min="1"
          max="20"
        />
        /
        <div>{strMod >= 0 ? "+" : ""}{strMod}</div>
        <RollButton modifier={strMod} />
      </div>
    </div>

    <div class="" id="sheet-int">
      <div>INT</div>
      <div class="sheet-stat">
        <input
          type="number"
          bind:value={playerCharacter.stats.INT}
          min="1"
          max="20"
        />
        /
        <div>{intMod >= 0 ? "+" : ""}{intMod}</div>
        <RollButton modifier={intMod} />
      </div>
    </div>

    <div class=" col-span-2 p-1" id="sheet-ancestry">
      <div>ANCESTRY</div>
      <select>
        {#each ANCESTRIES as ancestry}
          <option value={ancestry}>
            {ancestry}
          </option>
        {/each}
      </select>
    </div>

    <div class="" id="sheet-dex">
      <div>DEX</div>
      <div class="sheet-stat">
        <input
          type="number"
          bind:value={playerCharacter.stats.DEX}
          min="1"
          max="20"
        />
        /
        <div>{dexMod >= 0 ? "+" : ""}{dexMod}</div>
        <RollButton modifier={dexMod} />
      </div>
    </div>

    <div class="" id="sheet-wis">
      <div>WIS</div>
      <div class="sheet-stat">
        <input
          type="number"
          bind:value={playerCharacter.stats.WIS}
          min="1"
          max="20"
        />
        /
        <div>{wisMod >= 0 ? "+" : ""}{wisMod}</div>
        <RollButton modifier={wisMod} />
      </div>
    </div>

    <div class=" col-span-2" id="sheet-class">
      <div>CLASS</div>
      <select bind:value={playerCharacter.class}>
        {#each CLASSES as clazz}
          <option value={clazz}>
            {clazz}
          </option>
        {/each}
      </select>
    </div>

    <div class="" id="sheet-con">
      <div>CON</div>
      <div class="sheet-stat">
        <input
          type="number"
          bind:value={playerCharacter.stats.CON}
          min="1"
          max="20"
        />
        /
        <div>{conMod >= 0 ? "+" : ""}{conMod}</div>
        <RollButton modifier={conMod} />
      </div>
    </div>

    <div class="" id="sheet-cha">
      <div>CHA</div>
      <div class="sheet-stat">
        <input
          type="number"
          bind:value={playerCharacter.stats.CHA}
          min="1"
          max="20"
        />
        /
        <div>{chaMod >= 0 ? "+" : ""}{chaMod}</div>
        <RollButton modifier={chaMod} />
      </div>
    </div>

    <div class="" id="sheet-level">
      <div>LEVEL</div>
      <input
        type="number"
        bind:value={playerCharacter.level}
        max="10"
        min="0"
      />
    </div>

    <div class="" id="sheet-xp">
      <div>XP</div>
      <div class="sheet-stat">
        <input type="number" min="0" bind:value={playerCharacter.xp} /> /
        <div>{xpCap}</div>
        {#if canLevel}
          <button class="text-2xl" on:click={levelUp}>🆙</button>
        {/if}
      </div>
    </div>

    <div class="row-span-2" id="sheet-hp">
      <div>HP</div>
      <input type="number" min="0" bind:value={playerCharacter.hitPoints} />
    </div>

    <div class="row-span-2" id="sheet-ac">
      <div>AC</div>
      <div>{ac}</div>
    </div>

    <div class="col-span-2" id="sheet-title">
      <div>TITLE</div>
      <div>{title}</div>
    </div>

    <div class="col-span-2 row-span-4" id="sheet-gear">
      <div>GEAR</div>
      <div>
        {#each playerCharacter.gear as { name }}
          <div>{name}</div>
        {/each}
      </div>
    </div>

    <div class="col-span-2" id="sheet-alignment">
      <div>ALIGNMENT</div>
      <select bind:value={playerCharacter.alignment}>
        {#each ALIGNMENTS as alignment}
          <option value={alignment}>
            {alignment}
          </option>
        {/each}
      </select>
    </div>

    <div class="row-span-2 col-span-2" id="sheet-attacks">
      <div>ATTACKS</div>
      <textarea />
    </div>

    <div class="col-span-2" id="sheet-background">
      <div>BACKGROUND</div>
      <select>
        {#each BACKGROUNDS as background}
          <option value={playerCharacter.background}>
            {background}
          </option>
        {/each}
      </select>
    </div>

    <div class="col-span-2" id="sheet-deity">
      <div>DEITY</div>
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
  }
  .sheet-stat {
    display: flex;
    gap: 0.25rem;
  }
  .sheet-stat input {
    width: 50%;
  }
</style>
