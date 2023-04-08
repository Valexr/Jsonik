<script lang="ts" context="module">
    import { goto } from "svelte-pathfinder";
    import { files, schemas, schemaInvalID } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Form from "$client/components/Form.svelte";
    import Schema from "./schema/schema.svelte";
</script>

<script lang="ts">
    export let file = "";

    let valid = true;

    async function submitCollection(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const collectionName = String(data.get("collectionName"));

        await schemas.set(collectionName, $schemas);
        const fragment = !$schemas.length ? "#edit-collection" : "";
        if (collectionName === file) history.go();
        else goto(`/data/${collectionName}${fragment}`);
    }

    function clearSchemas() {
        schemas.clear();
    }
</script>

<Form on:submit={submitCollection} on:reset={clearSchemas} bind:valid center>
    <h1 class="text-center">Add collection</h1>
    <Schema bind:valid {file} pattern="(?!^{$files.join('$|^')}$)[\w|\-]+" />
    <nav class="cols">
        <button type="reset" class="link">Cancel</button>
        <button
            type="submit"
            class="success"
            disabled={!valid || !isNaN(Number($schemaInvalID))}
        >
            Confirm
        </button>
    </nav>
</Form>
