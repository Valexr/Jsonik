<script lang="ts" context="module">
    import { path } from "svelte-pathfinder";
    import Search from "$client/components/Search.svelte";
    import Details from "$client/components/Details.svelte";
</script>

<footer class="pos-sticky container cols col-fit justify-center">
    <!-- <Details top summary="" /> -->
    {#if $path[0]}
        <a
            href="#add-record"
            role="button"
            data-tooltip="Add record"
            class="box"
        >
            <i class="icon icon-svg icon-plus" />
        </a>
        <Search />
        <button class="box"><i class="icon icon-svg icon-code" /></button>
    {:else}
        <p class="text-center">© {new Date().getFullYear()} Jsonik</p>
    {/if}
</footer>

<style>
    footer {
        /* --viewport: 30em; */
        --cols-gap: var(--gap-sm);
        bottom: 0;
        padding: var(--gap-sm) 0;
    }
</style>
