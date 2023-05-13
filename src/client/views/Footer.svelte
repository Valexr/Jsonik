<script lang="ts" context="module">
    import { path } from "svelte-pathfinder";
    import Search from "$client/components/Search.svelte";
</script>

<footer class="pos-sticky container cols">
    {#if $path[0]}
        <Search />
    {:else}
        <p class="text-center">© {new Date().getFullYear()} Jsonik</p>
    {/if}
</footer>

<style>
    footer {
        --viewport: 25em;
        --cols-gap: var(--gap-sm);
        bottom: 0;
        padding: var(--gap-sm) 0;
    }
</style>
