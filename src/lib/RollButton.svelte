<script lang="ts">
  import OBR from "@owlbear-rodeo/sdk";
  import { rollDice } from "./utils";
  import { ValueForDiceType, type DiceType } from "../types";
  import Menu from "./components/Menu/Menu.svelte";
  import MenuOption from "./components/Menu/MenuOption.svelte";

  export const modifier: number = 0;
  export const diceType: DiceType = "d20"; // default to d20
  $: dice = ValueForDiceType[diceType];

  let showMenu = false;

  function roll() {
    const outcome = rollDice(dice);
    const msg = `${outcome} + ${modifier} = ${outcome + modifier}`;
    OBR.notification.show(msg).catch(() => {
      alert(msg);
    });
  }

  function rollWithAdvantage() {
    const outcome1 = rollDice(dice);
    const outcome2 = rollDice(dice);
    const higher = Math.max(outcome1, outcome2);
    const msg = `${outcome1} vs. ${outcome2};\n ${higher} + ${modifier} = ${
      higher + modifier
    }`;
    OBR.notification.show(msg).catch(() => {
      alert(msg);
    });
  }

  function rollWithDisadvantage() {
    const outcome1 = rollDice(dice);
    const outcome2 = rollDice(dice);
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
    class="bg-black text-white px-2 rounded-md">🎲</button
  >

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
