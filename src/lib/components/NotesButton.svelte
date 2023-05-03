<script lang="ts">
  import Modal from "./Modal.svelte";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";

  let showModal = false;
</script>

<button class="bg-black text-white px-1" on:click={() => (showModal = true)}
  ><i class="material-icons translate-y-1">notes</i></button
>

<Modal bind:showModal>
  <h1 slot="header">Notes</h1>
  <textarea
    bind:value={$pc.notes}
    class="w-[300px] h-[500px] md:w-[700px] md:h-[550px] resize-none"
  />
</Modal>
