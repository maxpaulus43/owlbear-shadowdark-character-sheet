<script lang="ts">
  import { setContext, createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { key } from "./MenuModel";

  export let x: number;
  export let y: number;
  let menuEl: HTMLElement;

  $: if (menuEl) {
    const rect = menuEl.getBoundingClientRect();
    x = Math.min(window.innerWidth - rect.width, x);
    y = Math.min(window.innerHeight - rect.height, y);
  }

  const dispatch = createEventDispatcher();

  setContext(key, {
    dispatchClick: () => dispatch("click"),
  });

  function onPageClick(e: Event) {
    if (e.target === menuEl || menuEl.contains(e.target as Node)) return;
    dispatch("clickoutside");
  }
</script>

<svelte:body on:click={onPageClick} />

<div
  transition:fade={{ duration: 100 }}
  bind:this={menuEl}
  style="top: {y}px; left: {x}px;"
>
  <slot />
</div>

<style>
  div {
    position: fixed;
    display: grid;
    border: 1px solid #0003;
    box-shadow: 2px 2px 5px 0px #0002;
    background: white;
    z-index: 10;
  }
</style>

