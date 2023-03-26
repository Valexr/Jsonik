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
    import { records, files, type Item } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Table from "$client/components/Table.svelte";
    import Form from "$client/components/Form.svelte";
    import Code from "$client/components/Code.svelte";
</script>

<script lang="ts">
    export let active: Item;
</script>

<Aside open={$fragment === `#add-record`} right>
    <h2 slot="header">Record {active?.date}</h2>
    <Code code={JSON.stringify(active, null, 2)} />
    <Form>
        <fieldset class="">
            {#each $records?.schemas as { type, name, opts }}
                {#if type === "checkbox"}
                    <label>
                        <input type="checkbox" role="switch" {name} />&nbsp;
                        <span>{name}</span>
                    </label>
                {:else}
                    <label>
                        <span>{name}</span>
                        <input {type} {name} {...opts} />
                    </label>
                {/if}
            {/each}
        </fieldset>
    </Form>
</Aside>
