<script lang="ts" context="module">
    import { path } from "svelte-pathfinder";
    import { collections } from "$client/stores/data";
    import { scrollIntoView } from "$client/utils/actions";
    import Await from "$client/components/Await.svelte";
    import Icon from "$client/components/Icon.svelte";
    import File from "./nav/file.svelte";
</script>

<Await promise={collections.get()}>
    <nav
        class="cols col-fit nowrap justify-start scroll-x"
        use:scrollIntoView={$path[0]}
    >
        {#if $collections.length}
            <a
                href="/data"
                role="button"
                draggable="false"
                class="pos-sticky box"
                aria-disabled={!$path[1]}
            >
                <Icon icon="plus-square" size={20} />
            </a>
        {/if}
        {#each $collections as collection}
            <File {collection} />
        {/each}
    </nav>
</Await>

<style>
    a[href="/data"] {
        left: 0;
        z-index: 1;
    }
</style>
