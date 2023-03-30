<script lang="ts" context="module">
    import { path, redirect } from "svelte-pathfinder";
    import { files } from "$client/stores/data.js";
</script>

<script lang="ts">
    export let file: string;

    async function deleteFile() {
        await files.delete(file);
        redirect(`/data/${$files.at(-1) || ""}`);
    }
</script>

<a
    href="/data/{file}"
    role="button"
    draggable="false"
    aria-disabled={$path[1] === file}
>
    {#if $path[1] === file}
        <a
            href="#edit-collection"
            draggable="false"
            role="button"
            id={file}
            class="box link"
        >
            <i class="icon icon-svg icon-edit" />
        </a>
    {/if}
    <span>{file}</span>
    {#if $path[1] === file}
        <button id={file} class="box link text-error" on:click={deleteFile}>
            <i class="icon icon-svg icon-trash" />
        </button>
    {/if}
</a>

<style>
    [role="button"][aria-disabled="true"] {
        padding: 0;
    }
</style>
