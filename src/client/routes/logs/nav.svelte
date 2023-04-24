<script lang="ts" context="module">
    import { query } from "svelte-pathfinder";
    import { logs } from "$client/stores/logs.js";
    import Await from "$client/components/Await.svelte";
    import Paginator from "$client/components/Paginator.svelte";
</script>

<script lang="ts">
    query.set({
        limit: 100,
        page: 1,
    });
</script>

<Await promise={logs.getTotal()} let:result>
    <Paginator
        total={result.length}
        bind:limit={$query.limit}
        bind:active={$query.page}
        spread={3}
    />
</Await>
