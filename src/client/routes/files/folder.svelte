<script lang="ts" context="module">
    import { fragment, path, redirect } from "svelte-pathfinder";
    import { folders } from "$client/stores/files.js";
    import Input from "./input.svelte";
</script>

<script lang="ts">
    export let folder: string;

    async function renameFolder(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const name = data.get("value");
        await folders.rename(String($path[1]), String(name));
        redirect(`/files/${name}`);
    }

    async function deleteFolder(folder: string) {
        await folders.delete(folder);
        redirect("/files");
    }

    function edit() {
        fragment.set(`#rename-${$path[1]}`);
    }
</script>

{#if $fragment === `#rename-${folder}`}
    <Input on:submit={renameFolder} value={folder} />
{:else}
    <a
        id={folder}
        tabindex="0"
        href="/files/{folder}"
        role="button"
        class:chip={$path[1] === folder}
        aria-disabled={$path[1] === folder}
        draggable="false"
    >
        {#if $path[1] === folder}
            <button class="box link" on:click|preventDefault={edit}>
                <i class="icon icon-svg icon-edit" />
            </button>
        {/if}
        <span>{folder}</span>
        {#if $path[1] === folder}
            <button
                class="box link text-error"
                on:click={() => deleteFolder(folder)}
            >
                <i class="icon icon-svg icon-trash" />
            </button>
        {/if}
    </a>
{/if}

<style>
    [role="button"].chip {
        padding: 0;
    }
</style>
