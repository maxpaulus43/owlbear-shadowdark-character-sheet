<script lang="ts">
  import {
    calculateBonusAmount,
    deleteBonusForPlayer,
    pc,
  } from "../../model/PlayerCharacter";
  import type { Bonus } from "../../types";
  import { addSign } from "../../utils";
  import Modal from "../Modal.svelte";

  export let bonus: Bonus;
  export let showInfo = true;
  let showModal = false;
  $: b = bonus;

  let displayableName = "";
  $: switch (b.metadata?.type) {
    case "weapon": {
      displayableName = b.metadata.weapon + ":";
      break;
    }
    case "weaponType": {
      displayableName = b.metadata.weaponType + ":";
      break;
    }
    case "armor": {
      displayableName = b.metadata.armor + ":";
      break;
    }
    case "stat": {
      displayableName = b.metadata.stat + ":";
      break;
    }
    case "spell": {
      displayableName = b.metadata.spell + ":";
      break;
    }
    default: {
      displayableName = "";
    }
  }

  function deleteBonus(b: Bonus) {
    deleteBonusForPlayer($pc, b);
    $pc = $pc;
  }
</script>

<div class="flex justify-between gap-3 items-center">
  <div class="flex gap-1">
    {#if b.type === "generic"}
      <div>{b.desc}</div>
    {:else if b.type === "modifyAmt"}
      <div class="font-bold">{displayableName}</div>
      <div>{addSign(calculateBonusAmount($pc, b))} to {b.bonusTo}</div>
    {:else if b.type === "disadvantage" || b.type === "advantage"}
      <div class="font-bold">{displayableName}</div>
      <div>{b.type} on {b.bonusTo}s</div>
    {:else if b.type === "diceType"}
      <div class="font-bold">{displayableName}</div>
      <div>{b.diceType} on {b.bonusTo}</div>
    {/if}
    {#if showInfo}
      <button
        on:click={() => {
          showModal = true;
        }}
      >
        <i class="material-icons">info</i>
      </button>
    {/if}
  </div>
  {#if b.editable}
    <div class="flex gap-1">
      <button
        class="pt-1 px-1 rounded-md bg-black text-white"
        on:click={() => deleteBonus(b)}
      >
        <i class="material-icons">delete</i>
      </button>
    </div>
  {/if}
</div>

{#if showModal}
  <Modal bind:showModal>
    <h2 slot="header">{b.name}</h2>
    <div>Description: {b.desc}</div>
    <div>Source: {b.bonusSource ?? "none"}</div>
    <div>Editable: {b.editable ?? "no"}</div>
  </Modal>
{/if}
