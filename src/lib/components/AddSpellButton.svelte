<script lang="ts">
  import Modal from "./Modal.svelte";
  import SPELL_COMPENDIUM from "../compendium/spellCompendium";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";
  import SpellView from "./SpellView.svelte";

  let showModal = false;
  let inputEl: HTMLInputElement;
  let spellInput: string = "";

  let showTier1 = true;
  let showTier2 = true;
  let showTier3 = true;
  let showTier4 = true;
  let showTier5 = true;

  let showPriest = true;
  let showWizard = true;
  let showOther = true;

  let showSelf = true;
  let showClose = true;
  let showNear = true;
  let showFar = true;

  $: spells = Object.values(SPELL_COMPENDIUM)
    .concat($pc.customSpells ?? [])
    .filter((s) => {
      if (!showTier1 && s.tier === 1) return false;
      if (!showTier2 && s.tier === 2) return false;
      if (!showTier3 && s.tier === 3) return false;
      if (!showTier4 && s.tier === 4) return false;
      if (!showTier5 && s.tier === 5) return false;
      if (!showPriest && s.class === "Priest") return false;
      if (!showWizard && s.class === "Wizard") return false;
      if (!showOther && s.class === "Other") return false;
      if (!showSelf && s.range === "Self") return false;
      if (!showClose && s.range === "Close") return false;
      if (!showNear && s.range === "Near") return false;
      if (!showFar && s.range === "Far") return false;

      const term = spellInput.toLowerCase();
      return (
        s.name.toLowerCase().includes(term) ||
        s.desc.toLowerCase().includes(term) ||
        s.duration.type.toLowerCase().includes(term)
      );
    });
</script>

<button
  class="bg-black text-white p-2 w-full"
  on:click={() => {
    setTimeout(() => {
      inputEl.focus();
    });
    showModal = true;
  }}>Spells</button
>

<Modal bind:showModal>
  <h2 slot="header" class="text-lg font-bold">Spells</h2>
  <div class="flex flex-col gap-1">
    <input
      class="w-full"
      type="text"
      bind:this={inputEl}
      bind:value={spellInput}
      placeholder="search e.g. Burning Hands"
    />
    <div class="flex gap-1 items-center">
      <div class="font-bold">Tier:</div>
      <input id="showTier1" type="checkbox" bind:checked={showTier1} />
      <label for="showTier1">1</label>
      <input id="showTier2" type="checkbox" bind:checked={showTier2} />
      <label for="showTier2">2</label>
      <input id="showTier3" type="checkbox" bind:checked={showTier3} />
      <label for="showTier3">3</label>
      <input id="showTier4" type="checkbox" bind:checked={showTier4} />
      <label for="showTier4">4</label>
      <input id="showTier5" type="checkbox" bind:checked={showTier5} />
      <label for="showTier5">5</label>
    </div>
    <div class="flex gap-1 items-center">
      <div class="font-bold">Class:</div>
      <input id="showPriest" type="checkbox" bind:checked={showPriest} />
      <label for="showPriest">Priest</label>
      <input id="showWizard" type="checkbox" bind:checked={showWizard} />
      <label for="showWizard">Wizard</label>
      <input id="showOther" type="checkbox" bind:checked={showOther} />
      <label for="showWizard">Other</label>
    </div>
    <div class="flex gap-1 items-center">
      <div class="font-bold">Range:</div>
      <input id="showSelf" type="checkbox" bind:checked={showSelf} />
      <label for="showSelf">Self</label>
      <input id="showClose" type="checkbox" bind:checked={showClose} />
      <label for="showClose">Close</label>
      <input id="showNear" type="checkbox" bind:checked={showNear} />
      <label for="showNear">Near</label>
      <input id="showFar" type="checkbox" bind:checked={showFar} />
      <label for="showFar">Far</label>
    </div>
    <div class="max-h-[500px] overflow-auto">
      <ol>
        {#each spells as s}
          <li>
            <div class="shadow-md border border-gray-200 mb-3 p-2">
              <SpellView {s} />
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</Modal>

<style lang="postcss">
  input[type="checkbox"] {
    @apply w-4 h-4;
  }
</style>
