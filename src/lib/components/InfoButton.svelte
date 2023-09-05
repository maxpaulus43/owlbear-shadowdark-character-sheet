<script lang="ts">
  import Modal from "./Modal.svelte";

  let showModal = false;
</script>

<button
  on:click={() => {
    showModal = true;
  }}><i class="material-icons">help</i></button
>

<Modal bind:showModal>
  <h1 slot="header">Info</h1>
  <div class="flex flex-col">
    <div>
      This is an unofficial fan made tool to track your shadow dark character!
      <a
        target="_blank"
        href="https://www.thearcanelibrary.com/pages/shadowdark"
        >Buy shadow dark
      </a>
    </div>

    <h2>Import</h2>
    <div>
      This tool can import your character directly from <a
        href="https://www.shadowdarklings.net"
        target="_blank">Shadowdarkling Character Creator</a
      >. It can also import any previously exported json.
    </div>

    <h2>Storage</h2>
    <div>
      This tool automatically saves your character sheet to your browser's local
      storage. If you delete storage for this website, make sure to export your
      sheet to json first.
    </div>

    <h2>Contact</h2>
    <div>
      Email me at <a href="mailto:maxpaulus43@gmail.com" target="_blank"
        >maxpaulus43@gmail.com</a
      >
      I also lurk on the official Shadowdark discord channel.
    </div>

    <h2>Issues</h2>
    <div>
      This project is free and open source! Feel free to make a pull request or
      <a
        href="https://github.com/maxpaulus43/owlbear-shadowdark-character-sheet"
        target="_blank"
      >
        create an issue
      </a>
    </div>

    <h2>Acknowledgements</h2>
    <div>Check out these other awesome shadowdark tools!</div>
    <div>
      <a href="https://shadowdarklings.net" target="_blank"
        >https://shadowdarklings.net</a
      >
    </div>
    <div>
      <a href="https://www.shadowdork.com" target="_blank"
        >https://www.shadowdork.com</a
      >
    </div>

    <h2>License</h2>
    <div>
      This tool is an independent product published under the Shadowdark RPG
      Third-Party License and is not affiliated with The Arcane Library, LLC.
      Shadowdark RPG © 2023 The Arcane Library, LLC.
    </div>
    <hr />
    <div>
      Disclaimer: I have explicit permission from The Arcane Library to reprint
      character creation material (such as talent tables) in this tool.
    </div>

    <a
      href="https://www.buymeacoffee.com/tKsqTr4ABl"
      target="_blank"
      class="pirata text-xl rounded-md p-2 self-center">Buy Me a Ration 🍖</a
    >
  </div>
</Modal>

<style lang="postcss">
  a {
    @apply text-blue-700 hover:bg-gray-200;
  }
</style>
