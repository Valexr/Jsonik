<script lang="ts" context="module">
    import { goto } from "svelte-pathfinder";
    import {
        collections,
        schemas,
        records,
        schemasKeys,
        schemaInvalID,
    } from "$client/stores/data";
    import Dialog from "$client/components/Dialog.svelte";
    import Fields from "./fields.svelte";
</script>

<script lang="ts">
    export let open = false;
    export let collection = "";

    let valid = true;

    async function editSchema(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const newName = String(data.get("collectionName"));

        if (collection && collection !== newName) {
            await collections.rename(collection, newName);
        }

        await records.upkeys(newName, $schemasKeys);
        schemas.cleanup();
        await schemas.set(newName, $schemas);
        goto(`/data/${newName}`);
    }
</script>

<Dialog {open} on:submit={editSchema} on:close bind:valid>
    <h3 slot="header">Edit collection</h3>
    <Fields bind:valid {collection} pattern="^[\w|\-]+$" />
    <nav slot="footer">
        <button type="reset" class="link">Cancel</button>
        <button
            type="submit"
            class="success"
            disabled={!valid || !isNaN(Number($schemaInvalID))}
        >
            Confirm
        </button>
    </nav>
</Dialog>
