<script lang="ts" context="module">
    import { collections } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Icon from "$client/components/Icon.svelte";
    import File from "./nav/file.svelte";
    import { path, paramable } from "svelte-pathfinder";
    import { scrollIntoView } from "$client/utils/actions.js";
</script>

<script lang="ts">
    // String.raw`^[\w,\-]+`
    const route = paramable("/data/:file?");
</script>

<Await promise={collections.get()}>
    <nav
        class="text-center cols col-fit nowrap scroll-x"
        class:justify-start={$collections.length}
        class:justify-center={!$collections.length}
        use:scrollIntoView={$path[0]}
    >
        {#if $collections.length}
            <a
                href="/data"
                role="button"
                draggable="false"
                class="pos-sticky box"
                aria-disabled={!$route.file}
            >
                <Icon icon="plus-square" size="125x" />
            </a>
        {/if}
        {#each $collections as file}
            <File {file} />
        {/each}
    </nav>
</Await>

<style>
    a[href="/data"] {
        left: 0;
        z-index: 1;
    }
</style>
