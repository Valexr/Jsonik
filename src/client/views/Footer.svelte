<script lang="ts" context="module">
    import { path } from "svelte-pathfinder";
    import Search from "$client/components/Search.svelte";
    import Details from "$client/components/Details.svelte";
</script>

<footer class="pos-sticky container">
    <!-- <Details top summary="" /> -->
    {#if $path[0]}
        <Search />
    {:else}
        <p class="text-center">© {new Date().getFullYear()} Jsonik</p>
    {/if}
</footer>

<style>
    footer {
        --viewport: 30em;
        bottom: 0;
        padding: var(--gap-sm) 0;
    }
</style>
