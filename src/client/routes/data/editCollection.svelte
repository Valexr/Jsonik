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

    function addField(schema?: Schema) {
        fieldID = Date.now();
        fields.set(fieldID, schema || schemas[0]);
        fields = fields;
        openID = fieldID;
    }

    function saveField(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const { type, name, ...opts } = Object.fromEntries(data);
        fields.set(fieldID, { type, name, opts });
        openID = Date.now();
    }

    function deleteField(e: Event) {
        const { id } = e.currentTarget as HTMLFormElement;
        fields.delete(Number(id));
        fields = fields;
    }

    async function addCollection(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const collectionName = data.get("collectionName");
        const schemas = Array.from(fields.values());
        await collections.add(String(collectionName), "schemas", schemas);
        fields.clear();
    }
    // String.raw`^[\w,\-]+`
    // let result: any;
    // let schemasFields;

    // $: if (result) {
    //     console.log($schema);
    //     $schema?.forEach((s) => addField(s));
    //     schemasFields = Array.from(fields.entries());
    // }
</script>

<Dialog
    open={$fragment === `#edit-${$path[1]}`}
    on:submit={addCollection}
    size=""
>
    <h3 slot="header">Edit collection</h3>

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
                value={$path[1]}
            />
        </label>
        <label>
            <small>Token</small>
            <input placeholder="token" />
        </label>
    </fieldset>
    <fieldset class="cols column">
        <legend>Fileds</legend>
        <Await promise={schema.get(String($path[1]), "schemas")}>
            {#each [...fields, ...$schema] as schema (schema.id)}
                <Field
                    {schema}
                    {schemas}
                    id={String(schema.id)}
                    open={schema.id === openID}
                    on:submit={saveField}
                    on:reset={deleteField}
                />
            {/each}
        </Await>
        <nav>
            <button class="block link" type="button" on:click={addField}>
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
