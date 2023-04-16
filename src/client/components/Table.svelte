<script lang="ts" context="module">
    import Icon from "./Icon.svelte";
    import { date } from "$client/utils/time.js";
    import LightBox from "$client/components/LightBox.svelte";
    import type { InputEvent } from "$types/client.js";
    import type { Item } from "$client/stores/data.js";
    import type { Schema } from "$client/stores/schemas.js";

    type Table = {
        thead?: Array<Partial<Schema>>;
        tbody: Array<Item>;
        tfoot?: Array<string[]>;
    };
</script>

<script lang="ts">
    export let data: Table;
    export let current: ((id: number) => void) | undefined = undefined;
    export let selected: number[] = [];
    export let selectable = true;
    export let timeable = true;
    export let updated = false;

    let sorted: Record<string, string> = { id: "down" };

    function sort(e: MouseEvent) {
        const { id } = e.currentTarget as HTMLButtonElement;
        const compare = (a: Item, b: Item) =>
            !isNaN(a[id])
                ? Math.sign(b[id] - a[id])
                : String(a[id]).localeCompare(String(b[id]));
        const fn = (a: Item, b: Item) =>
            sorted[id] === "up" ? compare(a, b) : compare(b, a);
        sorted = { [id]: sorted[id] === "up" ? "down" : "up" };
        data.tbody = data.tbody.sort(fn);
    }

    function select(e: MouseEvent) {
        const { id } = e.currentTarget as HTMLTableRowElement;
        const { nodeName } = e.target as HTMLTableRowElement;
        const input = ["INPUT", "A"].includes(nodeName);
        if (!input) current?.(Number(id));
    }

    function selectAll(e: InputEvent) {
        const { checked } = e.currentTarget;
        selected = checked ? data.tbody.map((tb) => tb.id) : [];
    }

    const html = (value: string) => /<|>/g.test(value);
</script>

<table class:selectable class:updated>
    <thead>
        <slot name="thead">
            {#if data?.thead?.length}
                <tr>
                    {#if selectable}
                        <th>
                            <input
                                type="checkbox"
                                checked={selected?.length > 0 &&
                                    selected?.length === data.tbody?.length}
                                on:change={selectAll}
                            />
                        </th>
                    {/if}
                    {#if timeable}
                        <th role="button" id="id" class="link" on:click={sort}>
                            <span>
                                <Icon icon="date" /> created
                                {#if "id" in sorted}
                                    <Icon icon="arrow-{sorted.id}" />
                                {/if}
                            </span>
                        </th>
                    {/if}
                    {#each data.thead as th}
                        <th
                            role="button"
                            class="link"
                            id={String(th.name || th)}
                            on:click={sort}
                        >
                            <span>
                                {#if th.type && th.name}
                                    <Icon icon={th.type} />
                                {/if}
                                {th.name || th}
                                {#if String(th.name || th) in sorted}
                                    <Icon
                                        icon="arrow-{sorted[
                                            String(th.name || th)
                                        ]}"
                                    />
                                {/if}
                            </span>
                        </th>
                    {/each}
                    {#if updated}
                        <th
                            role="button"
                            id="updated"
                            class="link"
                            on:click={sort}
                        >
                            <span>
                                <Icon icon="date" color="gray" /> updated
                                {#if "updated" in sorted}
                                    <Icon icon="arrow-{sorted.updated}" />
                                {/if}
                            </span>
                        </th>
                    {/if}
                </tr>
            {/if}
        </slot>
    </thead>
    <tbody>
        {#each data.tbody as tr}
            {@const id = tr.id}
            {@const up = tr.updated}
            <tr {id} on:click={select}>
                {#if selectable}
                    <td>
                        <input
                            type="checkbox"
                            value={id}
                            bind:group={selected}
                        />
                    </td>
                {/if}
                {#if timeable}
                    <td>{date(id)}</td>
                {/if}
                {#if data.thead?.length}
                    {#each data.thead as td}
                        {#if td.name}
                            <td>
                                <!-- {#if html(tr[td.name])}
                                    {@html tr[td.name]}
                                {:else  -->
                                {#if td.type === "file"}
                                    <ul
                                        role="listbox"
                                        class="cols col-fit align-center justify-start nowrap"
                                    >
                                        {#if tr[td.name]?.length}
                                            {#each tr[td.name] as file (file)}
                                                <li>
                                                    <LightBox {file} />
                                                </li>
                                            {/each}
                                        {/if}
                                    </ul>
                                {:else}
                                    <p>{tr[td.name]}</p>
                                {/if}
                            </td>
                        {/if}
                    {/each}
                {/if}
                {#if updated}
                    <td>{date(up || id)}</td>
                {/if}
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

<style>
    /* a {
        width: 3rem;
        height: 3rem;
        border-radius: var(--border-radius-sm);
        display: inline-block;
        color: transparent;
        background-size: cover;
        overflow: hidden;
    } */
</style>
