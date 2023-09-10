<script lang="ts">
  import CustomSpellForm from "./CustomSpellForm.svelte";
  import Modal from "../Modal.svelte";
  let showForm = false;
  let showModal = false;
</script>

<button
  class="bg-black text-white w-full"
  on:click={() => {
    showForm = true;
    showModal = true;
  }}>Custom Spell</button
>

{#if showForm}
  <Modal bind:showModal vw={50}>
    <h1 slot="header">Custom Spell</h1>
    <CustomSpellForm on:finish={() => (showForm = false)} />
  </Modal>
{/if}
