<script lang="ts">
    import { findAny } from "../../compendium";
    import { CLASSES } from "../../constants";
    import { pc } from "../../model/PlayerCharacter";
    import type { Bonus, ModifyBonus } from "../../types";

    type BonusGroup = {
        bonus: Bonus;
        bonuses: Bonus[];
    };
    import { alphabetically } from "../../utils";
    import RollNewTalentButton from "../talents/RollNewTalentButton.svelte";
    import BonusView from "./BonusView.svelte";
    import CustomBonusButton from "./CustomBonusButton.svelte";

    $: equippableGearWithBonuses = $pc.gear
        .filter((g) => g.equipped)
        .map((g) => findAny(g.name))
        .filter((g) => g && g.canBeEquipped && g.playerBonuses?.length > 0);

    $: otherGearWithBonuses = $pc.gear
        .filter((g) => !g.equipped)
        .map((g) => findAny(g.name))
        .filter((g) => g && g.playerBonuses?.length > 0 && !g.canBeEquipped);

    function groupingKey(b: Bonus): string {
        return JSON.stringify({
            type: b.type,
            bonusTo: "bonusTo" in b ? b.bonusTo : undefined,
            bonusSource: b.bonusSource,
            metadata: b.metadata,
            diceType: "diceType" in b ? b.diceType : undefined,
        });
    }

    function combineIdenticalBonuses(bonuses: Bonus[]): BonusGroup[] {
        const byKey = new Map<string, BonusGroup>();

        for (const bonus of bonuses) {
            const key = groupingKey(bonus);
            const existing = byKey.get(key);

            if (!existing) {
                byKey.set(key, { bonus: { ...bonus }, bonuses: [bonus] });
            } else {
                existing.bonuses.push(bonus);
                if (
                    existing.bonus.type === "modifyAmt" &&
                    bonus.type === "modifyAmt"
                ) {
                    (existing.bonus as ModifyBonus).bonusAmount +=
                        bonus.bonusAmount;
                }
            }
        }

        return [...byKey.values()].sort((a, b) =>
            alphabetically(a.bonus.desc, b.bonus.desc),
        );
    }

    $: combinedBonuses = combineIdenticalBonuses($pc.bonuses);
</script>

<h2>Bonuses</h2>
<ul class="px-1">
    {#each combinedBonuses as group}
        <li class="border-b">
            {#if group.bonuses.length === 1}
                <BonusView bonus={group.bonuses[0]} />
            {:else}
                <details>
                    <ul class="pl-4">
                        {#each group.bonuses as b}
                            <li class="border-t">
                                <BonusView bonus={b} />
                            </li>
                        {/each}
                    </ul>
                    <summary class="cursor-pointer list-none">
                        <div class="flex items-center gap-1">
                            <div class="inline-block w-full">
                                <BonusView
                                    bonus={group.bonus}
                                    canDelete={false}
                                    showInfo={false}
                                />
                            </div>
                            <div class="text-xs text-gray-600">
                                {group.bonuses.length} combined bonuses
                            </div>
                            <i class="material-icons">expand_more</i>
                        </div>
                    </summary>
                </details>
            {/if}
        </li>
    {/each}
</ul>

<h2>Bonuses From Items</h2>
<ul>
    {#each otherGearWithBonuses.sort( (a, b) => alphabetically(a.name, b.name), ) as g}
        <li class="border-b">
            <div class="font-bold bg-gray-300">{g.name}</div>
            <ul>
                {#each g.playerBonuses as b}
                    <li class="border-b ps-8 flex gap-1">
                        * <BonusView bonus={b} />
                    </li>
                {/each}
            </ul>
        </li>
    {/each}
    {#each equippableGearWithBonuses.sort( (a, b) => alphabetically(a.name, b.name), ) as g}
        <li class="border-b">
            <div class="font-bold bg-gray-300">{g.name}</div>
            <ul>
                {#each g.playerBonuses as b}
                    <li class="border-b ps-8 flex gap-1">
                        * <BonusView bonus={b} showInfo={false} />
                    </li>
                {/each}
            </ul>
        </li>
    {/each}
</ul>

<div class="flex gap-1">
    {#if $pc.level > 0 && $pc.class && !$pc.hasCustomClass && CLASSES.includes($pc.class)}
        <RollNewTalentButton />
    {/if}
    <CustomBonusButton />
</div>
