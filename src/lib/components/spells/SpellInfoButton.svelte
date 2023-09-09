<script lang="ts">
  import type { SpellInfo } from "../../types";
  import Modal from "../Modal.svelte";
  import SpellView from "./SpellView.svelte";

  export let spell: SpellInfo;
  let showInfo = false;
</script>

<button
  on:click={() => {
    showInfo = true;
  }}
>
  <i class="material-icons">info</i>
</button>

<Modal bind:showModal={showInfo}>
  <h2 slot="header">{spell.name}</h2>
  <SpellView
    s={spell}
    on:close={() => {
      showInfo = false;
    }}
  />
</Modal>
