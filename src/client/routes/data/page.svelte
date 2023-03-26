<script lang="ts" context="module">
    import {
        path,
        state,
        fragment,
        redirect,
        paramable,
        type Param,
        type Parsable,
        goto,
    } from "svelte-pathfinder";
    import { records, files, schemas, type Item } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Table from "$client/components/Table.svelte";
    import Form from "$client/components/Form.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Tile from "$client/components/Tile.svelte";
    import Code from "$client/components/Code.svelte";
    import Schema from "./schema.svelte";
    import Record from "./record.svelte";
    import { onDestroy, onMount } from "svelte";
</script>

<script lang="ts">
    let active: Item;

    function getItem(item: Item) {
        fragment.set(`#data-${item.date}`);
        active = item;
    }

    const route = paramable<{ file: string }>("/data/:file?");

    // onMount(() => {
    //     if ($collections?.length && !$route.file)
    //         redirect(`/data/${$collections[0]}`);
    // });
</script>

<section class="cols scroll-x">
    <Await promise={records.get($route.file)}>
        {#if $records}
            <Table
                data={{
                    thead: $records.keys,
                    tbody: $records.items || [],
                }}
                active={getItem}
            />
            <Code code={JSON.stringify($records, null, 2)} />
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
        {:else}
            <p class="text-center">You haven't any data yet...</p>
        {/if}
    </Await>
</section>

{#if $fragment === "#add-collection"}
    <Schema open={$fragment === "#add-collection"} />
{:else if $fragment === "#edit-collection"}
    <Await promise={schemas.get($route.file)}>
        <Schema
            open={$fragment === "#edit-collection"}
            header="Edit collection"
            collectionName={$route.file}
            bind:fields={$schemas}
        />
    </Await>
{/if}

{#if $records}
    <Record {active} />
{/if}

<style>
    .cols {
        --cols-gap: var(--gap);
    }
</style>
