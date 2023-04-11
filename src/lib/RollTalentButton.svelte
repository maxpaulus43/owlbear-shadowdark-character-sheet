<script lang="ts">
  import Modal from "./Modal.svelte";
  let showModal = false;
</script>

<button class="bg-black text-white p-2" on:click={() => (showModal = true)}
  >Roll New Talent</button
>

<Modal bind:showModal>
  <h2 slot="header" class="text-lg font-bold">Roll New Talent</h2>
  <div>ROLL BABY</div>
</Modal>
