<script lang="ts" context="module">
    import { onMount } from "svelte";
    import { fragment } from "svelte-pathfinder";
    import {
        Collection,
        schemas,
        files,
        type Item,
        collection,
    } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Code from "$client/components/Code.svelte";
    import Input from "./input.svelte";
    import Checkbox from "./checkbox.svelte";
    import Textarea from "./textarea.svelte";
    import Select from "./select.svelte";
    import File from "./file.svelte";
    import Json from "./json.svelte";
    import Markdown from "./markdown.svelte";

    import { date } from "$client/utils/time.js";
</script>

<script lang="ts">
    export let name: string = "";
    export let active: Item | null = null;
    export let open = false;

    async function getRecord() {
        const [edit, record, id] = $fragment.split("-");
        console.log(id);
        await collection.get(name);
        active = $collection.records?.find((r) => r.id === Number(id)) || {};
    }
    function makeRecords() {
        const fn = (s: any) =>
            active?.[s.name] ? { ...s, value: active[s.name] } : s;
        return active ? $schemas.map(fn) : $schemas;
    }
    function submitRecord(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const record = Object.fromEntries(data);
        collection.add(name, record);
        console.log(data, record, active);
    }
</script>

<Aside {open} right on:submit={submitRecord}>
    <h3 slot="header">Add record</h3>
    {#if active?.id}
        <p>Created {date(Number(active?.id))}</p>
    {/if}
    <Await promise={schemas.get(name).then(getRecord)}>
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
