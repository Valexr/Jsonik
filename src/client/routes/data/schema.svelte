<script lang="ts" context="module">
    import { goto } from "svelte-pathfinder";
    import {
        collection,
        files,
        schemas,
        schemasInvalid,
        SCHEMAS,
    } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Field from "./field.svelte";
</script>

<script lang="ts">
    export let open = false;
    export let header = "Add collection";
    export let name = "";

    let validCollection = false;

    function addField() {
        schemas.add([{ id: Date.now(), ...SCHEMAS[0] }]);
    }

    function invalidateField(e: Event) {
        const { id } = e.currentTarget as HTMLFormElement;
        schemas.invalidate(Number(id));
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
        schemas.save(field);
    }

    function deleteField(e: Event) {
        const { id } = e.currentTarget as HTMLFormElement;
        schemas.del(Number(id));
    }

    async function submitCollection(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const newName = String(data.get("collectionName"));

        if (name && name !== newName) {
            await files.rename(name, newName);
        }

        await files.add(newName, $schemas);
        await collection.get(newName);
        goto(`/data/${newName}`);
    }
</script>

<Dialog {open} on:submit={submitCollection} bind:valid={validCollection}>
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
                value={name}
            />
        </label>
        <label>
            <small>Token</small>
            <input placeholder="token" />
        </label>
    </fieldset>

    <fieldset class="cols column">
        <legend>Fields</legend>

        <Await promise={schemas.get(name)}>
            {#each $schemas as field (field.id)}
                <Field
                    {field}
                    id={field.id}
                    open={field.id === $schemasInvalid}
                    on:input={invalidateField}
                    on:submit={saveField}
                    on:reset={deleteField}
                />
            {/each}
        </Await>

        <nav>
            <button
                class="block link"
                type="button"
                on:click={addField}
                disabled={!validCollection || $schemasInvalid}
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
            disabled={!validCollection || $schemasInvalid}
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
