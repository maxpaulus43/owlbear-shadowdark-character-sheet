<script lang="ts">
  import Modal from "./Modal.svelte";
  import SPELL_COMPENDIUM from "../compendium/spellCompendium";
  import {
    learnSpellForPlayer,
    PlayerCharacterStore as pc,
    playerCanLearnSpell,
    playerHasSpell,
    unlearnSpellForPlayer,
  } from "../model/PlayerCharacter";
  import type { SpellInfo } from "../model/Spell";
  import SpellView from "./SpellView.svelte";
  let showModal = false;
  let spellInput: string = "";

  $: spells = Object.values(SPELL_COMPENDIUM).filter((s) => {
    const term = spellInput.toLowerCase();
    return (
      s.name.toLowerCase().includes(term) ||
      s.class.toLowerCase().includes(term) ||
      s.desc.toLowerCase().includes(term) ||
      term.toLowerCase().includes(`${s.tier}`) ||
      s.range.toLowerCase().includes(term) ||
      s.duration.type.toLowerCase().includes(term)
    );
  });

  function learnSpell(s: SpellInfo) {
    learnSpellForPlayer($pc, s);
    $pc = $pc;
  }
  function unLearnSpell(s: SpellInfo) {
    unlearnSpellForPlayer($pc, s);
    $pc = $pc;
  }
</script>

<button
  class="bg-black text-white p-2 w-full"
  on:click={() => (showModal = true)}>Spells</button
>

<Modal bind:showModal>
  <h2 slot="header" class="text-lg font-bold">Spells</h2>
  <div class="max-h-[500px] overflow-auto">
    <input
      class="w-full"
      type="text"
      bind:value={spellInput}
      placeholder="search e.g. Burning Hands"
    />
    <ol>
      {#each spells as s}
        <li>
          <div class="shadow-md border border-gray-200 mb-3 p-2">
            <SpellView {s} />
            {#if playerHasSpell($pc, s)}
              <button
                class="bg-gray-600 text-white w-full p-3"
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
          </div>
        </li>
      {/each}
    </ol>
  </div>
</Modal>
