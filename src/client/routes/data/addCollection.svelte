<script lang="ts" context="module">
    import { path, fragment, redirect, submit } from "svelte-pathfinder";
    import { collections, SCHEMAS } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Field, { type Schema } from "./field.svelte";
</script>

<script lang="ts">
    export let schemas: Schema[] | undefined;

    let openID: number;
    let fieldID: number;
    let fields: Schema[] = schemas || [];
    let validCollection = false;

    function addField() {
        fieldID = Date.now();
        fields = fields.concat([{ id: fieldID, ...SCHEMAS[0] }]);
        openID = fieldID;
    }

    function invalidateField(e: Event) {
        const { id } = e.currentTarget as HTMLFormElement;
        openID = Number(id);
        fields = fields.map((f) => {
            return f.id === openID ? { ...f, valid: false } : f;
        });
    }

    function saveField(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const { type, name, required, ...opts } = Object.fromEntries(data);
        const { id } = e.currentTarget as HTMLFormElement;
        const field = {
            id: Number(id),
            valid: true,
            ...{ type, name, required, opts },
        };
        fields = fields.map((f) => (field.id === f.id ? field : f));
        openID = Date.now();
    }

    function deleteField(e: Event) {
        const { id } = e.currentTarget as HTMLFormElement;
        fields = fields.filter((f) => f.id !== Number(id));
    }

    async function addCollection(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const collectionName = data.get("collectionName");
        const schemas = fields;
        await collections.add(String(collectionName), "schemas", schemas);
        clearFields();
    }

    const clearFields = () => (fields = []);
</script>

<Dialog
    open={[`#add-collection`, `#edit-${$path[1]}`].includes($fragment)}
    on:submit={addCollection}
    on:close={clearFields}
    bind:valid={validCollection}
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
        {#if fields?.length}
            {#each fields as field (field.id)}
                <Field
                    {field}
                    id={field.id}
                    open={field.id === openID}
                    on:input={invalidateField}
                    on:submit={saveField}
                    on:reset={deleteField}
                />
            {/each}
        {/if}
        <nav>
            <button
                class="block link"
                type="button"
                on:click={addField}
                disabled={fields?.some((f) => !f.valid)}
            >
                <i class="icon icon-svg icon-plus" />New field
            </button>
        </nav>
    </fieldset>
    <nav slot="footer">
        <button type="reset">Cancel</button>
        <button
            type="submit"
            class="success"
            disabled={!validCollection ||
                fields?.some((f) => !f.valid) ||
                !fields.length}
        >
            Submit
        </button>
    </nav>
</Dialog>

<style>
    fieldset {
        margin-bottom: var(--gap);
    }
</style>
