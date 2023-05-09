<script lang="ts" context="module">
    import Icon from "./Icon.svelte";
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let total = 10;
    export let limit = 10;
    export let limits = [10, 20, 30, 40, 50, 100];
    export let active = 1;
    export let spread = 3;

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

    function spreading(ul: HTMLUListElement) {
        console.log(ul.offsetWidth);
        const RO = new ResizeObserver(() => {
            const { offsetWidth } = ul;
            // spread = Math.ceil(offsetWidth / 50) - 5;
        });
        RO.observe(ul);
        return {
            destroy() {
                RO.disconnect();
            },
        };
    }
</script>

<nav class="cols">
    <ul class="paginator cols col-fit" role="navigation" use:spreading>
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
                            class="link"
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
            <button
                class="box"
                on:click={next}
                disabled={active === pages.length}
            >
                <Icon icon="arrow-right" />
            </button>
        </li>
    </ul>
    <select bind:value={limit}>
        {#each limits as limit}
            <option selected>{limit}</option>
        {/each}
    </select>
</nav>

<style>
    .paginator {
        --cols-gap: var(--gap-sm);
        display: inline-flex;
        align-items: center;
        list-style: none;
        margin: auto;
        padding: 0;
        max-width: fit-content;
    }
    .paginator li {
        line-height: 1.5;
    }
    .paginator li:not(:first-child, :last-child) button {
        padding: 0 var(--gap-sm);
    }
    select {
        width: auto;
        max-width: fit-content;
    }
</style>
