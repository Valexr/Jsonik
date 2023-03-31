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
    import Aside from "$client/components/Aside.svelte";
    import Table from "$client/components/Table.svelte";
    import Toast from "$client/components/Toaster/Toast.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Form from "$client/components/Form.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Tile from "$client/components/Tile.svelte";
    import Code from "$client/components/Code.svelte";
    import AddSchema from "./schema.svelte";
    import EditSchema from "./schema.svelte";
    import AddRecord from "./record/record.svelte";
    import EditRecord from "./record/record.svelte";
    import { onDestroy, onMount } from "svelte";
</script>

<script lang="ts">
    let active: Item;
    let selected: number[] = [];

    const route = paramable<{ file: string }>("/data/:file?");

    function getItem(id: number) {
        fragment.set(`#edit-record-${id}`);
        active = $collection.records.find((r) => r.id === id) || {};
    }

    async function deleteRecords() {
        await collection.del($route.file, selected);
        selected.length = 0;
    }

    onMount(() => {
        if ($files && !$route.file) redirect(`/data/${$files[0]}`);
    });
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

<section class="cols scroll-x">
    <Await promise={collection.get($route.file)}>
        {#if $collection.keys}
            {@const { keys: thead, records: tbody } = $collection}
            <Table data={{ thead, tbody }} current={getItem} bind:selected />
            <Code input={JSON.stringify($collection, null, 2)} />
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

<AddRecord name={$route.file} open={$fragment === `#add-record`} />
<EditRecord
    name={$route.file}
    open={$fragment.includes(`#edit-record`)}
    {active}
/>

<style>
    .cols {
        --cols-gap: var(--gap);
    }
</style>
