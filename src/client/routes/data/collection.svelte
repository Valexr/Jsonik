<script lang="ts" context="module">
    import { path, fragment, redirect, submit } from "svelte-pathfinder";
    import { collections, schemas, data } from "$client/stores/data.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Collection from "./collection.svelte";
</script>

<script lang="ts">
    export let collection: string;

    async function editCollection() {
        fragment.set(`#edit-${collection}`);
    }
    async function deleteCollection(e: MouseEvent) {
        const { id } = e.currentTarget as HTMLButtonElement;
        await collections.delete(id);
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
        <button
            id={collection}
            class="box link"
            on:click|preventDefault={editCollection}
        >
            <i class="icon icon-svg icon-edit" />
        </button>
    {/if}
    <span>{collection}</span>
    {#if $path[1] === collection}
        <button
            id={collection}
            class="box link text-error"
            on:click={deleteCollection}
        >
            <i class="icon icon-svg icon-trash" />
        </button>
    {/if}
</a>

<style>
    [role="button"][aria-disabled="true"] {
        padding: 0;
    }
</style>
