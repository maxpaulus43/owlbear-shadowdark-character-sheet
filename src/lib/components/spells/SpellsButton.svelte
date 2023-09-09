<script lang="ts">
  import Modal from "../Modal.svelte";
  import SpellShopView from "./SpellShopView.svelte";
  let showModal = false;
</script>

<button
  class="bg-black text-white p-2 w-full"
  on:click={() => {
    showModal = true;
  }}>Spells</button
>

<!-- Always Keep this rendered because we want to preserve the state of the shop's filters etc... -->
<Modal bind:showModal>
  <h2 slot="header" class="text-lg font-bold">Spells</h2>
  <SpellShopView />
</Modal>
