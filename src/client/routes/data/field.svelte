<script lang="ts" context="module">
    import { SCHEMAS, type Schema } from "$client/stores/data.js";
    import Form from "$client/components/Form.svelte";

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
    let opts = field?.opts;

    function selectType(e: SelectEvent) {
        const { value } = e.currentTarget;
        field = SCHEMAS.find((s) => s.type === value);
        type = field?.type;
        name = field?.name;
        opts = field?.opts;
    }

    function inputType(value: any) {
        return !isNaN(value) ? "number" : "text";
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<details tabindex="0" bind:open>
    <summary tabindex="0" class:valid={!valid || !field?.valid}>{name}</summary>
    <Form {id} on:input on:submit on:reset bind:valid>
        <fieldset class="cols col-2">
            <label>
                <small>Type</small>
                <!-- svelte-ignore a11y-autofocus -->
                <select
                    id="type"
                    name="type"
                    autofocus={true}
                    bind:value={type}
                    on:change={selectType}
                >
                    {#each SCHEMAS as { type }}
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
            {#each Object.entries(opts) as [name, value]}
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
    details[open] summary {
        margin-bottom: var(--gap);
    }
    label.cols {
        --cols-gap: var(--gap-sm);
    }
</style>
