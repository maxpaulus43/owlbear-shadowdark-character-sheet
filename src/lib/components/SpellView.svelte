<script lang="ts">
  import type { SpellInfo } from "../model/Spell";

  export let s: SpellInfo;
</script>

<div class="shadow-md border border-gray-200 mb-3 p-2">
  <div>
    <span class="font-bold text-lg">{s.name}</span>
    <span>(Tier {s.tier}, {s.class})</span>
  </div>
  <div>
    <span class="font-bold">Duration:</span>
    <span
      >{s.duration.amt ?? ""}{s.duration.roll?.diceType ?? ""}{" " +
        s.duration.type}</span
    >
  </div>
  <div>
    <span class="font-bold mr-1">Range:</span><span>{s.range}</span>
  </div>
  <div>{s.desc}</div>
</div>
