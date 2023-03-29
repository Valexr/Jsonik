<script lang="ts" context="module">
    import {
        url,
        path,
        state,
        fragment,
        redirect,
        paramable,
        type Param,
        type Parsable,
        goto,
    } from "svelte-pathfinder";
    import {
        collection,
        files,
        schemas,
        type Item,
    } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Table from "$client/components/Table.svelte";
    import Form from "$client/components/Form.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Tile from "$client/components/Tile.svelte";
    import Code from "$client/components/Code.svelte";
    import AddSchema from "./schema.svelte";
    import EditSchema from "./schema.svelte";
    import AddRecord from "./record.svelte";
    import EditRecord from "./record.svelte";
    import { onDestroy, onMount } from "svelte";
</script>

<script lang="ts">
    let active: Item;
    let selected: number[];

    function getItem(id: number) {
        fragment.set(`#record-${id}`);
        active = $collection.records.find((r) => r.id === id) || {};
    }

    const route = paramable<{ file: string }>("/data/:file?");

    onMount(() => {
        if ($files?.length && !$route.file) redirect(`/data/${$files[0]}`);
    });
</script>

<section class="cols scroll-x">
    <Await promise={collection.get($route.file)}>
        {#if $collection.keys}
            {@const { keys: thead, records: tbody } = $collection}
            <!-- {@const thead = $collection.keys.map(({ type, name }) =>
                head({ type, name })
            )} -->
            <Table data={{ thead, tbody }} current={getItem} bind:selected />
            <Code code={JSON.stringify($collection, null, 2)} />
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

<AddSchema open={$fragment === "#add-collection"} />
<EditSchema
    open={$fragment === "#edit-collection"}
    header="Edit collection"
    name={$route.file}
/>

<AddRecord name={$route.file} open={$fragment === `#add-record`} {active} />
<EditRecord
    name={$route.file}
    open={$fragment === `#record-${active?.id}`}
    {active}
/>

<style>
    .cols {
        --cols-gap: var(--gap);
    }
</style>
