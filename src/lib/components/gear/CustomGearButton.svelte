<script lang="ts">
  import CustomGearForm from "./CustomGearForm.svelte";
  import Modal from "../Modal.svelte";
  let showForm = false;
  let showModal = false;
</script>

<button
  class="bg-black text-white px-2"
  on:click={() => {
    showForm = true;
    showModal = true;
  }}>Custom Gear</button
>

{#if showForm}
  <Modal bind:showModal>
    <h2 slot="header">Custom Gear</h2>
    <CustomGearForm
      on:finish={() => {
        showForm = false;
      }}
    />
  </Modal>
{/if}
