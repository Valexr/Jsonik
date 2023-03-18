<script lang="ts">
    import { path, fragment, redirect, submit } from "svelte-pathfinder";
    import { collections } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
</script>

<Await promise={collections.get()}>
    <nav class="text-center cols col-fit justify-start nowrap scroll-x">
        <a href="#add-data" role="button" class="box link">
            <i class="icon icon-svg icon-125x icon-plus-square" />
        </a>
        {#each $collections as collection}
            <a
                href="/data/{collection}"
                role="button"
                aria-disabled={$path[1] === collection}
            >
                {collection}
            </a>
        {/each}
    </nav>
</Await>

<Dialog open={$fragment === `add-data`}>
    <h2 slot="header">Add data {Date.now()}</h2>
    <!-- <Await promise={get(`/data/logs/items?date=${fragmentDate}`)} let:result> -->
    <!-- <Code code={JSON.stringify(active, null, 2)} /> -->
    <!-- </Await> -->
</Dialog>

<style>
    nav {
        margin: var(--gap-lg) 0;
    }
</style>
