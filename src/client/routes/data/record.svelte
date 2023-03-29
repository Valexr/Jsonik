<script lang="ts" context="module">
    import {
        path,
        state,
        fragment,
        redirect,
        paramable,
        type Param,
        type Parsable,
    } from "svelte-pathfinder";
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
    import Table from "$client/components/Table.svelte";
    import Form from "$client/components/Form.svelte";
    import Code from "$client/components/Code.svelte";
    import { expand } from "$client/utils/actions.js";
    import { date } from "$client/utils/time.js";
</script>

<script lang="ts">
    export let name: string;
    export let active: Item;
    export let open = false;

    function makeRecords() {
        const fn = (s: any) =>
            active[s.name] ? { value: active[s.name], ...s } : s;
        return active ? $schemas.map(fn) : $schemas;
    }
    function submitRecord(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const record = Object.fromEntries(data);
        collection.add(name, record);
        console.log(record, active);
    }
    function clean(obj: object) {
        return JSON.parse(JSON.stringify(obj, (_, v) => v || undefined));
    }
</script>

<Aside {open} right on:submit={submitRecord}>
    <h3 slot="header">Add record</h3>
    {#if active}
        <p>Created {date(Number(active?.id))}</p>
    {/if}
    <Await promise={schemas.get(name)}>
        <fieldset>
            {#each makeRecords() as { type, name, required, opts, value }}
                {#if type === "checkbox"}
                    <label>
                        <input
                            type="checkbox"
                            role="switch"
                            {name}
                            {required}
                            checked={value}
                        />&nbsp;
                        <small>{name}</small>
                    </label>
                {:else if type === "textarea"}
                    <label>
                        <small><Icon icon={type} color="gray" /> {name}</small>
                        <textarea {name} {...clean(opts)} {required} use:expand
                            >{value}</textarea
                        >
                    </label>
                {:else if type === "select"}
                    <label>
                        <small><Icon icon={type} color="gray" /> {name}</small>
                        <select
                            {name}
                            multiple={opts.max > 1}
                            size={opts.max}
                            {required}
                            {value}
                        >
                            {#each opts?.options?.split(",") as option}
                                <option>{option}</option>
                            {/each}
                        </select>
                    </label>
                {:else if "json, markdown".includes(type)}
                    {@const code = { type, name, opts, value }}
                    <small><Icon icon={type} color="gray" /> {name}</small>
                    <Code code={JSON.stringify(code, null, 2)} />
                {:else}
                    <label>
                        <small><Icon icon={type} color="gray" /> {name}</small>
                        <input
                            {type}
                            {name}
                            {required}
                            {...clean(opts)}
                            value={value || ""}
                        />
                    </label>
                {/if}
            {/each}
        </fieldset>
    </Await>
</Aside>
