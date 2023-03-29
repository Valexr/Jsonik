<script lang="ts" context="module">
    import { goto } from "svelte-pathfinder";
    import {
        collection,
        files,
        schemas,
        schemasInvalid,
        SCHEMAS,
        Schema,
    } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Field from "./field.svelte";
</script>

<script lang="ts">
    export let open = false;
    export let header = "Add collection";
    export let name = "";

    let validCollection = false;
    let addOpen = false;

    function addField(schema?: Schema) {
        schema = schema || SCHEMAS[0];
        schemas.add([{ id: Date.now(), ...schema }]);
        addOpen = false;
    }

    async function submitCollection(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const newName = String(data.get("collectionName"));

        if (name && name !== newName) {
            await files.rename(name, newName);
        }

        await files.add(newName, $schemas);
        await collection.get(newName);
        goto(`/data/${newName}`);
    }
</script>

<Dialog {open} on:submit={submitCollection} bind:valid={validCollection}>
    <h3 slot="header">{header}</h3>

    <fieldset class="cols">
        <label>
            <small>Name</small>
            <!-- svelte-ignore a11y-autofocus -->
            <input
                name="collectionName"
                placeholder="collection name"
                pattern="^[\w,\-]+$"
                autofocus={true}
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
                <Field {field} open={field.id === $schemasInvalid} />
            {/each}
        </Await>

        <nav>
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <details tabindex="0" role="list" bind:open={addOpen}>
                <!-- svelte-ignore a11y-no-redundant-roles -->
                <summary
                    tabindex="0"
                    aria-haspopup="listbox"
                    role="button"
                    class="block link"
                    class:disabled={!validCollection || $schemasInvalid}
                >
                    <!-- <i class="icon icon-svg icon-plus" /> -->
                    New field
                </summary>
                <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
                <ul role="listbox" class="cols">
                    <!-- svelte-ignore missing-declaration -->
                    {#each SCHEMAS as schema}
                        <li>
                            <button
                                class="block link outline"
                                type="button"
                                on:click={() => addField(schema)}
                            >
                                <i
                                    class="icon icon-svg icon-{schema.type} text-gray"
                                />
                                {schema.type}
                            </button>
                        </li>
                    {/each}
                </ul>
            </details>
        </nav>
    </fieldset>

    <nav slot="footer">
        <button type="reset">Cancel</button>
        <button
            type="submit"
            class="success"
            disabled={!validCollection || $schemasInvalid}
        >
            Submit
        </button>
    </nav>
</Dialog>

<style>
    details ul.cols {
        --cols-gap: var(--gap);
        padding: var(--gap);
        position: relative;
    }
    details summary {
        /* justify-content: center; */
    }
    details summary::after {
        /* content: none; */
    }
    details[open] ul.cols {
        background-color: var(--back);
    }
    details[open] summary::before {
        content: none;
    }
    fieldset {
        margin-bottom: var(--gap);
    }
</style>
