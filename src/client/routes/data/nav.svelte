<script lang="ts" context="module">
    import { collections } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Collection from "./collection.svelte";
</script>

<script lang="ts">
    // String.raw`^[\w,\-]+`
</script>

<Await promise={collections.get()}>
    <nav
        class="text-center cols col-fit nowrap scroll-x"
        class:justify-start={$collections.length}
        class:justify-center={!$collections.length}
    >
        <a
            href="#add-collection"
            role="button"
            draggable="false"
            class="pos-sticky outline"
            class:box={$collections.length}
        >
            <i class="icon icon-svg icon-125x icon-plus-square" />
            {#if !$collections.length}Add collection{/if}
        </a>
        {#each $collections as collection}
            <Collection {collection} />
        {/each}
    </nav>
</Await>

<style>
    nav {
        margin: var(--gap-lg) 0;
    }
    [href="#add-collection"] {
        left: 0;
        z-index: 1;
        background-color: var(--back);
    }
</style>
