<script lang="ts" context="module">
    import { fragment, path, goto, redirect } from "svelte-pathfinder";
    import { folders } from "$client/stores/files.js";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Search from "$client/components/Search.svelte";
</script>

<script lang="ts">
    async function addFolder(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const folder = data.get("folder");
        await folders.add(String(folder));
        goto(`/files/${folder}`);
    }

    async function deleteFolder(folder: string) {
        await folders.delete(folder);
        redirect("/files");
    }
</script>

<Await promise={folders.get()} notify>
    <nav class="text-center cols nowrap col-fit justify-start scroll-x">
        <a href="#add-folder" role="button" class="box link">
            <i class="icon icon-svg icon-125x icon-folder-plus" />
        </a>
        <a href="/files" role="button" class:disabled={!$path[1]}>/</a>
        {#if !$path[1]}
            <Search collapsed />
        {/if}
        {#each $folders as folder}
            <a
                href="/files/{folder}"
                role="button"
                class:chip={$path[1] === folder}
                class:disabled={$path[1] === folder}
            >
                {folder}
                {#if $path[1] === folder}
                    <button
                        class="box link text-error"
                        on:click={() => deleteFolder(folder)}
                    >
                        <i class="icon icon-svg icon-trash" />
                    </button>
                {/if}
            </a>
            {#if $path[1] === folder}
                <Search collapsed />
            {/if}
        {/each}
    </nav>
</Await>

<Dialog open={$fragment === `add-folder`} on:submit={addFolder}>
    <h2 slot="header">Add folder</h2>
    <fieldset>
        <label>
            <input placeholder="Folder name" name="folder" />
        </label>
    </fieldset>
</Dialog>

<style>
    nav {
        margin: var(--gap-lg) 0;
    }
    nav .chip {
        padding-right: 0;
    }
</style>
