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
    export let valid = false;

    let type = field?.type;
    let name = field?.name;

    function selectType(e: SelectEvent) {
        const { value } = e.currentTarget;
        field = schemas.find((s) => s.type === value);
        type = field?.type;
        name = field?.name;
    }

    function inputType(value: any) {
        return !isNaN(value) ? "number" : "text";
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<details tabindex="0" bind:open>
    <summary id="field" tabindex="0">{name}</summary>
    <Form {id} on:input on:submit on:reset bind:valid>
        <fieldset class="cols col-2">
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

        <fieldset class="cols col-3" name="opts" id="opts">
            {#each Object.entries(field?.opts) as [name, value]}
                <label>
                    <small>{name}</small>
                    <input {name} type={inputType(value)} {value} />
                </label>
            {/each}
        </fieldset>

        <fieldset class="cols col-fit" name="custom" id="custom">
            <label class="cols align-center justify-start">
                <input
                    name="required"
                    type="checkbox"
                    role="switch"
                    checked={field?.required}
                />Required
            </label>
            <nav class="cols col-fit">
                <button type="reset" class="link box text-error">
                    <i class="icon icon-svg icon-trash" />
                </button>
                <button
                    type="submit"
                    class="link box text-success"
                    disabled={!valid || field?.valid}
                >
                    <i class="icon icon-svg icon-save" />
                </button>
            </nav>
        </fieldset>
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
    label.cols {
        --cols-gap: var(--gap-sm);
    }
</style>
