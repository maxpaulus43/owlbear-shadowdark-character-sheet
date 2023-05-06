<script lang="ts">
  export let id = "multiSelect";
  export let values = [] as string[];
  export let minSelected = 0;
  export let options = [] as readonly string[];

  function toggleOption(o: string) {
    const idx = values.findIndex((v) => v === o);

    if (idx >= 0) {
      if (values.length > minSelected) {
        values.splice(idx, 1);
      }
    } else {
      values.push(o);
    }
    values = values;
  }
</script>

<div {id} class="w-full flex flex-wrap gap-1">
  {#each options as o}
    {@const optionSelected = values.includes(o)}
    <button on:click={() => toggleOption(o)}>
      <div
        class={`p-2 rounded-full border ${
          optionSelected ? "bg-black text-white border-black" : ""
        }`}
      >
        {o}
      </div>
    </button>
  {/each}
</div>
