<script lang="ts" context="module">
    import { schemas, SCHEMAS, type Schema } from "$client/stores/data.js";
    import Form from "$client/components/Form.svelte";
    import Icon from "$client/components/Icon.svelte";

    export type SelectEvent = Event & {
        currentTarget: EventTarget & HTMLSelectElement;
    };
</script>

<script lang="ts">
    export let open: boolean;
    export let field: Schema = SCHEMAS[0];
    export let valid = false;

    function attributes(input: HTMLInputElement, opt: Record<string, any>) {
        const { type, name, value } = opt;
        const schema = SCHEMAS.find((s) => s.type === opt.type);
        const def = schema?.opts[name as keyof typeof schema.opts];
        const typeDate = "date, time, datetime-local".includes(type);
        const inputType = (value?: string) =>
            value && !isNaN(Number(value)) ? "number" : "text";

        input.name = name;
        input.type = typeDate ? type : inputType(String(def));
        input.placeholder = String(def);
        input.value = value === def ? "" : value;
    }

    function invalidate() {
        schemas.invalidate(field.id);
    }
    function save(e: SubmitEvent | InputEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const { type, name, required, ...opts } = Object.fromEntries(data);
        schemas.save({ ...field, required, opts });
    }
    function del() {
        schemas.del(field.id);
    }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<details
    tabindex="0"
    bind:open
    draggable={!open}
    on:input={invalidate}
    on:submit={console.log}
>
    <summary tabindex="0" class:invalid={!valid || !field?.valid}>
        <Icon icon={field.type} color="gray" />
        <!-- svelte-ignore a11y-autofocus -->
        <input
            autofocus={open}
            bind:value={field.name}
            on:change|self={() => schemas.save(field)}
        />
    </summary>

    <Form
        id={field.id}
        method="POST"
        on:submit={save}
        on:reset={del}
        bind:valid
    >
        <fieldset class="hidden">
            <label>
                <input type="hidden" name="type" value={field.type} />
            </label>
            <label>
                <input type="hidden" name="name" value={field.name} />
            </label>
        </fieldset>

        <fieldset class="cols" name="opts" id="opts">
            {#each Object.entries(field.opts) as [name, value]}
                <label>
                    <small>{name}</small>
                    <input use:attributes={{ type: field.type, name, value }} />
                </label>
            {/each}
        </fieldset>

        <fieldset class="cols col-fit" name="custom" id="custom">
            <label class="cols align-center justify-start">
                <input
                    name="required"
                    type="checkbox"
                    role="switch"
                    checked={field.required}
                /> Required
            </label>

            <nav class="cols col-fit">
                <button type="reset" class="link box text-error">
                    <Icon icon="trash" />
                </button>
                <button
                    type="submit"
                    class="link box text-success"
                    disabled={!valid || field?.valid}
                >
                    <Icon icon="save" />
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
    details summary {
        padding-left: 0.5em;
    }
    details summary .icon {
        cursor: grab;
    }
    details summary input {
        border: 0;
    }
    details[open] summary {
        margin-bottom: var(--gap);
    }
    label.cols {
        --cols-gap: var(--gap-sm);
    }
</style>
