<script lang="ts" context="module">
    import { goto } from "svelte-pathfinder";
    import { collections, schemas, schemaInvalID } from "$client/stores/data";
    import Form from "$client/components/Form.svelte";
    import Fields from "./fields.svelte";
</script>

<script lang="ts">
    export let collection = "";

    let valid = true;

    async function addSchema(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const collectionName = String(data.get("collectionName"));

        schemas.cleanup();
        await schemas.set(collectionName, $schemas);
        const fragment = !$schemas.length ? "#edit-collection" : "";
        if (collectionName === collection) history.go();
        else goto(`/data/${collectionName}${fragment}`);
    }

    function clearSchemas() {
        schemas.clear();
    }
</script>

<Form on:submit={addSchema} on:reset={clearSchemas} bind:valid center>
    <h1 class="text-center">Add collection</h1>
    <Fields
        bind:valid
        {collection}
        pattern="(?!^{$collections.join('$|^')}$)[\w|\-]+"
    />
    <nav class="cols">
        <!-- <button type="reset" class="link">Cancel</button> -->
        <button
            type="submit"
            class="success"
            disabled={!valid || !isNaN(Number($schemaInvalID))}
        >
            Confirm
        </button>
    </nav>
</Form>
