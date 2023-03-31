<script lang="ts" context="module">
    import { files } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Icon from "$client/components/Icon.svelte";
    import File from "./file.svelte";
</script>

<script lang="ts">
    // String.raw`^[\w,\-]+`
</script>

<Await promise={files.get()}>
    <nav
        class="text-center cols col-fit nowrap scroll-x"
        class:justify-start={$files.length}
        class:justify-center={!$files.length}
    >
        <a
            href="#add-collection"
            role="button"
            draggable="false"
            class="pos-sticky outline"
            class:box={$files.length}
        >
            <Icon icon="plus-square" size="125x" />
            {#if !$files.length}Add collection{/if}
        </a>
        {#each $files as file}
            <File {file} />
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
