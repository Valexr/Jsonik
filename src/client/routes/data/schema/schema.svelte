<script lang="ts" context="module">
    import { schemas, schemaInvalid } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Details from "$client/components/Details.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Field from "./field.svelte";
    import Schemas from "./schemas.svelte";
</script>

<script lang="ts">
    export let file = "";
    export let valid = true;
    export let open = false;
    export let pattern = "^[\\w|\\-]+$";
</script>

<fieldset class="cols">
    <label>
        <small>Name</small>
        <input
            type="text"
            name="collectionName"
            placeholder="collection name"
            {pattern}
            value={file}
            required
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
    <legend class="buttons-group">
        <a href="" role="button" class="link">Fields</a>
        <a href="" role="button">Rules</a>
    </legend>

    <Await promise={schemas.get(file)}>
        {#each $schemas as field (field.id)}
            <Field {field} open={field.id === $schemaInvalid} bind:valid />
        {/each}
    </Await>

    <nav>
        <Details
            bind:open
            disabled={!valid || !isNaN(Number($schemaInvalid))}
            class="block clear"
            back={open}
            button
        >
            <svelte:fragment slot="summary">
                <Icon icon="plus" />
                New field
            </svelte:fragment>
            <Schemas bind:open />
        </Details>
    </nav>
</fieldset>

<style>
    fieldset {
        margin-bottom: var(--gap);
    }
    nav {
        margin: var(--gap-sm) 0 var(--gap);
    }
</style>
