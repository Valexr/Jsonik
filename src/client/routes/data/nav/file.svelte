<script lang="ts" context="module">
    import { path, redirect } from "svelte-pathfinder";
    import { files } from "$client/stores/data.js";
    import Icon from "$client/components/Icon.svelte";
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
            <Icon icon="edit" />
        </a>
    {/if}
    <span>{file}</span>
    {#if $path[1] === file}
        <button id={file} class="box link text-error" on:click={deleteFile}>
            <Icon icon="trash" />
        </button>
    {/if}
</a>

<style>
    [role="button"][aria-disabled="true"] {
        padding: 0;
    }
</style>
