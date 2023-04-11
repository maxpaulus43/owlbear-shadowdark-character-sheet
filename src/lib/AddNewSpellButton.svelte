<script lang="ts">
  import { SPELLS, type Spell } from "../types";
  import Modal from "./Modal.svelte";
  import {
    learnSpellForPlayer,
    PlayerCharacterStore as pc,
    unlearnSpellForPlayer,
  } from "./PlayerCharacter";
  let showModal = false;
  let spellInput: string = "";
  $: spells = SPELLS.filter(
    (s) =>
      s.name.toLowerCase().includes(spellInput) ||
      s.desc.toLowerCase().includes(spellInput)
  );
  function learnSpell(s: Spell) {
    learnSpellForPlayer(s, $pc);
    $pc = $pc;
  }
  function unLearnSpell(s: Spell) {
    unlearnSpellForPlayer(s, $pc);
    $pc = $pc;
  }
</script>

<button class="bg-black text-white p-2" on:click={() => (showModal = true)}
  >Spells</button
>

<Modal bind:showModal>
  <h2 slot="header" class="text-lg font-bold">Spells</h2>
  <div class="max-h-96 overflow-auto">
    <input
      class="p-1 w-full"
      type="text"
      bind:value={spellInput}
      placeholder="search e.g. Burning Hands"
    />
    <ol>
      {#each spells as s}
        <li>
          <div class="shadow-md border border-gray-200 mb-3 p-2">
            <div>
              <span class="font-bold text-lg">{s.name}</span>
              <span>(Tier {s.tier}, {s.class})</span>
            </div>
            <div>
              <span class="font-bold">Duration:</span>
              <span
                >{s.duration.amt ?? ""}{s.duration.diceType ?? ""}{" " +
                  s.duration.type}</span
              >
            </div>
            <div>
              <span class="font-bold mr-1">Range:</span><span>{s.range}</span>
            </div>
            <div>{s.desc}</div>
            {#if $pc.spellsKnown.includes(s.name)}
              <button
                class="bg-gray-600 text-white w-full p-3"
                on:click={() => unLearnSpell(s)}>Unlearn</button
              >
            {:else}
              <button
                class="bg-black text-white w-full p-3"
                on:click={() => learnSpell(s)}>Learn</button
              >
            {/if}
          </div>
        </li>
      {/each}
    </ol>
  </div>
</Modal>
