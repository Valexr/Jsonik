<script lang="ts" context="module">
    import { fragment, path, goto, redirect } from "svelte-pathfinder";
    import { folders, files } from "$client/stores/files.js";
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

    function drop(node: HTMLElement) {
        node.ondragover = (e) => {
            e.preventDefault();
            node.setAttribute("aria-disabled", "true");
        };
        node.ondragleave = (e) => node.removeAttribute("aria-disabled");
        node.ondrop = async (e) => {
            node.removeAttribute("aria-disabled");
            const fileList = e.dataTransfer?.getData("files").split(",");
            const from = `${$path[1] || ""}`;
            const to = e.target.id;
            const promises = fileList?.map((file) => {
                return files.move(from, file, to);
            });
            await Promise.all(promises);
        };
    }
</script>

<Await promise={folders.get()} notify>
    <nav class="text-center cols nowrap col-fit justify-start scroll-x">
        <a href="#add-folder" role="button" class="box link">
            <i class="icon icon-svg icon-125x icon-folder-plus" />
        </a>
        <a href="/files" role="button" aria-disabled={!$path[1]} use:drop>/</a>
        {#each $folders as folder}
            <a
                id={folder}
                href="/files/{folder}"
                role="button"
                class:chip={$path[1] === folder}
                aria-disabled={$path[1] === folder}
                use:drop
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
