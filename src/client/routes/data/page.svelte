<script lang="ts" context="module">
    import {
        path,
        state,
        fragment,
        redirect,
        paramable,
        type ConvertedParam,
        type Parsable,
    } from "svelte-pathfinder";
    import { data, collections } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Table from "$client/components/Table.svelte";
    import Tile from "$client/components/Tile.svelte";
    import Code from "$client/components/Code.svelte";
    import { onDestroy, onMount } from "svelte";
</script>

<script lang="ts">
    // export let result;

    let active: { date: number };

    state.set({ some: "foo" });
    function getItem(item: Object & { date: number }) {
        $fragment = `data-${item.date}`;
        active = item;
    }
    const route = paramable("/data/:file?");
</script>

<section class="cols col-fit scroll-x">
    <Await promise={data.get(String($route.file))}>
        {#if $data.keys}
            <Table
                data={{ thead: $data.keys, tbody: $data.items }}
                active={getItem}
            />
            <!-- {#each $data.keys as key}
                <a href="/data/{key}">{key}</a>
            {/each}
            {#each $data.items as item}
                <Tile id={item.id} on:click={() => getRecord(item.id)}>
                    {#each Object.values(item).slice(1) as value}
                        <span>{value}</span>
                    {/each}
                </Tile>
            {/each} -->
            <!-- <Code code={JSON.stringify(result, null, 2)} /> -->
        {/if}
    </Await>
</section>

<Aside open={$fragment === `data-${active?.date}`} right>
    <h2 slot="header">Record {active?.date}</h2>
    <Code code={JSON.stringify(active, null, 2)} />
</Aside>

<style>
    .cols {
        --cols-gap: var(--gap);
    }
</style>