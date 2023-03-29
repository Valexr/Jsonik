<script lang="ts" context="module">
    import { fragment, query } from "svelte-pathfinder";
    import { get } from "$client/api/methods.js";
    import { date } from "$client/utils/time.js";
    import Await from "$client/components/Await.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Table from "$client/components/Table.svelte";
    import Code from "$client/components/Code.svelte";
</script>

<script lang="ts">
    let fragmentID: number;

    function getRecord(id: number) {
        fragment.set(`#log-${id}`);
        fragmentID = id;
    }
</script>

<Await promise={get(`/logs/data/items?q=${$query.q || ""}`)} let:result notify>
    <section class="scroll-x">
        {#if result}
            {@const thead = Object.keys(result.at(-1))}
            {@const tbody = result}
            <Table data={{ thead, tbody }} current={getRecord} />
        {/if}
    </section>
</Await>

<Aside open={$fragment === `#log-${fragmentID}`} right>
    <h2 slot="header">Record {fragmentID}</h2>
    <Await promise={get(`/logs/data/items?id=${fragmentID}`)} let:result>
        <Code code={JSON.stringify(result, null, 2)} />
    </Await>
</Aside>
