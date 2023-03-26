<script lang="ts" context="module">
    import { records, files, schemas, type Item } from "$client/stores/data.js";
    import Dialog from "$client/components/Dialog.svelte";
    import Field from "./field.svelte";
    import { SCHEMAS, type Schema } from "$client/stores/data.js";
    import { goto } from "svelte-pathfinder";
</script>

<script lang="ts">
    export let open = false;
    export let header = "New collection";
    export let collectionName = "";
    export let fields: Schema[] = [];

    let openID: number;
    let fieldID: number;
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

    async function submitCollection(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const name = data.get("collectionName");
        const table = fields;
        if (collectionName) {
            await files.rename(collectionName, String(name));
        }
        await schemas.add(String(name), table);
        await records.get(String(name));
        goto(`/data/${name}`);
    }

    const clearFields = () => (fields = []);
</script>

<Dialog
    {open}
    on:submit={submitCollection}
    on:close={clearFields}
    bind:valid={validCollection}
>
    <h3 slot="header">{header}</h3>
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
                value={collectionName}
            />
        </label>
        <label>
            <small>Token</small>
            <input placeholder="token" />
        </label>
    </fieldset>
    <fieldset class="cols column">
        <legend>Fields</legend>

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

        <nav>
            <button
                class="block link"
                type="button"
                on:click={addField}
                disabled={!validCollection || fields?.some((f) => !f.valid)}
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
            disabled={!validCollection || fields?.some((f) => !f.valid)}
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
