<script lang="ts" context="module">
    import { fragment, query, paramable } from "svelte-pathfinder";
    import { files, schemas, records, type Item } from "$client/stores/data.js";
    import { s } from "$client/utils/index.js";

    import Await from "$client/components/Await.svelte";
    import Table from "$client/components/Table.svelte";
    import Toast from "$client/components/Toaster/Toast.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Code from "$client/components/Code.svelte";
    import Dialog from "$client/components/Dialog.svelte";

    import AddSchema from "./schema/add.svelte";
    import EditSchema from "./schema/edit.svelte";
    import AddRecord from "./record.svelte";
    import EditRecord from "./record.svelte";
</script>

<script lang="ts">
    let active: Item | null;
    let selected: number[] = [];

    const route = paramable<{ file: string }>("/data/:file?");
    const promise = records
        .get($route.file)
        .then(() => schemas.get($route.file));

    function getRecord(id: number) {
        query.set({ record: id });
        active = $records?.find((r) => r.id === id) || {};
    }

    async function deleteRecords() {
        await records.delete($route.file, selected);
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
    <Await {promise}>
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
        <AddSchema slot="catch" file={$route.file} />
    </Await>
</section>

<EditSchema open={$fragment.includes("#edit-collection")} file={$route.file} />

{#if $schemas.length}
    <nav id="addRecord" class="text-center pos-sticky">
        <a tabindex="0" href="#add-record" role="button">
            <Icon icon="plus" /> Add record
        </a>
    </nav>
{/if}

<AddRecord file={$route.file} open={$fragment.includes(`#add-record`)} />
<EditRecord
    file={$route.file}
    header="Edit record"
    open={!!$query.record}
    close={() => query.set("")}
    {active}
/>

<!-- <Dialog open={$fragment.includes("#preview")} img from="center">
    {@const file = $fragment.replace("#preview-", "")}
    <figure>
        <img src={file} alt={file} />
    </figure>
    <nav slot="footer">
        {@const file = $fragment.replace("#preview-", "")}
        <span>{file}</span>
        <button type="reset" class="box text-error">
            <Icon icon="trash" />
        </button>
        <button type="reset" class="box">
            <Icon />
        </button>
    </nav>
</Dialog> -->

<style>
    #addRecord {
        bottom: 3.5rem;
        margin-top: var(--gap);
    }
</style>
