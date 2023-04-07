<script lang="ts" context="module">
    import { fragment, paramable } from "svelte-pathfinder";
    import { schemas, records, type Item } from "$client/stores/data.js";
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
    {#key $fragment}
        <Await
            promise={records
                .get($route.file)
                .then(() => schemas.get($route.file))}
        >
            {#if $records?.length}
                <Table
                    data={{ thead: $schemas, tbody: $records }}
                    current={getItem}
                    updated
                    bind:selected
                />
            {:else if !$schemas?.length}
                <p class="text-center">
                    <a href="#edit-collection" role="button">
                        <Icon icon="plus" /> Add fields
                    </a>
                </p>
            {/if}
            <!-- <Code input={JSON.stringify({ $schemas, $records }, null, 2)} /> -->
            <AddCollection slot="catch" file={$route.file} />
        </Await>
    {/key}
</section>

{#if $schemas.length}
    <nav id="addRecord" class="text-center pos-sticky">
        <a tabindex="0" href="#add-record" role="button">
            <Icon icon="plus" /> Add record
        </a>
    </nav>
{/if}

<EditCollection open={$fragment === "#edit-collection"} file={$route.file} />

<AddRecord file={$route.file} open={$fragment.includes(`#add-record`)} />
<EditRecord
    file={$route.file}
    header="Edit record"
    open={$fragment.includes(`#edit-record`)}
    {active}
/>

<style>
    #addRecord {
        bottom: 3.5rem;
        margin-top: var(--gap);
    }
</style>
