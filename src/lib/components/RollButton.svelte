<script lang="ts">
  import type { DiceType } from "../types";
  import { addSign, rollDice } from "../utils";
  import Menu from "./Menu/Menu.svelte";
  import MenuOption from "./Menu/MenuOption.svelte";
  import { notifiy } from "../services/Notifier";

  export let modifier: number = 0;
  export let numDice: number = 1;
  export let diceType: DiceType = "d20"; // default to d20
  export let disabled = false;

  let showMenu = false;
  let pos = { x: 0, y: 0 };
  let touchTimer: ReturnType<typeof setTimeout>;

  function touchStart(e: TouchEvent) {
    touchTimer = setTimeout(() => {
      onRightClick(e as any);
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
    const outcome = rollDice(diceType, numDice);
    let critMsg = "";
    const msg = `rolled ${numDice}${diceType}: ${critMsg}${outcome} + ${modifier} = ${
      outcome + modifier
    }`;
    notifiy(msg);
  }

  function rollWithAdvantage() {
    const outcome1 = rollDice(diceType, numDice);
    const outcome2 = rollDice(diceType, numDice);
    const higher = Math.max(outcome1, outcome2);
    let critMsg = "";
    const msg = `rolled ${numDice}${diceType}: ${critMsg}${outcome1} vs. ${outcome2};\n ${higher} + ${modifier} = ${
      higher + modifier
    }`;
    notifiy(msg);
  }

  function rollWithDisadvantage() {
    const outcome1 = rollDice(diceType, numDice);
    const outcome2 = rollDice(diceType, numDice);
    const lower = Math.min(outcome1, outcome2);
    let critMsg = "";
    const msg = `rolled ${numDice}${diceType}: ${critMsg}${outcome1} vs. ${outcome2};\n ${lower} + ${modifier} = ${
      lower + modifier
    }`;
    notifiy(msg);
  }

  function rollSecretly() {
    const outcome = rollDice(diceType, numDice);
    let critMsg = "";
    const msg = `rolled ${numDice}${diceType}: ${critMsg}${outcome} + ${modifier} = ${
      outcome + modifier
    }`;
    notifiy(msg, { secret: true });
  }

  async function onRightClick(e: MouseEvent) {
    if (!disabled) {
      if (showMenu) {
        showMenu = false;
        await new Promise((res) => setTimeout(res, 100));
      }

      // console.log(e);
      pos = { x: e.clientX, y: e.clientY };
      showMenu = true;
    }
  }

  function closeMenu() {
    showMenu = false;
  }
</script>

<div>
  <button
    on:click={roll}
    {disabled}
    on:contextmenu|preventDefault={onRightClick}
    on:touchstart={touchStart}
    on:touchend={touchEnd}
    class="bg-black text-white pt-1 px-1 rounded-md"
  >
    <slot
      ><div class="rounded-md bg-black text-white p-1">
        {addSign(modifier)}
      </div></slot
    >
  </button>

  {#if showMenu}
    <Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu}>
      <MenuOption on:click={roll} text="Roll" />
      <MenuOption on:click={rollSecretly}>
        <div class="text-black">Roll Secretly</div>
      </MenuOption>
      <MenuOption on:click={rollWithAdvantage}>
        <div class="text-green-700">Roll With Advantage</div>
      </MenuOption>
      <MenuOption on:click={rollWithDisadvantage}>
        <div class="text-red-700">Roll With Disadvantage</div>
      </MenuOption>
    </Menu>
  {/if}
</div>
