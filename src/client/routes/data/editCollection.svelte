<script lang="ts" context="module">
    import { goto } from "svelte-pathfinder";
    import {
        records,
        files,
        schemas,
        schemaInvalid,
    } from "$client/stores/data.js";
    import Dialog from "$client/components/Dialog.svelte";
    import Schema from "./schema/schema.svelte";
</script>

<script lang="ts">
    export let open = false;
    export let file = "";

    let valid = true;

    async function submitCollection(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const newName = String(data.get("collectionName"));

        if (file && file !== newName) {
            await files.rename(file, newName);
        }

        await records.upkeys(newName, schemas.keys());
        await schemas.set(newName);
    }
</script>

<Dialog {open} on:submit={submitCollection} bind:valid>
    <h3 slot="header">Edit collection</h3>
    <Schema bind:valid {file} />
    <nav slot="footer">
        <button type="reset" class="link">Cancel</button>
        <button
            type="submit"
            class="success"
            disabled={!valid || !isNaN(Number($schemaInvalid))}
        >
            Confirm
        </button>
    </nav>
</Dialog>
