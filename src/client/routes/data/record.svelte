<script lang="ts" context="module">
    import { onMount } from "svelte";
    import { fragment } from "svelte-pathfinder";
    import { schemas, records, type Item } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Code from "$client/components/Code.svelte";
    import Input from "./record/input.svelte";
    import Checkbox from "./record/checkbox.svelte";
    import Textarea from "./record/textarea.svelte";
    import Select from "./record/select.svelte";
    import File from "./record/file.svelte";
    import Json from "./record/json.svelte";
    import Markdown from "./record/markdown.svelte";

    import { date } from "$client/utils/time.js";
</script>

<script lang="ts">
    export let file: string = "";
    export let active: Item | null = null;
    export let open = false;
    export let header = "Add record";

    function getRecord() {
        const [edit, record, id] = $fragment.split("-");
        active = $records?.find((r) => r.id === Number(id)) || {};
    }
    function makeRecords() {
        const fn = (s: any) =>
            active?.[s.name] ? { ...s, value: active[s.name] } : s;
        return active ? $schemas.map(fn) : $schemas;
    }
    function submitRecord(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const record = Object.fromEntries(data);
        records.set(file, record);
        console.log(data, record, active);
    }
</script>

<Aside {open} right on:submit={submitRecord}>
    <h3 slot="header">{header} {active?.id || ""}</h3>
    {#if active?.id}
        <p>Created: {date(Number(active?.id))}</p>
    {/if}
    <nav class="buttons-group">
        <a href={$fragment} role="button" class="link">Form</a>
        <a href={$fragment} role="button">Code</a>
    </nav>
    <Await promise={schemas.get(file).then(getRecord)}>
        <fieldset>
            {#each makeRecords() as { type, ...props }}
                {#if type === "checkbox"}
                    <Checkbox {...props} />
                {:else if type === "textarea"}
                    <Textarea {...props} />
                {:else if type === "select"}
                    <Select {...props} />
                {:else if type === "json"}
                    <Json {...props} />
                {:else if type === "markdown"}
                    <Markdown {...props} />
                {:else if type === "file"}
                    <File {...props} />
                {:else}
                    <Input {type} {...props} />
                {/if}
            {/each}
        </fieldset>
    </Await>
</Aside>
