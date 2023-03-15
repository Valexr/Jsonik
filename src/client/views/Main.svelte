<script lang="ts" context="module">
    import { paramable } from "svelte-pathfinder";
    import FilesNav from "$client/routes/files/nav.svelte";
    import LogsNav from "$client/routes/logs/nav.svelte";
</script>

<script lang="ts">
    const route = paramable<{ path: string }>("/:path/:folder?");
</script>

<main class="container">
    {#if $route.path === "files"}
        <FilesNav />
    {:else if $route.path === "logs"}
        <LogsNav />
    {/if}
    <slot />
</main>
