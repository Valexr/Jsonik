<script lang="ts" context="module">
    import { fragment, query, paramable } from "svelte-pathfinder";
    import { schemas, records, type Item } from "$client/stores/data.js";
    import { files } from "$client/stores/files.js";
    import { s } from "$client/utils/index.js";

    import Await from "$client/components/Await.svelte";
    import Table from "$client/components/Table.svelte";
    import Toast from "$client/components/Toaster/Toast.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Code from "$client/components/Code.svelte";
    import LBmodal from "$client/components/LightBox/Modal.svelte";

    import AddSchema from "./schema/add.svelte";
    import EditSchema from "./schema/edit.svelte";
    import AddRecord from "./record.svelte";
    import EditRecord from "./record.svelte";
</script>

<script lang="ts">
    let active: Item | undefined;
    let selected: number[] = [];

    const route = paramable<{ collection: string }>("/data/:collection?");
    const promise = schemas
        .get($route.collection)
        .then(() => records.get($route.collection));

    function getRecord(id: number) {
        query.set({ record: id });
        active = $records?.find((r) => r.id === id) || {};
    }

    async function deleteRecords() {
        let Files: File[] = [];
        for (const recordID of selected) {
            const record = records.id(recordID);
            for (const fieldname in record) {
                const typeFile = schemas.type(fieldname) === "file";
                Files = Files.concat(typeFile ? record[fieldname] : []);
            }
        }
        const fileNames = Files.map(({ name }) => name);
        await files.delete($route.collection, fileNames);
        await records.delete($route.collection, selected);
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
        <span>
            <b>{selected.length}</b> record{s(selected.length)} selected
        </span>
        <button class="box link text-error" on:click={deleteRecords}>
            <Icon icon="trash" />
        </button>
    </Toast>
{/if}

<Await {promise}>
    <section class="scroll-x">
        {#if $records?.length}
            <Table
                data={{ thead: $schemas, tbody: $records }}
                current={getRecord}
                bind:selected
                updated
            />
        {:else if !$schemas?.length}
            <p class="text-center">
                <a href="#edit-collection" role="button">
                    <Icon icon="plus" /> Add fields
                </a>
            </p>
        {/if}
        <Code input={JSON.stringify({ $schemas, $records }, null, 2)} />
    </section>

    <AddSchema slot="catch" collection={$route.collection} />
    <EditSchema
        open={$fragment.includes("#edit-collection")}
        on:close={() => fragment.set("")}
        collection={$route.collection}
    />
    <AddRecord collection={$route.collection} open={$query.record === "add"} />
    <EditRecord
        header="Edit record"
        collection={$route.collection}
        open={!isNaN(Number($query.record))}
        {active}
    />

    {#if $schemas.length}
        <nav id="addRecord" class="text-center pos-sticky">
            <a tabindex="0" href="?record=add" role="button">
                <Icon icon="plus" /> Add record
            </a>
        </nav>
    {/if}
</Await>

<style>
    #addRecord {
        bottom: 3.5rem;
    }
</style>
