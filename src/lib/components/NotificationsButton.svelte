<script lang="ts">
  import {
    Notifications,
    clearNotifications,
  } from "../services/NotificationLogger";
  import Modal from "./Modal.svelte";

  let showModal = false;
  const fmt = new Intl.DateTimeFormat("en-US", { timeStyle: "medium" });
</script>

<button class="bg-black text-white px-1" on:click={() => (showModal = true)}
  ><i class="material-icons translate-y-1">history</i></button
>

<Modal bind:showModal>
  <h1 slot="header">Notifications</h1>
  <div class="w-[300px] h-[500px] md:w-[700px] md:h-[550px] resize-none">
    <div class="flex flex-col gap-1">
      {#each $Notifications as n}
        <div
          class="shadow-sm rounded-md border border-gray-200 p-2 flex flex-col md:flex-row justify-between"
        >
          <span>{n.msg}</span>
          <span class="text-gray-400">{fmt.format(n.timestamp)}</span>
        </div>
      {/each}
      {#if $Notifications.length}
        <button class="p-2 bg-white" on:click={clearNotifications}>
          <i class="material-icons translate-y-1">delete</i>
          Clear Notifications
        </button>
      {/if}
    </div>
  </div>
</Modal>
