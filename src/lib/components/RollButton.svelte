<script lang="ts">
  import type { DiceType } from "../types";
  import { rollDice } from "../utils";
  import Menu from "./Menu/Menu.svelte";
  import MenuOption from "./Menu/MenuOption.svelte";
  import { notifiy } from "../services/Notifier";

  export let modifier: number = 0;
  export let diceType: DiceType = "d20"; // default to d20
  export let disabled = false;

  let showMenu = false;
  let touchTimer: ReturnType<typeof setTimeout>;

  function touchStart() {
    touchTimer = setTimeout(() => {
      onRightClick();
      touchTimer = null;
    }, 500);
  }
  function touchEnd() {
    if (touchTimer) {
      clearTimeout(touchTimer);
      touchTimer = null;
    }
  }

  function roll() {
    const outcome = rollDice(diceType);
    let critMsg = "";
    // if (outcome === ValueForDiceType[diceType]) {
    //   critMsg = "CRITICAL SUCCESS! ... ";
    // } else if (outcome === 1) {
    //   critMsg = "CRITICAL FAILURE! ... ";
    // }
    const msg = `${critMsg}${outcome} + ${modifier} = ${outcome + modifier}`;
    notifiy(msg);
  }

  function rollWithAdvantage() {
    const outcome1 = rollDice(diceType);
    const outcome2 = rollDice(diceType);
    const higher = Math.max(outcome1, outcome2);
    let critMsg = "";
    // if (higher === ValueForDiceType[diceType]) {
    //   critMsg = "CRITICAL SUCCESS! ... ";
    // } else if (higher === 1) {
    //   critMsg = "CRITICAL FAILURE! ... ";
    // }
    const msg = `${critMsg}${outcome1} vs. ${outcome2};\n ${higher} + ${modifier} = ${
      higher + modifier
    }`;
    notifiy(msg);
  }

  function rollWithDisadvantage() {
    const outcome1 = rollDice(diceType);
    const outcome2 = rollDice(diceType);
    const lower = Math.min(outcome1, outcome2);
    let critMsg = "";
    // if (lower === ValueForDiceType[diceType]) {
    //   critMsg = "CRITICAL SUCCESS! ... ";
    // } else if (lower === 1) {
    //   critMsg = "CRITICAL FAILURE! ... ";
    // }
    const msg = `${critMsg}${outcome1} vs. ${outcome2};\n ${lower} + ${modifier} = ${
      lower + modifier
    }`;
    notifiy(msg);
  }

  function onRightClick() {
    if (!disabled) {
      showMenu = true;
    }
  }

  function closeMenu() {
    showMenu = false;
  }
</script>

<div class="relative">
  <button
    on:click={roll}
    {disabled}
    on:contextmenu|preventDefault={onRightClick}
    on:touchstart={touchStart}
    on:touchend={touchEnd}
    class="bg-black text-white pt-1 px-1 rounded-md"
    ><slot><i class="material-icons">casino</i></slot>
  </button>

  {#if showMenu}
    <Menu on:click={closeMenu} on:clickoutside={closeMenu}>
      <MenuOption on:click={roll} text="Roll" />
      <MenuOption on:click={rollWithAdvantage}>
        <div class="text-green-700">Roll With Advantage</div>
      </MenuOption>
      <MenuOption on:click={rollWithDisadvantage}>
        <div class="text-red-700">Roll With Disadvantage</div>
      </MenuOption>
    </Menu>
  {/if}
</div>
