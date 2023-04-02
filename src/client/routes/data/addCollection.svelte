<script lang="ts" context="module">
    import { goto } from "svelte-pathfinder";
    import {
        collection,
        files,
        schemas,
        schemaInvalid,
    } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Form from "$client/components/Form.svelte";
    import Schema from "./schema/schema.svelte";
</script>

<script lang="ts">
    let valid = false;

    async function submitCollection(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const collectionName = String(data.get("collectionName"));

        await files.add(collectionName, $schemas);
        goto(`/data/${collectionName}`);
    }

    function clearSchemas() {
        schemas.clear();
    }
</script>

<Form on:submit={submitCollection} on:reset={clearSchemas} bind:valid center>
    <h1 class="text-center">Add collection</h1>
    <Schema bind:valid />
    <nav class="cols">
        <button type="reset" class="link">Cancel</button>
        <button
            type="submit"
            class="success"
            disabled={!valid || !isNaN(Number($schemaInvalid))}
        >
            Confirm
        </button>
    </nav>
</Form>
