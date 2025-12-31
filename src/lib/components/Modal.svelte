<script lang="ts">
  export let showModal: boolean = true;
  export let vw: number | undefined = undefined;
  export let vh: number = undefined;
  export let dialogClass: string = "";

  let dialog: HTMLDialogElement;

  $: if (dialog) {
    if (showModal) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog class="max-w-3xl {dialogClass}" style={`min-width: 20rem; ` + (vw ? `width: ${vw}vw; ` : "") + (vh ? `height: ${vh}vh` : "")} bind:this={dialog} on:close={() => (showModal = false)} on:click|self={() => dialog.close()}>
  <div on:click|stopPropagation>
    <button
      class="absolute top-0 right-0 p-4 hover:bg-gray-200 rounded-md"
      on:click={() => {
        showModal = false;
      }}><i class="material-icons">close</i></button
    >
    <slot name="header" />
    <hr />
    <slot />
    <hr />
    <!-- svelte-ignore a11y-autofocus -->
  </div>
</dialog>

<style>
  dialog {
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
