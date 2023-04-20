<script lang="ts">
  import { findWeapon } from "../compendium";
  import {
    calculateAttackBonusForPlayerWeapon,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import type { WeaponInfo } from "../model/Weapon";
  import type { Roll } from "../types";
  import { rollDice } from "../utils";
  import RollButton from "./RollButton.svelte";

  $: weapons = $pc.gear
    .filter((g) => g.equipped)
    .map((g) => findWeapon(g.name))
    .filter(Boolean);

  $: canAttackTwoHanded = weapons.length === 1;

  function rollToString(roll: Roll): string {
    return roll.numDice + roll.diceType;
  }
</script>

<h2>ATTACKS</h2>
<table class="table-auto text-left text-sm">
  <tr class="border-b">
    <th>Attack</th>
    <th>Range</th>
    <th>Hit/DC</th>
    <th>Damage</th>
  </tr>

  {#each weapons as w}
    <tr class="border-b">
      <td>{w.name}</td>
      <td>{w.range}</td>
      <td>
        <RollButton modifier={calculateAttackBonusForPlayerWeapon($pc, w)} />
      </td>
      <td class="flex gap-1">
        {#if w.damage.oneHanded}
          <button
            class="bg-black text-white p-1 px-2 rounded-md flex flex-col items-center"
          >
            <span>{rollToString(w.damage.oneHanded)}</span>
            <i class="material-icons"> back_hand </i>
          </button>
        {/if}
        {#if w.damage.twoHanded}
          <button
            class="bg-black text-white rounded-md p-1 px-2 flex flex-col items-center"
            class:opacity-50={!canAttackTwoHanded}
            disabled={!canAttackTwoHanded}
          >
            <span>{rollToString(w.damage.twoHanded)}</span>
            <i class="material-icons"> sign_language </i>
          </button>
        {/if}
      </td>
    </tr>
  {/each}
</table>
