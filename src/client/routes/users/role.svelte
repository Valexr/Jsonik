<script lang="ts" context="module">
    import { fragment, path, redirect } from "svelte-pathfinder";
    import { folders, files } from "$client/stores/files";
    import { collections, records } from "$client/stores/data";
    import Icon from "$client/components/Icon.svelte";
    import Input from "./input.svelte";
</script>

<script lang="ts">
    export let role: string;

    async function renameFolder(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const name = data.get("value");
        await folders.rename(String(role), String(name));
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
        fragment.set(`#rename-${role}`);
    }
</script>

{#if $fragment === `#rename-${role}`}
    <Input on:submit={renameFolder} value={role} />
{:else}
    <a
        id={role}
        tabindex="0"
        href="/users/{role}"
        role="button"
        aria-disabled={$path[1] === role}
        draggable="false"
    >
        {#if $path[1] === role}
            <button class="box link" on:click|preventDefault={editFolder}>
                <Icon icon="edit" />
            </button>
        {/if}
        <span>{role}</span>
        {#if $path[1] === role}
            <button
                class="box link text-error"
                on:click={() => deleteFolder(role)}
            >
                <Icon icon="trash" />
            </button>
        {/if}
    </a>
{/if}
