<script lang="ts" context="module">
    import { goto } from "svelte-pathfinder";
    import {
        collection,
        files,
        schemas,
        schemaInvalid,
    } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Details from "$client/components/Details.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Field from "./field.svelte";
    import Schemas from "./schemas.svelte";
</script>

<script lang="ts">
    export let open = false;
    export let header = "Add collection";
    export let name = "";

    let validCollection = false;
    let addOpen = false;

    async function submitCollection(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const newName = String(data.get("collectionName"));
        const { keys } = $collection;
        const newKeys = keys?.reduce((a, { type, name }) => {
            const newName = $schemas.find((s) => s.type === type)?.name;
            a[name] = newName;
            return a;
        }, {} as Record<string, string>);

        if (name && name !== newName) {
            await files.rename(name, newName);
        }

        await files.add(newName, $schemas);
        if (newKeys) await collection.update(newName, newKeys);
        await collection.get(newName);
        goto(`/data/${newName}`);
    }
</script>

<Dialog {open} on:submit={submitCollection} bind:valid={validCollection}>
    <h3 slot="header">{header}</h3>

    <fieldset class="cols">
        <label>
            <small>Name</small>
            <input
                name="collectionName"
                placeholder="collection name"
                pattern="^[\w,\-]+$"
                required
                value={name}
            />
        </label>
        <label>
            <small>Type</small>
            <select name="collectionType">
                <option>Base</option>
                <option>View</option>
                <option>Auth</option>
            </select>
        </label>
    </fieldset>

    <fieldset class="cols column">
        <legend>Fields</legend>

        <Await promise={schemas.get(name)}>
            {#each $schemas as field (field.id)}
                <Field {field} open={field.id === $schemaInvalid} />
            {/each}
        </Await>

        <nav>
            <Details
                bind:open={addOpen}
                disabled={!validCollection || $schemaInvalid}
                class="block link clear"
                back={addOpen}
                button
            >
                <svelte:fragment slot="summary">
                    <Icon icon="plus" />
                    New field
                </svelte:fragment>
                <Schemas />
            </Details>
        </nav>
    </fieldset>

    <nav slot="footer">
        <button type="reset">Cancel</button>
        <button
            type="submit"
            class="success"
            disabled={!validCollection || $schemaInvalid}
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
