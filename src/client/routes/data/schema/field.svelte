<script lang="ts" context="module">
    import { schemas, SCHEMAS, type Schema } from "$client/stores/data.js";
    import Form from "$client/components/Form.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Details from "$client/components/Details.svelte";

    export type SelectEvent = Event & {
        currentTarget: EventTarget & HTMLSelectElement;
    };
</script>

<script lang="ts">
    export let open: boolean;
    export let field = SCHEMAS[0];
    export let valid = true;

    let prevName = field.name;

    function attributes(input: HTMLInputElement, opt: Record<string, any>) {
        const { type, name, value } = opt;
        const schema = SCHEMAS.find((s) => s.type === opt.type);
        const def = schema?.opts?.[name as keyof typeof schema.opts];
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
    function save(e: SubmitEvent | InputEvent | KeyboardEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const { type, name, required, ...opts } = Object.fromEntries(data);
        console.log(prevName, name);
        field = { ...field, prevName, required, opts } as unknown as Schema;
        schemas.save(field as Schema);
    }
    function del() {
        schemas.delete(field.id);
    }
</script>

<!-- svelte-ignore a11y-autofocus -->
<Details
    bind:open
    draggable={!open}
    on:input={invalidate}
    invalid={!valid || !field.valid}
    class="block"
    button={!open}
    back
>
    <svelte:fragment slot="summary">
        <Icon icon={field.type} color="gray" />
        <input
            required
            type="text"
            autofocus={true}
            pattern="^[\w|\-]+$"
            bind:value={field.name}
            form={String(field.id)}
        />
    </svelte:fragment>

    <Form
        id={String(field.id)}
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
            {#if field.opts}
                {#each Object.entries(field.opts) as [name, value]}
                    <label>
                        <small>{name}</small>
                        <input
                            use:attributes={{ type: field.type, name, value }}
                        />
                    </label>
                {/each}
            {/if}
        </fieldset>

        <fieldset class="cols col-fit align-center" name="custom" id="custom">
            <label>
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
                    disabled={!valid || field.valid}
                >
                    <Icon icon="save" />
                </button>
            </nav>
        </fieldset>
    </Form>
</Details>
