<script lang="ts" context="module">
    import { files } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Icon from "$client/components/Icon.svelte";
    import File from "./nav/file.svelte";
    import { paramable } from "svelte-pathfinder";
</script>

<script lang="ts">
    // String.raw`^[\w,\-]+`
    const route = paramable("/data/:file?");
</script>

<Await promise={files.get()}>
    <nav
        class="text-center cols col-fit nowrap scroll-x"
        class:justify-start={$files.length}
        class:justify-center={!$files.length}
    >
        {#if $files.length}
            <a
                href="/data"
                role="button"
                draggable="false"
                class="pos-sticky"
                aria-disabled={!$route.file}
                class:box={$files.length}
            >
                <Icon icon="plus-square" size="125x" />
                {#if !$files.length}Add collection{/if}
            </a>
        {/if}
        {#each $files as file}
            <File {file} />
        {/each}
    </nav>
</Await>

<style>
    nav {
        margin: var(--gap-lg) 0;
    }
    a[href="/data"] {
        left: 0;
        z-index: 1;
    }
</style>
