<script lang="ts" context="module">
    import { fragment, query } from "svelte-pathfinder";
    import { get } from "$client/api/methods.js";
    import { date } from "$client/utils/time.js";
    import Await from "$client/components/Await.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Code from "$client/components/Code.svelte";
</script>

<script lang="ts">
    let fragmentDate: number;

    function getRecord(date: number) {
        fragment.set(`#log-${date}`);
        fragmentDate = date;
    }
</script>

<Await promise={get(`/data/logs/items?q=${$query.q || ""}`)} let:result notify>
    <section class="scroll-x">
        <table>
            <thead>
                {#each Object.keys(result.at(-1)) as key}
                    <th>{key}</th>
                {/each}
            </thead>
            <tbody>
                {#each result as item}
                    <tr on:click={() => getRecord(item.date)}>
                        {#each Object.entries(item) as [k, v]}
                            {#if k === "date"}
                                <td>
                                    <small>{date(v)}</small>
                                </td>
                            {:else}
                                <td
                                    class:text-success={k === "status" &&
                                        v === 200}
                                    class:text-bold={[
                                        "method",
                                        "status",
                                    ].includes(k)}>{v}</td
                                >
                            {/if}
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </section>
</Await>

<Aside open={$fragment === `#log-${fragmentDate}`} right>
    <h2 slot="header">Record {fragmentDate}</h2>
    <Await promise={get(`/data/logs/items?date=${fragmentDate}`)} let:result>
        <Code code={JSON.stringify(result, null, 2)} />
    </Await>
</Aside>
