<script lang="ts" context="module">
    import { fragment, query } from "svelte-pathfinder";
    import { get } from "$client/api/methods";
    import { logs } from "$client/stores/logs";
    import { date } from "$client/utils/time";
    import Await from "$client/components/Await.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Table from "$client/components/Table.svelte";
    import Code from "$client/components/Code.svelte";
</script>

<script lang="ts">
    let fragmentID = Number($fragment.split("-")[1]);

    function getRecord(id: number) {
        fragment.set(`#log-${id}`);
        fragmentID = id;
    }
</script>

<Await promise={logs.get($query)} notify>
    <section class="scroll-x">
        {#if $logs.docs.length}
            {@const thead = Object.keys($logs?.docs.at(-1) || {})
                .slice(1)
                .filter((n) => n !== "message")
                .map((k) => ({ name: k }))}
            {@const tbody = $logs.docs}
            <Table data={{ thead, tbody }} current={getRecord} />
        {/if}
    </section>

    <Aside open={$fragment === `#log-${fragmentID}`} right>
        <h3 slot="header">Record {fragmentID}</h3>
        <Code input={JSON.stringify(logs.getID(fragmentID), null, 2)} />
    </Aside>
</Await>
