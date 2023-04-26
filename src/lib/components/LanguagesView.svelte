<script lang="ts">
  import { LANGUAGES } from "../constants";
  import { PlayerCharacterStore as pc } from "../model/PlayerCharacter";

  let addingNewLanguage = false;
  function doesNotKnowLanguage(l: string) {
    return !$pc.languages.includes(l);
  }
  function onAddNewLanguage(l: string) {
    $pc.languages.push(l);
    addingNewLanguage = false;
    $pc = $pc;
  }
  function onLanguageChange(e: Event) {
    onAddNewLanguage((e.target as HTMLSelectElement).value);
  }
  function onDeleteLanguage(lang: string) {
    $pc.languages = $pc.languages.filter((l) => l !== lang);
  }
</script>

<div class="flex justify-start">
  <h2>Languages</h2>
  <button
    on:click={() => {
      addingNewLanguage = !addingNewLanguage;
    }}
    class="px-3 hover:bg-gray-400"
  >
    <i class="material-icons translate-y-1"
      >{addingNewLanguage ? "do_not_disturb_on" : "add_circle"}</i
    >
  </button>
  {#if addingNewLanguage}
    <select class="flex-grow" on:change={onLanguageChange}>
      <option />
      {#each LANGUAGES.filter(doesNotKnowLanguage) as l}
        <option>{l}</option>
      {/each}
    </select>
  {/if}
</div>
<ul>
  {#each $pc.languages as l}
    <li class="border-b flex justify-between gap-4">
      <div>{l}</div>
      <button
        class="text-white bg-black p-1 text-xs"
        on:click={() => {
          onDeleteLanguage(l);
        }}
      >
        <i class="material-icons translate-y-1">delete</i>
      </button>
    </li>
  {/each}
</ul>
