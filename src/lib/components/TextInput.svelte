<script lang="ts">
  export let value: string;
</script>

<div class="relative">
  <input type="text" bind:value {...$$restProps} />
  {#if value}
    <button
      class="absolute right-0"
      on:click={() => {
        value = "";
      }}
    >
      <i
        class="material-icons bg-gray-500 text-white rounded-full text-md p-1 scale-[60%]"
      >
        close
      </i>
    </button>
  {/if}
</div>

<style>
  input {
    padding-right: 2rem;
  }
</style>
