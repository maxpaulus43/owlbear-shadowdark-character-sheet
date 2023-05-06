<script lang="ts">
  import {
    calculateModifierForPlayerStat,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import type { Stat } from "../types";
  import { clamp, addSign } from "../utils";
  import Modal from "./Modal.svelte";

  export let forStat: Stat;
  $: bonuses = [];
  // $pc.bonuses
  //   .filter((b) => b.bonusTo.includes(forStat))
  //   .map((b) => `${b.bonusName} to ${b.bonusTo}`);
  $: baseMod = clamp(Math.floor(($pc.stats[forStat] - 10) / 2), -4, 4);
  $: modifier = calculateModifierForPlayerStat($pc, forStat);

  let showMenu = false;

  let timeout: ReturnType<typeof setTimeout>;

  function mouseEnter() {
    timeout = setTimeout(() => {
      onRightClick();
      timeout = null;
    }, 1000);
  }
  function mouseExit() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  }

  function onRightClick() {
    showMenu = true;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseExit}
  on:click={onRightClick}
  class="bg-gray-100 hover:bg-gray-300 cursor-pointer p-1"
>
  ({addSign(modifier)})
</div>

<Modal bind:showModal={showMenu}>
  <h1 slot="header">
    {forStat}: {addSign(modifier)}
  </h1>
  <ol>
    <li>
      Base Modifier: {addSign(baseMod)}
      {#each bonuses as b}
        <li>{b}</li>
      {/each}
    </li>
  </ol>
</Modal>
