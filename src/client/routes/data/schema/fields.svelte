<script lang="ts" context="module">
    import { schemas, schemaInvalID } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Details from "$client/components/Details.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Field from "./field.svelte";
    import Schemas from "./schemas.svelte";
</script>

<script lang="ts">
    export let collection = "";
    export let valid = true;
    export let pattern: string;

    const tabs = ["Fields", "Rules"];

    let open = false;
    let activeTab = tabs[0];

    function setTab(e: MouseEvent) {
        const { id } = e.currentTarget as HTMLButtonElement;
        activeTab = id;
    }
</script>

<fieldset class="cols">
    <label>
        <small>Name</small>
        <input
            type="text"
            name="collectionName"
            placeholder="collection name"
            {pattern}
            value={collection}
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
        {#each tabs as tab}
            <button
                id={tab}
                type="button"
                disabled={activeTab === tab}
                on:click={setTab}
            >
                {tab}
            </button>
        {/each}
    </legend>

    {#if activeTab === "Fields"}
        <!-- <Await promise={schemas.get(collection)}> -->
        {#each $schemas as field, id (field.id)}
            <Field
                {field}
                id={String(id)}
                open={field.id === $schemaInvalID}
                bind:valid
            />
        {/each}
        <!-- </Await> -->
    {:else if activeTab === "Rules"}
        <fieldset class="cols column">
            <label>
                <small>List/Search</small>
                <input placeholder="List/Search" />
            </label>
            <label>
                <small>View</small>
                <input placeholder="View" />
            </label>
            <label>
                <small>Create</small>
                <input placeholder="Create" />
            </label>
            <label>
                <small>Update</small>
                <input placeholder="Update" />
            </label>
            <label>
                <small>Delete</small>
                <input placeholder="Delete" />
            </label>
        </fieldset>
    {/if}

    <nav>
        <Details
            bind:open
            disabled={!valid || !isNaN(Number($schemaInvalID))}
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
