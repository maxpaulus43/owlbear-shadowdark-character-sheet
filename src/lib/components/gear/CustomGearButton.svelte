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
    <h1 slot="header">Custom Gear</h1>
    <CustomGearForm
      on:finish={() => {
        showForm = false;
      }}
    />
  </Modal>
{/if}
