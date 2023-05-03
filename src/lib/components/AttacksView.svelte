<script lang="ts">
  import { findCustomGear, findWeapon } from "../compendium";
  import {
    calculateAttackBonusForPlayerWeapon,
    PlayerCharacterStore as pc,
  } from "../model/PlayerCharacter";
  import { damageStringForPlayerWeapon } from "../model/Weapon";
  import { addSign } from "../utils";

  $: equippedGear = $pc.gear.filter((g) => g.equipped);
  $: weapons = equippedGear.map((g) => findWeapon(g.name)).filter(Boolean);
  $: customAttacks = equippedGear
    .map((g) => findCustomGear(g.name))
    .filter(Boolean)
    .filter((g) => g.canBeEquipped && g.properties?.includes("Attackable"));
</script>

<h2>ATTACKS</h2>
<div class="overflow-y-auto">
  <table class="table-auto w-full">
    <tr class="border-b border-gray-500">
      <th>Name</th>
      <th>Range</th>
      <th>DC</th>
      <th>Dmg</th>
    </tr>
    {#each weapons as w}
      <tr class="border-b border-gray-500">
        <td class="pr-2">{w.name}</td>
        <td>{w.range}</td>
        <td>{addSign(calculateAttackBonusForPlayerWeapon($pc, w))}</td>
        <td>{damageStringForPlayerWeapon($pc, w)}</td>
      </tr>
    {/each}
    {#each customAttacks as c}
      <tr class="border-b border-gray-500">
        <td colspan="4">{c.name}</td>
      </tr>
    {/each}
  </table>

  <!-- <table class="table-auto text-left text-sm"> -->
  <!--   <tr class="border-b"> -->
  <!--     <th>Attack</th> -->
  <!--     <th>Range</th> -->
  <!--     <th>Hit/DC</th> -->
  <!--     <th>Damage</th> -->
  <!--   </tr> -->
  <!---->
  <!--   {#each weapons as w} -->
  <!--     <tr class="border-b"> -->
  <!--       <td>{w.name}</td> -->
  <!--       <td>{w.range}</td> -->
  <!--       <td> -->
  <!--         <RollButton modifier={calculateAttackBonusForPlayerWeapon($pc, w)} /> -->
  <!--       </td> -->
  <!--       <td class="flex gap-1"> -->
  <!--         {#if w.damage.oneHanded} -->
  <!--           {@const diceType = calculateDamageDiceTypeForPlayerWeapon( -->
  <!--             $pc, -->
  <!--             w, -->
  <!--             "oneHanded" -->
  <!--           )} -->
  <!--           <RollButton -->
  <!--             {diceType} -->
  <!--             modifier={calculateDamageBonusForPlayerWeapon($pc, w)} -->
  <!--           > -->
  <!--             <div -->
  <!--               class="bg-black text-white p-1 px-2 rounded-md flex flex-col items-center text-xs" -->
  <!--             > -->
  <!--               <span>{`${w.damage.oneHanded.numDice}${diceType}`}</span> -->
  <!--               <i class="material-icons">back_hand</i> -->
  <!--             </div> -->
  <!--           </RollButton> -->
  <!--         {/if} -->
  <!--         {#if w.damage.twoHanded} -->
  <!--           {@const diceType = calculateDamageDiceTypeForPlayerWeapon( -->
  <!--             $pc, -->
  <!--             w, -->
  <!--             "twoHanded" -->
  <!--           )} -->
  <!--           <RollButton -->
  <!--             {diceType} -->
  <!--             modifier={calculateDamageBonusForPlayerWeapon($pc, w)} -->
  <!--             disabled={!canAttackTwoHanded} -->
  <!--           > -->
  <!--             <div -->
  <!--               class="bg-black text-white rounded-md p-1 px-2 flex flex-col items-center" -->
  <!--               class:opacity-50={!canAttackTwoHanded} -->
  <!--             > -->
  <!--               <span>{`${w.damage.twoHanded.numDice}${diceType}`}</span> -->
  <!--               <i class="material-icons"> sign_language </i> -->
  <!--             </div> -->
  <!--           </RollButton> -->
  <!--         {/if} -->
  <!--       </td> -->
  <!--     </tr> -->
  <!--   {/each} -->
  <!---->
  <!--   {#each customAttacks as a} -->
  <!--     <div class="py-1">{a.name}</div> -->
  <!--   {/each} -->
  <!-- </table> -->
</div>
