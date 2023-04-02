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
    import { s } from "$client/utils/index.js";

    import Await from "$client/components/Await.svelte";
    import Table from "$client/components/Table.svelte";
    import Toast from "$client/components/Toaster/Toast.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Code from "$client/components/Code.svelte";

    import AddCollection from "./addCollection.svelte";
    import EditCollection from "./editCollection.svelte";
    import AddRecord from "./record.svelte";
    import EditRecord from "./record.svelte";
</script>

<script lang="ts">
    let active: Item;
    let selected: number[] = [];

    const route = paramable<{ file: string }>("/data/:file?");

    function getItem(id: number) {
        fragment.set(`#edit-record-${id}`);
        // active = $collection?.records?.find((r) => r.id === id) || {};
    }

    async function deleteRecords() {
        await collection.del($route.file, selected);
        selected.length = 0;
    }
</script>

{#if selected.length}
    <Toast
        draggable
        type="pos-sticky"
        on:close={() => (selected.length = 0)}
        on:dragstart={(e) => e.dataTransfer?.setData("files", String(selected))}
        on:dragend={(e) => (selected.length = 0)}
    >
        <span><b>{selected.length}</b> file{s(selected.length)} selected</span>
        <button class="box link text-error" on:click={deleteRecords}>
            <Icon icon="trash" />
        </button>
    </Toast>
{/if}

<section class="scroll-x">
    <Await promise={collection.get($route.file)}>
        {#if $collection.records?.length}
            {@const { keys: thead, records: tbody } = $collection}
            <Table data={{ thead, tbody }} current={getItem} bind:selected />
        {/if}
        <Code input={JSON.stringify($collection, null, 2)} />
        <AddCollection slot="catch" />
    </Await>
</section>

{#if $route.file}
    {#if $collection.keys?.length}
        <p id="addRecord" class="text-center pos-sticky">
            <a href="#add-record" role="button">
                <Icon icon="plus" /> Add record
            </a>
        </p>
    {:else}
        <p class="text-center">
            <a href="#edit-collection" role="button">
                <Icon icon="plus" /> Add fields
            </a>
        </p>
    {/if}
{/if}

<EditCollection open={$fragment === "#edit-collection"} file={$route.file} />

<AddRecord file={$route.file} open={$fragment === `#add-record`} />
<EditRecord
    file={$route.file}
    header="Edit record"
    open={$fragment.includes(`#edit-record`)}
    {active}
/>

<style>
    #addRecord {
        bottom: 3.5rem;
        margin-top: var(--gap-lg);
    }
</style>
