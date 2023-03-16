<script lang="ts" context="module">
    import { paramable } from "svelte-pathfinder";
    import DataNav from "$client/routes/data/nav.svelte";
    import FilesNav from "$client/routes/files/nav.svelte";
    import LogsNav from "$client/routes/logs/nav.svelte";
</script>

<script lang="ts">
    const route = paramable<{ path: string }>("/:path/:folder?");
</script>

<main class="container" class:grid={!$route.path}>
    {#if $route.path === "data"}
        <DataNav />
    {:else if $route.path === "files"}
        <FilesNav />
    {:else if $route.path === "logs"}
        <LogsNav />
    {/if}
    <slot />
</main>

<style>
    .container {
        --viewport: 100%;
    }
    .grid {
        --viewport: 25rem;
        place-content: center;
    }
</style>
