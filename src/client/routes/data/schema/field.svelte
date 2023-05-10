<script lang="ts" context="module">
    import { schemas, schemaNames } from "$client/stores/data";
    import { SCHEMAS } from "$client/stores/schemas";

    import Form from "$client/components/Form.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Details from "$client/components/Details.svelte";
    import type { Schema } from "$types/server";

    export type SelectEvent = Event & {
        currentTarget: EventTarget & HTMLSelectElement;
    };
    export type Opts = Record<string, FormDataEntryValue | number>;
</script>

<script lang="ts">
    export let id: string = "";
    export let open: boolean;
    export let field: Schema;
    export let valid = false;

    const prevName = field.name;

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
    function save(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const entries = Object.fromEntries(data) as Record<string, any>;
        const { type, name, required, ...opts } = entries;

        for (const key in opts) {
            const value = opts[key];
            opts[key] = (value && Number(value)) || value;
        }

        Object.assign(field, { prevName, required, opts });
        schemas.save(field);
    }
    function del() {
        schemas.delete(field.id);
    }

    function dnd(de: HTMLDetailsElement) {
        de.ondragstart = (e: DragEvent) => {
            e.dataTransfer?.clearData();
            e.dataTransfer?.setData("fieldID", id);
        };
        de.ondragover = (e: DragEvent) => {
            e.preventDefault();
            de.focus();
        };
        de.ondragleave = (e: DragEvent) => de.blur();
        de.ondrop = async (e: DragEvent) => {
            const { dataTransfer, currentTarget } = e;
            const { id: to } = currentTarget as HTMLElement;
            const from = dataTransfer?.getData("fieldID");
            if (from !== to) {
                schemas.move(Number(from), Number(to));
            }
            de.blur();
        };
    }
</script>

<!-- svelte-ignore a11y-autofocus -->
<Details
    {id}
    bind:open
    draggable={!open}
    on:input={invalidate}
    invalid={!valid || !field.valid}
    class="block"
    button={!open}
    action={dnd}
    back
>
    <svelte:fragment slot="summary">
        <Icon icon={field.icon} color="gray" />
        <input
            required
            type="text"
            autofocus={open}
            pattern={!field.name
                ? `(?!^${$schemaNames.join("$|^")}$)[\\w|\\-]+`
                : `^[\\w|\\-]+$`}
            placeholder={field.type}
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
                            use:attributes={{
                                type: field.type,
                                name,
                                value,
                            }}
                        />
                    </label>
                {/each}
            {/if}
        </fieldset>

        <fieldset class="cols col-fit align-center" name="custom" id="custom">
            <nav class="cols">
                <label>
                    <input
                        name="required"
                        type="checkbox"
                        role="switch"
                        checked={field.required}
                    /> Required
                </label>
            </nav>

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
