<script lang="ts" context="module">
    import { goto } from "svelte-pathfinder";
    import {
        records,
        files,
        schemas,
        schemaInvalid,
    } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
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

        const newKeys = $schemas?.reduce((a, { type, name }) => {
            const newName = $schemas.find((s) => s.type === type)?.name || "";
            a[name] = newName;
            console.log(a, name, newName);
            return a;
        }, {} as Record<string, string>);

        if (file && file !== newName) {
            await files.rename(file, newName);
        }

        await schemas.set(newName, $schemas);

        if (newKeys && Object.keys(newKeys).length)
            await records.update(newName, newKeys);

        // await collection.get(newName);
        goto(`/data/${newName}`);
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
