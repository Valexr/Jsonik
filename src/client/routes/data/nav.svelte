<script lang="ts">
    import { path, fragment, redirect, submit } from "svelte-pathfinder";
    import { collections } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
</script>

<Await
    promise={collections.get()}
    on:success={() => redirect(`/data/${$collections[0]}`)}
>
    <nav class="text-center cols col-fit justify-start nowrap scroll-x">
        <a href="#add-data" role="button" target="_self" class="box link">
            <i class="icon icon-svg icon-125x icon-plus-square" />
        </a>
        {#each $collections as collection}
            <a
                href="/data/{collection}"
                role="button"
                class:disabled={$path[1] === collection}>{collection}</a
            >
        {/each}
    </nav>
    <form on:submit={submit}>
        <fieldset>
            <label>
                <input type="search" name="q" placeholder="search" />
            </label>
        </fieldset>
    </form>
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
