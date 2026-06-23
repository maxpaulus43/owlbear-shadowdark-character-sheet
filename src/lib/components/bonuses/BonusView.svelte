<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    calculateBonusAmount,
    pc,
  } from "../../model/PlayerCharacter";
  import type { Bonus } from "../../types";
  import { addSign } from "../../utils";
  import Modal from "../Modal.svelte";

  const dispatch = createEventDispatcher();

  export let bonus: Bonus;
  export let showInfo = true;
  export let showDelete = false;
  let showModal = false;
  $: b = bonus;

  $: resolvedB = b.type === "choice" && b.choices && b.selectedChoiceId
    ? b.choices.find((c) => c.id === b.selectedChoiceId)?.bonus
    : undefined;

  $: activeB = resolvedB || b;

  let displayableName = "";
  $: if (b.bonusSource === "Ancestry" && b.name) {
    displayableName = b.name.split(":")[0] + ":";
  } else {
    switch (activeB.metadata?.type) {
      case "weapon": {
        displayableName = activeB.metadata.weapon + ":";
        break;
      }
      case "weaponType": {
        displayableName = activeB.metadata.weaponType + ":";
        break;
      }
      case "armor": {
        displayableName = activeB.metadata.armor + ":";
        break;
      }
      case "stat": {
        displayableName = activeB.metadata.stat + ":";
        break;
      }
      case "spell": {
        displayableName = activeB.metadata.spell + ":";
        break;
      }
      default: {
        displayableName = "";
      }
    }
  }

  function getGeneratedDesc(b: Bonus): string {
    if (b.desc) return b.desc;
    let target = b.metadata?.type === "stat" ? b.metadata.stat : 
                 b.metadata?.type === "weapon" ? b.metadata.weapon : 
                 b.metadata?.type === "armor" ? b.metadata.armor : 
                 b.metadata?.type === "spell" ? b.metadata.spell : 
                 b.metadata?.type === "weaponType" ? b.metadata.weaponType : "";
    let prefix = target ? `${target}: ` : "";
    if (b.type === "modifyAmt") {
      return `${prefix}+${b.bonusAmount} to ${b.bonusTo}`;
    } else if (b.type === "advantage" || b.type === "disadvantage") {
      return `${prefix}${b.type} on ${b.bonusTo}`;
    } else if (b.type === "diceType") {
      return `${prefix}${b.diceType} on ${b.bonusTo}`;
    } else {
      return `${prefix}generic bonus`;
    }
  }
</script>

<div class="flex justify-between gap-3 items-center w-full">
  <div class="flex gap-1">
    {#if activeB.type === "choice"}
      <div class="font-bold">{displayableName}</div>
      <div class="text-red-600 font-semibold italic">select one...</div>
    {:else if activeB.type === "generic"}
      <div class="font-bold">{displayableName}</div>
      <div>{activeB.desc || getGeneratedDesc(activeB)}</div>
    {:else if activeB.type === "modifyAmt"}
      <div class="font-bold">{displayableName}</div>
      <div>{addSign(calculateBonusAmount($pc, activeB))} to {activeB.bonusTo}</div>
    {:else if activeB.type === "disadvantage" || activeB.type === "advantage"}
      <div class="font-bold">{displayableName}</div>
      <div>{activeB.type} on {activeB.bonusTo}s</div>
    {:else if activeB.type === "diceType"}
      <div class="font-bold">{displayableName}</div>
      <div>{activeB.diceType} on {activeB.bonusTo}</div>
    {/if}
    {#if showInfo && (b.name || b.desc)}
      <button
        on:click={() => {
          showModal = true;
        }}
      >
        <i class="material-icons">info</i>
      </button>
    {/if}
  </div>
  {#if showDelete}
    <div class="flex gap-1">
      <button
        class="pt-1 px-1 rounded-md bg-black text-white"
        on:click={() => dispatch("delete")}
      >
        <i class="material-icons text-sm">delete</i>
      </button>
    </div>
  {/if}
</div>

{#if showModal}
  <Modal bind:showModal>
    <h2 slot="header">
      {#if b.type === "choice" && b.selectedChoiceId}
        {b.name}: {b.choices.find((c) => c.id === b.selectedChoiceId)?.name}
      {:else}
        {b.name || "Bonus"}
      {/if}
    </h2>
    <div class="flex flex-col gap-2 my-2 text-black text-sm">
      <div><strong>Description:</strong> {activeB.desc || getGeneratedDesc(activeB)}</div>
      <div><strong>Source:</strong> {b.bonusSource ?? "none"}</div>
      <div><strong>Editable:</strong> {b.editable ?? "no"}</div>

      {#if b.type === "choice" && b.choices}
        <div class="mt-3 flex flex-col gap-1 border-t pt-3">
          <label for="ancestry-bonus-select" class="font-semibold text-xs text-gray-700">SELECT OPTION</label>
          <select
            id="ancestry-bonus-select"
            value={b.selectedChoiceId || ""}
            on:change={(e) => {
              b.selectedChoiceId = e.target.value;
              $pc = $pc;
            }}
            class="border p-1.5 rounded text-black bg-white w-full text-sm"
          >
            <option value="" disabled>Select one...</option>
            {#each b.choices as choice}
              <option value={choice.id}>{choice.name}</option>
            {/each}
          </select>
        </div>
      {/if}
    </div>
  </Modal>
{/if}
