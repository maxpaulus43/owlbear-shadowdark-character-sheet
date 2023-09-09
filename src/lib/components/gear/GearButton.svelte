<script lang="ts">
  import GearShopView from "./GearShopView.svelte";
  import Modal from "../Modal.svelte";
  let showShop = false;
</script>

<button
  class="bg-black text-white px-3 rounded-md"
  on:click={() => {
    showShop = true;
  }}>Gear</button
>

<!-- Always Keep this rendered because we want to preserve the state of the shop's filters etc... -->
<Modal bind:showModal={showShop}>
  <h1 slot="header" class="min-w-[300px]">Gear Shop</h1>
  <GearShopView />
</Modal>
