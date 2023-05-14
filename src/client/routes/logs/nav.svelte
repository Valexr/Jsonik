<script lang="ts" context="module">
    import { query } from "svelte-pathfinder";
    import { logs } from "$client/stores/logs";
    import Paginator from "$client/components/Paginator.svelte";
</script>

<script lang="ts">
    query.set({ limit: 100, page: 1 });
</script>

<Paginator
    total={$logs.total}
    bind:limit={$query.limit}
    bind:active={$query.page}
    spread={3}
/>
