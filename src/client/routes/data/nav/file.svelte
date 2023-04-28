<script lang="ts" context="module">
    import { path, redirect } from "svelte-pathfinder";
    import { collections, schemas, records } from "$client/stores/data";
    import { folders } from "$client/stores/files";
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let collection: string;

    async function deleteCollection() {
        await folders.delete(collection);
        await collections.delete(collection);
        redirect(`/data/${$collections.at(-1) || ""}`);
    }
</script>

<a
    href="/data/{collection}"
    role="button"
    draggable="false"
    aria-disabled={$path[1] === collection}
>
    {#if $path[1] === collection}
        <a
            href="#edit-collection"
            draggable="false"
            role="button"
            id={collection}
            class="box link"
        >
            <Icon icon="edit" />
        </a>
    {/if}
    <span>{collection}</span>
    {#if $path[1] === collection}
        <button
            id={collection}
            class="box link text-error"
            on:click={deleteCollection}
        >
            <Icon icon="trash" />
        </button>
    {/if}
</a>
