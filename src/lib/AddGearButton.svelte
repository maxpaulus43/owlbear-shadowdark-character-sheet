<script lang="ts">
  import Modal from "./Modal.svelte";
  let showModal = false;
</script>

<button class="bg-black text-white p-2" on:click={() => (showModal = true)}
  >Add Gear</button
>

<Modal bind:showModal>
  <h2 slot="header" class="text-lg font-bold">New Gear</h2>
  <div>New GEAR</div>
</Modal>
