<script lang="ts" context="module">
    import { path, fragment, redirect, submit } from "svelte-pathfinder";
    import { collections, schemas, data } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Collection from "./collection.svelte";
</script>

<script lang="ts">
    let type: keyof typeof schemas = "text";

    async function addCollection(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const file = data.get("collectionName");
        const body = Object.entries(schemas).map(([type, v]) => ({
            type,
            ...v,
        }));
        console.log(body);
        await collections.add(String(file), "schema", body);
    }
    // String.raw`^[\w,\-]+`
</script>

<Await promise={collections.get()}>
    <nav
        class="text-center cols col-fit nowrap scroll-x"
        class:justify-start={$collections.length}
        class:justify-center={!$collections.length}
    >
        <a
            href="#add-collection"
            role="button"
            draggable="false"
            class="pos-sticky back-back"
            class:box={$collections.length}
        >
            <i class="icon icon-svg icon-125x icon-plus-square" />
            {#if !$collections.length}Add collection{/if}
        </a>
        {#each $collections as collection}
            <Collection {collection} />
        {/each}
    </nav>
</Await>

<Dialog
    open={$fragment === `#add-collection`}
    on:submit={addCollection}
    size=""
>
    <h2 slot="header">New collection</h2>
    <fieldset class="cols">
        <label>
            <small>Name</small>
            <input
                name="collectionName"
                placeholder="collection name"
                pattern="^[\\w,\\-]+$"
                autofocus={true}
                required
            />
        </label>
        <label>
            <small>Token</small>
            <input placeholder="collection name" />
        </label>
        <label>
            <small>Api</small>
            <input placeholder="collection name" />
        </label>
    </fieldset>
    <fieldset>
        <legend>Fileds</legend>
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <details tabindex="0">
            <!-- svelte-ignore a11y-no-redundant-roles -->
            <summary id="field" tabindex="0">{type}</summary>
            <fieldset class="cols">
                <label>
                    <small>Type</small>
                    <select name="type" id="type" bind:value={type}>
                        {#each Object.keys(schemas) as key}
                            <option>{key}</option>
                        {/each}
                    </select>
                </label>
                <label>
                    <small>Name</small>
                    <input placeholder="field name" required value="field" />
                </label>
            </fieldset>
            {#if type}
                <fieldset class="cols">
                    {#each Object.entries(schemas[type]) as [key, value]}
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <label>
                            <small>{key}</small>
                            <input type={typeof value} {value} />
                        </label>
                    {/each}
                </fieldset>
            {/if}
        </details>

        <nav>
            <button class="block" type="button">
                <i class="icon icon-svg icon-plus" />New field
            </button>
        </nav>
    </fieldset>
</Dialog>

<style>
    nav {
        margin: var(--gap-lg) 0;
    }
    summary#field {
        margin-bottom: var(--gap);
    }
    fieldset {
        margin-bottom: var(--gap);
    }
    fieldset.cols {
        --cols-gap: var(--gap-sm);
    }
    fieldset.cols label {
        margin: 0;
    }
    details {
        background-color: var(--back);
    }
    details fieldset {
        padding: 0 var(--gap) var(--gap);
        margin: 0;
    }
    [href="#add-collection"] {
        left: 0;
        z-index: 1;
        background-color: var(--back);
    }
</style>
