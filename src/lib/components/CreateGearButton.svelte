<script lang="ts">
  import CustomGearForm from "./CustomGearForm.svelte";
  import Modal from "./Modal.svelte";
  let showModal = false;
</script>

<button
  class="bg-black text-white px-2"
  on:click={() => {
    showModal = true;
  }}>Custom Gear</button
>

<Modal bind:showModal>
  <h2 slot="header">Custom Gear</h2>
  <CustomGearForm />
</Modal>
