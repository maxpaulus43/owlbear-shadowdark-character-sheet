<script lang="ts">
  import { ANCESTRIES } from "../constants";
  import {
    PlayerCharacterStore as pc,
    setAncestryForPlayer,
  } from "../model/PlayerCharacter";
  import type { Ancestry } from "../types";
  import Modal from "./Modal.svelte";

  let showChoiceModal = false;
  let tempFarsightChoice = "ranged";
  let tempKnackChoice = "spellcasting";

  function onToggleCustomAncestry(e: Event) {
    $pc.hasCustomAncestry = (e.target as HTMLInputElement).checked;
  }

  function onAncestryChange(e: Event) {
    const a: Ancestry = (e.target as HTMLSelectElement).value as Ancestry;
    setAncestryForPlayer($pc, a);
    $pc = $pc;
    if (a === "Elf") {
      tempFarsightChoice = "ranged";
      showChoiceModal = true;
    } else if (a === "Kobold") {
      tempKnackChoice = "spellcasting";
      showChoiceModal = true;
    }
  }

  function confirmChoice() {
    if ($pc.ancestry === "Elf") {
      $pc.bonuses = $pc.bonuses.filter(
        (b) => b.name !== "Farsight: Ranged Attacks" && b.name !== "Farsight: Spellcasting"
      );
      if (tempFarsightChoice === "spellcasting") {
        $pc.bonuses.push({
          name: "Farsight: Spellcasting",
          desc: "+1 bonus to spellcasting checks",
          bonusSource: "Ancestry",
          type: "modifyAmt",
          bonusTo: "spellcastRoll",
          bonusAmount: 1,
        });
      } else {
        $pc.bonuses.push({
          name: "Farsight: Ranged Attacks",
          desc: "+1 bonus to attack rolls with ranged weapons",
          bonusSource: "Ancestry",
          type: "modifyAmt",
          bonusTo: "attackRoll",
          bonusAmount: 1,
          metadata: {
            type: "weaponType",
            weaponType: "Ranged",
          },
        });
      }
    } else if ($pc.ancestry === "Kobold") {
      $pc.bonuses = $pc.bonuses.filter(
        (b) => b.name !== "Knack: Spellcasting" && b.name !== "Knack: Luck Token"
      );
      if (tempKnackChoice === "luck") {
        $pc.bonuses.push({
          name: "Knack: Luck Token",
          desc: "Begin each session with a luck token",
          bonusSource: "Ancestry",
          type: "generic",
        });
      } else {
        $pc.bonuses.push({
          name: "Knack: Spellcasting",
          desc: "+1 to spellcasting checks",
          bonusSource: "Ancestry",
          type: "modifyAmt",
          bonusTo: "spellcastRoll",
          bonusAmount: 1,
        });
      }
    }
    $pc = $pc;
    showChoiceModal = false;
  }
</script>

<div class="flex justify-between">
  <h2>ANCESTRY</h2>
  <div class="flex items-center gap-1">
    <input
      id="customAncestry"
      type="checkbox"
      checked={$pc.hasCustomAncestry}
      on:input={onToggleCustomAncestry}
    />
    <label for="customAncestry">Custom</label>
  </div>
</div>
{#if $pc.hasCustomAncestry}
  <input type="text" value={$pc.ancestry} on:input={onAncestryChange} />
{:else}
  <select value={$pc.ancestry} on:change={onAncestryChange}>
    {#each ANCESTRIES as ancestry}
      <option value={ancestry}>
        {ancestry}
      </option>
    {/each}
  </select>

  {#if $pc.ancestry === "Elf" || $pc.ancestry === "Kobold"}
    <button
      type="button"
      class="text-xs text-blue-600 hover:text-blue-800 underline mt-1 text-left"
      on:click={() => {
        if ($pc.ancestry === "Elf") {
          tempFarsightChoice = $pc.bonuses.find((b) => b.name === "Farsight: Spellcasting") ? "spellcasting" : "ranged";
        } else if ($pc.ancestry === "Kobold") {
          tempKnackChoice = $pc.bonuses.find((b) => b.name === "Knack: Luck Token") ? "luck" : "spellcasting";
        }
        showChoiceModal = true;
      }}
    >
      Choose {$pc.ancestry === "Elf" ? "Farsight" : "Knack"} option...
    </button>
  {/if}
{/if}

{#if showChoiceModal}
  <Modal bind:showModal={showChoiceModal}>
    <h2 slot="header" class="text-lg font-bold">
      {#if $pc.ancestry === "Elf"}
        Choose Elf Ancestral Bonus: Farsight
      {:else}
        Choose Kobold Ancestral Bonus: Knack
      {/if}
    </h2>

    <div class="flex flex-col gap-4 my-4 text-black">
      {#if $pc.ancestry === "Elf"}
        <p class="text-sm text-gray-600">
          Elves get the <strong>Farsight</strong> ancestry talent. Choose one of the following benefits:
        </p>
        <div class="flex flex-col gap-2">
          <label class="flex items-start gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="elf-choice" value="ranged" bind:group={tempFarsightChoice} class="mt-1" />
            <div>
              <div class="font-semibold">+1 to Ranged Attacks</div>
              <div class="text-xs text-gray-500">You get a +1 bonus to attack rolls with ranged weapons.</div>
            </div>
          </label>
          <label class="flex items-start gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="elf-choice" value="spellcasting" bind:group={tempFarsightChoice} class="mt-1" />
            <div>
              <div class="font-semibold">+1 to Spellcasting Checks</div>
              <div class="text-xs text-gray-500">You get a +1 bonus to spellcasting checks.</div>
            </div>
          </label>
        </div>
      {:else}
        <p class="text-sm text-gray-600">
          Kobolds get the <strong>Knack</strong> ancestry talent. Choose one of the following benefits:
        </p>
        <div class="flex flex-col gap-2">
          <label class="flex items-start gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="kobold-choice" value="spellcasting" bind:group={tempKnackChoice} class="mt-1" />
            <div>
              <div class="font-semibold">+1 to Spellcasting Checks</div>
              <div class="text-xs text-gray-500">You get a +1 bonus to spellcasting checks.</div>
            </div>
          </label>
          <label class="flex items-start gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="kobold-choice" value="luck" bind:group={tempKnackChoice} class="mt-1" />
            <div>
              <div class="font-semibold">Luck Token Session Start</div>
              <div class="text-xs text-gray-500">You may begin each session with a luck token.</div>
            </div>
          </label>
        </div>
      {/if}

      <button
        type="button"
        class="mt-2 w-full p-2 bg-black text-white font-bold rounded hover:bg-gray-800"
        on:click={confirmChoice}
      >
        Confirm Choice
      </button>
    </div>
  </Modal>
{/if}
