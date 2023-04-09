<script lang="ts">
  import { setContext, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { key } from "./MenuModel";

  const dispatch = createEventDispatcher();

  setContext(key, {
    dispatchClick: () => dispatch("click"),
  });

  let menuEl: HTMLElement;

  function onPageClick(e: MouseEvent) {
    if (e.target === menuEl || menuEl.contains(e.target as Node)) return;
    dispatch("clickoutside");
  }
</script>

<svelte:body on:click={onPageClick} />

<div transition:fade={{ duration: 100 }} bind:this={menuEl} class="left-5">
  <slot />
</div>

<style>
  div {
    position: absolute;
    display: grid;
    border: 1px solid #0003;
    box-shadow: 2px 2px 5px 0px #0002;
    background: white;
    z-index: 10;
  }
</style>
