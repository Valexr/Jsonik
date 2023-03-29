<script lang="ts" context="module">
    import Icon from "./Icon.svelte";
    import { date } from "$client/utils/time.js";
    import type { InputEvent } from "$types/client.js";
    import type { Item } from "$client/stores/data.js";
</script>

<script lang="ts">
    export let data: Table;
    export let current: ((id: number) => void) | undefined = undefined;
    export let selected: number[];
    export let selectable = true;
    export let timeable = 1;

    function selectAll(e: InputEvent) {
        const { checked, id } = e.currentTarget;
        selected = checked ? data.tbody.map((tb) => tb[id]) : [];
    }

    const html = (value: string) => /<|>/g.test(value);

    type Table = {
        thead?: Array<string & { type: string; name: string }>;
        tbody: Array<Record<string, any>>;
        tfoot?: Array<string[]>;
    };

    let sorted = true;
    function sort(e: MouseEvent) {
        const { id } = e.currentTarget as HTMLButtonElement;
        const compare = (a: Item, b: Item) =>
            String(a[id]).localeCompare(String(b[id]));
        const fn = (a: Item, b: Item) =>
            sorted ? compare(a, b) : compare(b, a);
        sorted = !sorted;
        data.tbody = data.tbody.sort(fn);
    }

    function select(e: MouseEvent) {
        const { id } = e.currentTarget as HTMLTableRowElement;
        const { nodeName } = e.target as HTMLTableRowElement;
        const input = nodeName === "INPUT";
        if (!input) current?.(Number(id));
    }

    $: console.log(selected);
</script>

<table class:selectable>
    <thead>
        <slot name="thead">
            {#if data?.thead?.length}
                {@const id = data.thead[0].name || data.thead[0]}
                <tr>
                    {#if selectable}
                        <th>
                            <input type="checkbox" on:change={selectAll} {id} />
                        </th>
                    {/if}
                    {#if timeable}
                        <th role="button" id="id" on:click={sort} class="link">
                            <Icon icon="date" color="gray" /> created
                        </th>
                    {/if}
                    {#each data.thead.slice(timeable) as th, i}
                        {#if th.type && th.name}
                            <th
                                role="button"
                                class="link"
                                id={th.name}
                                on:click={sort}
                            >
                                <Icon icon={th.type} color="gray" />
                                {th.name}
                            </th>
                        {:else}
                            <th
                                role="button"
                                class="link"
                                id={th}
                                on:click={sort}
                            >
                                {th}
                            </th>
                        {/if}
                    {/each}
                </tr>
            {/if}
        </slot>
    </thead>
    <tbody>
        {#each data.tbody as tr}
            {@const id = Object.values(tr)[0]}
            <tr {id} on:click={select}>
                {#if selectable}
                    <td>
                        <input
                            type="checkbox"
                            value={id}
                            on:click
                            bind:group={selected}
                        />
                    </td>
                {/if}
                {#if timeable}
                    <td>{date(id)}</td>
                {/if}
                {#each Object.values(tr).slice(timeable) as td, i}
                    <td>
                        {#if html(td)}
                            {@html td}
                        {:else}
                            {td}
                        {/if}
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
    <tfoot>
        <slot name="tfoot">
            {#if data?.tfoot?.length}
                {#each data.tfoot as tr}
                    <tr>
                        {#each tr as td}
                            <td>{td}</td>
                        {/each}
                    </tr>
                {/each}
            {/if}
        </slot>
    </tfoot>
</table>
