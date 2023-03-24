<script lang="ts" context="module">
    import { path, fragment, redirect, submit } from "svelte-pathfinder";
    import { collections, schemas, data } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Form from "$client/components/Form.svelte";

    export type Schema = Record<string, any>;
    export type Schemas = Array<Record<string, any>>;
    export type SelectEvent = Event & {
        currentTarget: EventTarget & HTMLSelectElement;
    };
</script>

<script lang="ts">
    export let id: string;
    export let open: boolean;
    export let field: Schema | undefined;

    let type = field?.type;
    let name = field?.name;
    let valid = false;

    function selectType(e: SelectEvent) {
        const { value } = e.currentTarget;
        field = schemas.find((s) => s.type === value);
        type = field?.type;
        name = field?.name;
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<details tabindex="0" bind:open>
    <summary id="field" tabindex="0">{name}</summary>
    <Form {id} on:submit on:reset bind:valid>
        <fieldset class="cols">
            <label>
                <small>Type</small>
                <select
                    id="type"
                    name="type"
                    bind:value={type}
                    on:change={selectType}
                >
                    {#each schemas as { type }}
                        <option>{type}</option>
                    {/each}
                </select>
            </label>
            <label>
                <small>Name</small>
                <input
                    name="name"
                    required
                    placeholder="field name"
                    bind:value={name}
                />
            </label>
        </fieldset>

        <fieldset class="cols" name="opts" id="opts">
            {#each Object.entries(field?.opts) as [name, value]}
                <label>
                    <small>{name}</small>
                    <input {name} type={typeof value} {value} />
                </label>
            {/each}
        </fieldset>

        <nav class="cols col-fit justify-center">
            <button type="reset" class="link box text-error">
                <i class="icon icon-svg icon-trash" />
            </button>
            <button
                type="submit"
                class="link box text-success"
                disabled={!valid}
            >
                <i class="icon icon-svg icon-save" />
            </button>
        </nav>
    </Form>
</details>

<style>
    details {
        background-color: var(--back);
    }
    details fieldset {
        padding: 0 var(--gap) var(--gap);
        margin: 0;
    }
    details[open] summary#field {
        margin-bottom: var(--gap);
    }
</style>
