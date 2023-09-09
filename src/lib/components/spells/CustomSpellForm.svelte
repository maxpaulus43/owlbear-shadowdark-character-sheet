<script lang="ts">
  import { STATS, RANGE_TYPES, DICE_TYPES, TIME_UNITS } from "../../constants";
  import type { DiceType, SpellInfo, SpellTier } from "../../types";
  import { pc } from "../../model/PlayerCharacter";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let spellToEdit: SpellInfo = undefined;
  let currSpell = $pc.spells.find((s) => s.name === spellToEdit?.name);

  let spellName = spellToEdit?.name;
  let spellDesc = spellToEdit?.desc;

  $: isValid = Boolean(spellName && spellDesc);

  let spellTier = `${spellToEdit?.tier ?? 1}`;
  let spellDurationT: "Instant" | "Focus" | "Time" = "Instant";
  let spellDurationType = spellToEdit?.duration?.type ?? "Round";
  let spellDurationSubType = spellToEdit?.duration?.subType ?? "InGame";
  let spellClass = spellToEdit?.class ?? "Wizard";
  let spellRange = spellToEdit?.range ?? "Self";
  let spellRollDiceType = spellToEdit?.duration?.roll?.diceType ?? "d8";
  let spellAmt = spellToEdit?.duration?.amt ?? 1;
  let spellStat = spellToEdit?.stat ?? "INT";

  function onCreateSpell() {
    const durType =
      spellDurationT === "Time" ? spellDurationType : spellDurationT;
    const s: SpellInfo = {
      editable: true,
      name: spellName,
      class: spellClass,
      stat: spellStat,
      tier: parseInt(spellTier) as SpellTier,
      range: spellRange,
      duration: {
        type: durType,
      },
      desc: spellDesc,
    };

    if (spellDurationT === "Time") {
      s.duration.subType = spellDurationSubType;
      if (spellRollDiceType.length > 0) {
        s.duration.roll = {
          diceType: spellRollDiceType as DiceType,
          numDice: spellAmt,
        };
      } else {
        s.duration.amt = spellAmt;
      }
    }

    if (spellToEdit) {
      Object.assign(spellToEdit, s);
      if (currSpell) {
        currSpell.name = s.name;
      }
    } else {
      $pc.spells.push({ name: s.name });
      $pc.customSpells.push(s);
    }

    $pc = $pc;
    dispatch("finish");
  }
</script>

<div class="w-full flex flex-col gap-1 min-w-[250px]">
  <label for="spellName">Name</label>
  <input type="text" id="spellName" bind:value={spellName} />

  <label for="spellClass">Class</label>
  <select bind:value={spellClass}>
    <option>Priest</option>
    <option>Wizard</option>
    <option value="PriestWizard">Priest or Wizard</option>
    <option>Other</option>
  </select>

  <label for="spellTier">Tier</label>
  <select bind:value={spellTier}>
    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
    <option>5</option>
  </select>

  <label for="spellStat">Spell Stat</label>
  <select bind:value={spellStat}>
    {#each STATS as s}
      <option>{s}</option>
    {/each}
  </select>

  <label for="spellRange">Range</label>
  <select bind:value={spellRange}>
    {#each RANGE_TYPES as r}
      <option>{r}</option>
    {/each}
  </select>

  <label for="spellDuration">Duration</label>
  <select bind:value={spellDurationT}>
    <option>Focus</option>
    <option>Instant</option>
    <option>Time</option>
  </select>

  {#if spellDurationT === "Time"}
    <label for="">How Much Time?</label>
    <div class="flex gap-1">
      <input
        id="dice"
        type="number"
        min="1"
        inputmode="numeric"
        bind:value={spellAmt}
        class="w-10 text-center"
      />
      <select bind:value={spellRollDiceType}>
        <option />
        {#each DICE_TYPES as d}
          <option>{d}</option>
        {/each}
      </select>
      <select bind:value={spellDurationType}>
        {#each TIME_UNITS as t}
          <option>{t}</option>
        {/each}
      </select>
    </div>

    {#if spellDurationType !== "Round"}
      <label for="durSubType">In Game Time or Real Time?</label>
      <select id="durSubType" bind:value={spellDurationSubType}>
        <option>InGame</option>
        <option>RealTime</option>
      </select>
    {/if}
  {/if}

  <label for="spellDesc">Description</label>
  <textarea id="spellDesc" cols="10" bind:value={spellDesc} />

  <button
    class="bg-black text-white p-2"
    disabled={!isValid}
    class:opacity-50={!isValid}
    on:click={() => onCreateSpell()}
    >{spellToEdit ? "Update Spell" : "Create Spell"}</button
  >
</div>

<style lang="postcss">
  input {
    @apply transition-all;
  }
</style>
