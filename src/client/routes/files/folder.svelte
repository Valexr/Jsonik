<script lang="ts" context="module">
    import { fragment, path, redirect } from "svelte-pathfinder";
    import { folders, files } from "$client/stores/files";
    import { collections, records } from "$client/stores/data";
    import Icon from "$client/components/Icon.svelte";
    import Input from "./input.svelte";
</script>

<script lang="ts">
    export let folder: string;

    async function renameFolder(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const name = data.get("value");
        await folders.rename(String(folder), String(name));
        redirect(`/files/${name}`);
    }

    async function deleteFolder(folder: string) {
        if ($collections.includes(folder)) {
            await records.deleteFiles(folder, $files);
        }
        await folders.delete(folder);
        redirect("/files");
    }

    function editFolder() {
        fragment.set(`#rename-${folder}`);
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
        aria-disabled={$path[1] === folder}
        draggable="false"
    >
        {#if $path[1] === folder}
            <button class="box link" on:click|preventDefault={editFolder}>
                <Icon icon="edit" />
            </button>
        {/if}
        <span>{folder}</span>
        {#if $path[1] === folder}
            <button
                class="box link text-error"
                on:click={() => deleteFolder(folder)}
            >
                <Icon icon="trash" />
            </button>
        {/if}
    </a>
{/if}
