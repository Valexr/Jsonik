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
    import Icon from "$client/components/Icon.svelte";
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
        const { keys } = $collection;
        const newKeys = keys?.reduce((a, { type, name }) => {
            const newName = $schemas.find((s) => s.type === type)?.name;
            a[name] = newName;
            return a;
        }, {} as Record<string, string>);

        if (name && name !== newName) {
            await files.rename(name, newName);
        }
        // rename key
        // delete Object.assign(o, {[newKey]: o[oldKey] })[oldKey];
        await files.add(newName, $schemas);
        if (newKeys) await collection.update(newName, newKeys);
        await collection.get(newName);
        goto(`/data/${newName}`);
    }
</script>

<Dialog {open} on:submit={submitCollection} bind:valid={validCollection}>
    <h3 slot="header">{header}</h3>

    <fieldset class="cols">
        <label>
            <small>Name</small>
            <input
                name="collectionName"
                placeholder="collection name"
                pattern="^[\w,\-]+$"
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
            <details tabindex="0" role="list" bind:open={addOpen} class="top">
                <!-- svelte-ignore a11y-no-redundant-roles -->
                <summary
                    tabindex="0"
                    aria-haspopup="listbox"
                    role="button"
                    class="block link"
                    class:disabled={!validCollection || $schemasInvalid}
                >
                    <Icon icon="plus" />
                    New field
                </summary>
                <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
                <ul role="listbox" class="cols">
                    <!-- svelte-ignore missing-declaration -->
                    {#each SCHEMAS as schema}
                        <li>
                            <button
                                type="button"
                                class="block link outline"
                                on:click={() => addField(schema)}
                            >
                                <Icon icon={schema.type} color="gray" />
                                {schema.type}
                            </button>
                        </li>
                    {/each}
                    <li>
                        <button
                            type="button"
                            class="box link"
                            on:click={() => (addOpen = false)}
                        >
                            <Icon />
                        </button>
                    </li>
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
        position: sticky;
    }
    details summary {
        justify-content: center;
    }
    details summary::after {
        content: none;
    }
    details[open] ul.cols {
        background-color: var(--back);
    }
    details[open] ul.cols li:last-of-type {
        flex: 0 fit-content;
    }
    details[open] summary::before {
        content: none;
    }
    fieldset {
        margin-bottom: var(--gap);
    }
</style>
