<script lang="ts" context="module">
    import { path, fragment, redirect, submit } from "svelte-pathfinder";
    import { collections, schemas, data, schema } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Field, { type Schema } from "./field.svelte";
</script>

<script lang="ts">
    let openID: number;
    let fieldID: number;
    let fields: Schema[] = [];

    function addField() {
        fieldID = Date.now();
        fields = [...fields, { id: fieldID, ...schemas[0] }];
        openID = fieldID;
    }

    function saveField(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const { type, name, ...opts } = Object.fromEntries(data);
        const field = { id: fieldID, valid: true, ...{ type, name, opts } };
        fields = fields.map((f) => (field.id === f.id ? field : f));
        openID = Date.now();
    }

    function deleteField(e: Event) {
        const { id } = e.currentTarget as HTMLFormElement;
        fields = fields.filter((f) => f.id !== id);
    }

    async function addCollection(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const collectionName = data.get("collectionName");
        const schemas = fields;
        await collections.add(String(collectionName), "schemas", schemas);
        clearFields();
    }

    const clearFields = () => (fields.length = 0);
</script>

<Dialog
    open={[`#add-collection`, `#edit-${$path[1]}`].includes($fragment)}
    on:submit={addCollection}
    on:close={clearFields}
>
    <h3 slot="header">
        {$fragment.includes("add") ? "New" : "Edit"} collection
    </h3>
    <fieldset class="cols">
        <label>
            <small>Name</small>
            <!-- svelte-ignore a11y-autofocus -->
            <input
                name="collectionName"
                placeholder="collection name"
                pattern="^[\w,\-]+$"
                autofocus={true}
                required
                value={$fragment.includes("add") ? "" : $path[1]}
            />
        </label>
        <label>
            <small>Token</small>
            <input placeholder="token" />
        </label>
    </fieldset>
    <fieldset class="cols column">
        <legend>Fields</legend>
        {#if $fragment.includes("add")}
            {#each fields as field (field.id)}
                <Field
                    {field}
                    id={field.id}
                    open={field.id === openID}
                    on:submit={saveField}
                    on:reset={deleteField}
                />
            {/each}
        {:else if $data?.schemas}
            <!-- <Await promise={schema.get(String($path[1]), "schemas")}> -->
            {#each [...fields, ...$data?.schemas] as field (field.id)}
                <Field
                    {field}
                    id={field.id}
                    open={field.id === openID}
                    on:submit={saveField}
                    on:reset={deleteField}
                />
            {/each}
            <!-- </Await> -->
        {/if}
        <nav>
            <button
                class="block link"
                type="button"
                on:click={addField}
                disabled={fields.some((f) => !f.valid)}
            >
                <i class="icon icon-svg icon-plus" />New field
            </button>
        </nav>
    </fieldset>
</Dialog>

<style>
    fieldset {
        margin-bottom: var(--gap);
    }
</style>
