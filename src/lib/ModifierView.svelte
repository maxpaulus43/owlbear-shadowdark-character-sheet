<script lang="ts">
  import { getContext } from "svelte";
  import { calculateModifierForPlayerStat, key } from "./PlayerCharacter";
  import type { PlayerCharacter, Stat } from "../model";
  import Menu from "./Menu.svelte";
  import MenuOption from "./MenuOption.svelte";
  import Modal from "./Modal.svelte";
  import { addSign, clamp } from "./utils";

  export let forStat: Stat;
  const pc = getContext<{ getPC: () => PlayerCharacter }>(key).getPC();
  $: talents = pc.bonuses
    .filter((b) => b.sourceCategory === "Talent")
    .map((b) => b.bonusTo);
  $: bonuses = pc.bonuses
    .filter((b) => b.bonusTo.includes(forStat))
    .map((b) => `${b.bonusName} to ${b.bonusTo}`);
  const baseMod = clamp(Math.floor((pc.stats[forStat] - 10) / 2), -4, 4);
  const modifier = calculateModifierForPlayerStat(pc, forStat);

  let showMenu = false;

  let timeout;
  let didShowHover = false;

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
  function closeMenu() {
    showMenu = false;
  }
</script>

<div
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseExit}
  on:click={onRightClick}
  class="bg-gray-100 hover:bg-gray-300 cursor-pointer"
>
  {addSign(modifier)}
</div>

<Modal bind:showModal={showMenu}>
  <h2 slot="header">
    {forStat}: {addSign(modifier)}
  </h2>
  <ol>
    <li>
      Base Modifier: {addSign(baseMod)}
      {#each bonuses as b}
        <li>{b}</li>
      {/each}
    </li>
  </ol>
</Modal>
