<script lang="ts">
  import Modal from "../Modal.svelte";
  import CustomBonusForm from "./CustomBonusForm.svelte";
  let showForm = false;
  let showModal = false;
</script>

<button
  class="w-full bg-black text-white p-2"
  on:click={() => {
    showForm = true;
    showModal = true;
  }}>Custom Bonus</button
>

{#if showForm}
  <Modal bind:showModal>
    <h1 slot="header">Custom Bonus</h1>
    <CustomBonusForm
      on:finish={() => {
        showForm = false;
      }}
    />
  </Modal>
{/if}
