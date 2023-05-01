<script lang="ts">
  import { findAny } from "../compendium";
  import { CLASSES } from "../constants";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";
  import { alphabetically } from "../utils";
  import AddBonusButton from "./AddBonusButton.svelte";
  import BonusView from "./BonusView.svelte";
  import RollTalentButton from "./RollTalentButton.svelte";

  $: equippableGearWithBonuses = $pc.gear
    .filter((g) => g.equipped)
    .map((g) => findAny(g.name))
    .filter((g) => g && g.canBeEquipped && g.playerBonuses?.length > 0);

  $: otherGearWithBonuses = $pc.gear
    .filter((g) => !g.equipped)
    .map((g) => findAny(g.name))
    .filter((g) => g && g.playerBonuses?.length > 0 && !g.canBeEquipped);
</script>

<h2>Bonuses</h2>
<ul class="px-1">
  {#each $pc.bonuses.sort((a, b) => alphabetically(a.desc, b.desc)) as b}
    <li class="border-b">
      <BonusView bonus={b} />
    </li>
  {/each}
</ul>

<h2>Bonuses From Items</h2>
<ul>
  {#each otherGearWithBonuses.sort( (a, b) => alphabetically(a.name, b.name) ) as g}
    <li class="border-b">
      <div class="font-bold bg-gray-300">{g.name}</div>
      <ul>
        {#each g.playerBonuses as b}
          <li class="border-b ps-8 flex gap-1">* <BonusView bonus={b} /></li>
        {/each}
      </ul>
    </li>
  {/each}
  {#each equippableGearWithBonuses.sort( (a, b) => alphabetically(a.name, b.name) ) as g}
    <li class="border-b">
      <div class="font-bold bg-gray-300">{g.name}</div>
      <ul>
        {#each g.playerBonuses as b}
          <li class="border-b ps-8 flex gap-1">
            * <BonusView bonus={b} showInfo={false} />
          </li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>

<div class="flex gap-1">
  {#if $pc.level > 0 && $pc.class && !$pc.hasCustomClass && CLASSES.includes($pc.class)}
    <RollTalentButton />
  {/if}
  <AddBonusButton />
</div>
