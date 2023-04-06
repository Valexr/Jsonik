<script lang="ts" context="module">
    import Icon from "./Icon.svelte";
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let total: number;
    export let limit: number;
    export let active: number;
    export let spread: number;

    const prev = () => (active > 1 && active--, dispatch("prev", active));
    const cur = (i: number) => ((active = i), dispatch("current", i));
    const next = () => (
        active < pages.length && active++, dispatch("next", active)
    );

    $: pages = Array.from(
        { length: Math.ceil(total / limit) },
        (_, i: number) => i + 1
    );

    $: spreaded = (items: number[]) => {
        const half = Math.trunc(spread / 2);
        const before = active - half;
        const after = active + half;
        const from = before >= 1 ? before - 1 : 1;
        const around = items.slice(from, after);
        const visible = [1, pages.length, ...around];
        const result = items.map((i) =>
            !visible.includes(i) ? around.every((a) => a > i) : i
        );

        const uniq = (a: (number | boolean)[]): (number | boolean)[] => [
            ...new Set(a),
        ];

        return spread ? uniq(result) : items;
    };
</script>

<ul class="paginator cols col-fit" role="navigation">
    <li>
        <button class="box" on:click={prev} disabled={active === 1}>
            <Icon icon="arrow-left" />
        </button>
    </li>
    {#if pages.length}
        {#each spreaded(pages) as page, i}
            <li>
                {#if typeof page === "boolean"}
                    <span>...</span>
                {:else}
                    <button
                        class="box"
                        on:click={() => cur(Number(page))}
                        disabled={active === page}
                    >
                        {page}
                    </button>
                {/if}
            </li>
        {/each}
    {/if}
    <li>
        <button class="box" on:click={next} disabled={active === pages.length}>
            <Icon icon="arrow-right" />
        </button>
    </li>
</ul>

<style>
    .paginator {
        --cols-gap: var(--gap-sm);
        align-items: center;
        list-style: none;
        margin: auto;
        padding: 0;
        max-width: fit-content;
    }
    .paginator li {
        line-height: 1.5;
    }
</style>
