<script lang="ts" context="module">
    import { fragment } from "svelte-pathfinder";
    import { get, post } from "$client/api/methods";
    import Await from "$client/components/Await.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Code from "$client/components/Code.svelte";
    import type { InputEvent } from "$types/client";
    // import type { ChangeEventHandler } from "svelte/elements";
</script>

<script lang="ts">
    let promise = get("/data/logs/items");
    let fragmentDate: number;

    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

    function getRecord(date: number) {
        $fragment = `log-${date}`;
        fragmentDate = date;
    }

    function search(e: InputEvent) {
        const { value } = e.currentTarget as HTMLInputElement;
        promise = get(`/data/logs/items?q=${value}`);
    }
    // $: date = $fragment.split("-")[1];
</script>

<!-- <h1>Logs</h1> -->

<fieldset class="cols">
    <label>
        <input type="search" placeholder="search" on:change={search} />
    </label>
</fieldset>

<Await {promise} success="Data loaded" let:result notify>
    <section>
        <article>
            <figure>
                <table>
                    <thead>
                        {#each Object.keys(result.at(-1)) as head}
                            <th>{head}</th>
                        {/each}
                    </thead>
                    <tbody>
                        {#each result.reverse() as item}
                            <tr
                                on:click|stopPropagation={() =>
                                    getRecord(item.date)}
                            >
                                {#each Object.entries(item) as [k, v]}
                                    {#if k === "date"}
                                        <td>
                                            <small
                                                >{new Date(v).toLocaleString(
                                                    "ru"
                                                )}</small
                                            >
                                        </td>
                                    {:else}
                                        <td
                                            class:text-success={k ===
                                                "status" && v === 200}
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
            </figure>
        </article>
    </section>
</Await>

<Aside open={$fragment === `log-${fragmentDate}`} right>
    <h2 slot="header">Record {fragmentDate}</h2>
    <Await promise={get(`/data/logs/items?date=${fragmentDate}`)} let:result>
        <Code code={JSON.stringify(result, null, 2)} />
    </Await>
</Aside>
