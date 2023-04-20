<script lang="ts">
  import { findWeapon } from "../compendium";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";

  $: weapons = $pc.gear
    .filter((g) => g.equipped)
    .map((g) => findWeapon(g.name))
    .filter(Boolean);
</script>

<h2>ATTACKS</h2>
{#each weapons as w}
  <div>{w.name} {JSON.stringify(w.damage)}</div>
{/each}
