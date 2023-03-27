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
    import Table from "$client/components/Table.svelte";
    import Form from "$client/components/Form.svelte";
    import Code from "$client/components/Code.svelte";
</script>

<script lang="ts">
    export let name: string;
    export let active: Item;
    export let open = false;

    function submitRecord(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const record = Object.fromEntries(data);
        // const body = [{ id: Date.now(), ...record }];
        collection.add(name, record);
        console.log(record, active);
    }
</script>

<Aside {open} right on:submit={submitRecord}>
    <h2 slot="header">Add record</h2>
    <Await promise={schemas.get(name)}>
        <fieldset>
            {#if $schemas}
                {@const records = active
                    ? $schemas.map((s) => {
                          console.log(active[s.name]);
                          return active[s.name]
                              ? { value: active[s.name], ...s }
                              : s;
                      })
                    : $schemas}
                {#each records as { type, name, required, opts, value }}
                    {#if type === "checkbox"}
                        <label>
                            <input
                                type="checkbox"
                                role="switch"
                                {name}
                                {required}
                                {value}
                            />&nbsp;
                            <span>{name}</span>
                        </label>
                    {:else if type === "textarea"}
                        <label>
                            <span>{name}</span>
                            <textarea {name} {...opts} {required}
                                >{value}</textarea
                            >
                        </label>
                    {:else if type === "select"}
                        <label>
                            <span>{name}</span>
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
                        <span>{name}</span>
                        <Code
                            code={JSON.stringify(
                                { type, name, opts, value },
                                null,
                                2
                            )}
                        />
                    {:else}
                        <label>
                            <span>{name}</span>
                            <input {type} {name} {...opts} {required} {value} />
                        </label>
                    {/if}
                {/each}
            {/if}
        </fieldset>
    </Await>
</Aside>
