<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { pc } from "../../model/PlayerCharacter";
  import type { CustomBonus, Bonus } from "../../types";
  import BonusConfigurator from "./BonusConfigurator.svelte";
  import BonusView from "./BonusView.svelte";

  const dispatch = createEventDispatcher();

  export let customBonus: CustomBonus = undefined;

  let name: string = customBonus?.name ?? "";
  let desc: string = customBonus?.desc ?? "";
  let bonuses: Bonus[] = customBonus?.bonuses ? JSON.parse(JSON.stringify(customBonus.bonuses)) : [];

  let showAddBonusForm = false;

  function removeBonusAt(index: number) {
    bonuses.splice(index, 1);
    bonuses = bonuses;
  }

  function onAddBonus(e: CustomEvent<Bonus>) {
    const newBonus = e.detail;
    newBonus.editable = true;
    newBonus.bonusSource = "Talent";
    bonuses = [...bonuses, newBonus];
    showAddBonusForm = false;
  }

  let reqsMet = false;
  $: reqsMet = Boolean(name) && Boolean(desc) && bonuses.length > 0;
  let buttonText = "ADD";
  $: {
    buttonText = reqsMet ? (customBonus ? "UPDATE" : "ADD") : "Please add name, description, and at least one bonus";
  }

  function saveCustomBonus() {
    const cb: CustomBonus = {
      name,
      desc,
      bonuses,
      editable: true
    };

    if (customBonus) {
      const idx = $pc.customBonuses?.findIndex(x => x.name === customBonus.name) ?? -1;
      if (idx > -1) {
        $pc.customBonuses[idx] = cb;
      }
    } else {
      if (!$pc.customBonuses) $pc.customBonuses = [];
      $pc.customBonuses.push(cb);
    }
    $pc = $pc;
    dispatch("finish");
  }
</script>

<div class="flex flex-col gap-1 w-full text-black">
  <label for="name">Name</label>
  <input id="name" type="text" placeholder="e.g. Belt of Giant Strength" bind:value={name} />

  <label for="desc">Description</label>
  <input id="desc" placeholder="e.g. Grants +2 Strength" bind:value={desc} />

  <div class="mt-3 border-t pt-2">
    <div class="font-bold block mb-1">Attached Bonuses</div>
    {#if bonuses.length > 0}
      <ul class="list-disc ps-4 mb-2">
        {#each bonuses as b, i}
          <li class="flex justify-between items-center text-sm py-1 border-b">
            <BonusView bonus={b} showInfo={false} />
            <button
              type="button"
              class="text-red-600 hover:text-red-800 flex items-center"
              on:click={() => removeBonusAt(i)}
            >
              <i class="material-icons text-sm">delete</i>
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="text-xs text-gray-500 mb-2">No bonuses attached yet.</div>
    {/if}

    {#if showAddBonusForm}
      <BonusConfigurator on:add={onAddBonus} />
      <button
        type="button"
        class="mt-2 text-xs text-gray-600 hover:underline"
        on:click={() => showAddBonusForm = false}
      >
        Cancel
      </button>
    {:else}
      <button
        type="button"
        class="mt-1 px-2 py-1 bg-black text-white text-xs rounded hover:bg-gray-800"
        on:click={() => showAddBonusForm = true}
      >
        Add Bonus
      </button>
    {/if}
  </div>

  <button
    class="w-full p-2 bg-black text-white mt-4 font-bold hover:bg-gray-800 disabled:opacity-50"
    disabled={!reqsMet}
    on:click={saveCustomBonus}
  >
    {buttonText}
  </button>
</div>
