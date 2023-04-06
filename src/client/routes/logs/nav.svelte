<script lang="ts" context="module">
    import { query } from "svelte-pathfinder";
    import Search from "$client/components/Search.svelte";
    import Paginator from "$client/components/Paginator.svelte";
</script>

<nav>
    <Paginator total={100} limit={5} active={1} spread={3} />
</nav>

<style>
    nav {
        margin: var(--gap-lg) 0;
    }
</style>
