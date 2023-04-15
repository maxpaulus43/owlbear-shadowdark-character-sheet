<script lang="ts">
  import OBR from "@owlbear-rodeo/sdk";
  import { rollDice } from "./utils";
  import type { DiceType } from "../types";
  import Menu from "./components/Menu/Menu.svelte";
  import MenuOption from "./components/Menu/MenuOption.svelte";

  export let modifier: number = 0;
  export let diceType: DiceType = "d20"; // default to d20

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
    const msg = `${outcome} + ${modifier} = ${outcome + modifier}`;
    OBR.notification.show(msg).catch(() => {
      alert(msg);
    });
  }

  function rollWithAdvantage() {
    const outcome1 = rollDice(diceType);
    const outcome2 = rollDice(diceType);
    const higher = Math.max(outcome1, outcome2);
    const msg = `${outcome1} vs. ${outcome2};\n ${higher} + ${modifier} = ${
      higher + modifier
    }`;
    OBR.notification.show(msg).catch(() => {
      alert(msg);
    });
  }

  function rollWithDisadvantage() {
    const outcome1 = rollDice(diceType);
    const outcome2 = rollDice(diceType);
    const lower = Math.min(outcome1, outcome2);
    const msg = `${outcome1} vs. ${outcome2};\n ${lower} + ${modifier} = ${
      lower + modifier
    }`;
    OBR.notification.show(msg).catch(() => {
      alert(msg);
    });
  }

  function onRightClick() {
    showMenu = true;
  }

  function closeMenu() {
    showMenu = false;
  }
</script>

<div class="relative">
  <button
    on:click={roll}
    on:contextmenu|preventDefault={onRightClick}
    on:touchstart={touchStart}
    on:touchend={touchEnd}
    class="bg-black text-white p-1 px-2 rounded-md"
    >🎲
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
