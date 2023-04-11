<script lang="ts">
  import { getContext } from "svelte";
  import { key } from "./MenuModel";

  export let isDisabled = false;
  export let text = "";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const { dispatchClick } = getContext<any>(key);

  const handleClick = () => {
    if (isDisabled) return;
    dispatch("click");
    dispatchClick();
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class:disabled={isDisabled}
  class="active:bg-gray-100"
  on:click={handleClick}
>
  {#if text}
    {text}
  {:else}
    <slot />
  {/if}
</div>

<style>
  div {
    padding: 4px 15px;
    cursor: default;
    font-size: 14px;
    display: flex;
    align-items: center;
    grid-gap: 5px;
  }
  div:hover {
    background: #0002;
  }
  div.disabled {
    color: #0006;
  }
  div.disabled:hover {
    background: white;
  }
</style>
