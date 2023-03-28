<script lang="ts">
    export let data: Table;
    export let active: (item: Record<string, unknown>) => void;
    export let selected: number[];

    const html = (value: string) => /<|>/g.test(value);

    type Table = {
        thead?: Array<string>;
        tbody: Array<Record<string, any>>;
        tfoot?: Array<string[]>;
    };

    $: console.log(selected);
</script>

<table>
    <thead>
        <slot name="thead">
            {#if data?.thead?.length}
                <tr>
                    <th />
                    {#each data.thead as th}
                        <th>
                            {#if html(th)}
                                {@html th}
                            {:else}
                                {th}
                            {/if}
                        </th>
                    {/each}
                </tr>
            {/if}
        </slot>
    </thead>
    <tbody>
        {#each data.tbody as tr}
            <tr id={tr.id} on:click={() => active(tr)}>
                <td>
                    <input
                        type="checkbox"
                        value={tr.id}
                        bind:group={selected}
                    />
                </td>
                {#each Object.values(tr) as td}
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
