<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    deleteCustomPlayerSpell,
    learnSpellForPlayer,
    PlayerCharacterStore as pc,
    playerCanLearnSpell,
    playerHasSpell,
    unlearnSpellForPlayer,
  } from "../model/PlayerCharacter";
  import type { SpellInfo } from "../types";

  export let s: SpellInfo;
  $: duration = s.duration.amt > 0 ? s.duration.amt : "";
  $: theS = Boolean(s.duration.amt > 1 || s.duration.roll) ? "s" : "";
  let dispatch = createEventDispatcher();

  function learnSpell(s: SpellInfo) {
    learnSpellForPlayer($pc, s);
    $pc = $pc;
  }
  function unLearnSpell(s: SpellInfo) {
    unlearnSpellForPlayer($pc, s);
    $pc = $pc;
    dispatch("close");
  }
  function deleteSpell(s: SpellInfo) {
    deleteCustomPlayerSpell($pc, s);
    $pc = $pc;
    dispatch("close");
  }
</script>

<div class="shadow-md border border-gray-200 mb-3 p-2">
  <div>
    <span class="font-bold text-lg">{s.name}</span>
    <span>(Tier {s.tier}, {s.class})</span>
  </div>
  {#if s.stat}
    <div>
      <span class="font-bold">Stat:</span>
      <span>{s.stat}</span>
    </div>
  {/if}
  <div>
    <span class="font-bold">Duration:</span>
    <span>
      {duration}{s.duration.roll?.numDice ?? ""}{s.duration.roll?.diceType ??
        ""}{" " + s.duration.type}{theS}
    </span>
  </div>
  <div>
    <span class="font-bold mr-1">Range:</span><span>{s.range}</span>
  </div>
  <div>{s.desc}</div>
  <div class="flex gap-1">
    {#if playerHasSpell($pc, s)}
      <button
        class="bg-black text-white w-full p-3"
        on:click={() => unLearnSpell(s)}>Unlearn</button
      >
    {:else if playerCanLearnSpell($pc, s)}
      <button
        class="bg-black text-white w-full p-3"
        on:click={() => learnSpell(s)}>Learn</button
      >
    {:else}
      <button
        class="bg-gray-600 text-white w-full p-3"
        on:click={() => learnSpell(s)}
        disabled>Cannot Learn</button
      >
    {/if}
    {#if s.editable}
      <button class="bg-black text-white p-3" on:click={() => deleteSpell(s)}>
        <i class="material-icons translate-y-1">delete</i>
      </button>
    {/if}
  </div>
</div>
