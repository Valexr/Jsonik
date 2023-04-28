<script lang="ts" context="module">
    import {
        path,
        redirect,
        query,
        fragment,
        paramable,
    } from "svelte-pathfinder";
    import { files } from "$client/stores/files";
    import { collections, records } from "$client/stores/data";
    import { selection } from "$client/utils/selection";
    import { s } from "$client/utils/index";
    import Await from "$client/components/Await.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Toast from "$client/components/Toaster/Toast.svelte";
    import File from "./file.svelte";
    import Upload from "./upload.svelte";
</script>

<script lang="ts">
    let selected: string[] = [];

    const route = paramable<{ folder: string }>("/files/:folder?");

    async function deleteFiles() {
        if ($collections.includes($route.folder)) {
            await records.deleteFiles($route.folder, selected);
        }
        await files.delete($route.folder, selected);
        selected = [];
    }
    function match(els: Element[]) {
        selected = Array.from(els, ({ id }) => id);
    }
</script>

{#if selected.length}
    <Toast
        draggable
        type="pos-sticky"
        on:close={() => (selected.length = 0)}
        on:dragstart={(e) => e.dataTransfer?.setData("files", String(selected))}
        on:dragend={(e) => (selected.length = 0)}
    >
        <Icon icon="move" />
        <span><b>{selected.length}</b> file{s(selected.length)} selected</span>
        <button class="box link text-error" on:click={deleteFiles}>
            <Icon icon="trash" />
        </button>
    </Toast>
{/if}

<section
    use:selection={{
        target: "li[role=button]",
        disabled: $fragment,
        match,
    }}
>
    <Await
        promise={files.get($route.folder)}
        on:error={() => redirect("/files")}
        notify
    >
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <ul role="listbox" class="grid">
            <li><Upload /></li>
            {#each $files?.sort((a, b) => a.localeCompare(b)) as file (file)}
                <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
                <li role="button" class="box" id={file}>
                    <File {file}>
                        <input
                            type="checkbox"
                            value={file}
                            bind:group={selected}
                        />&nbsp
                        <small class="text-ellepsis">
                            {file}
                        </small>
                    </File>
                </li>
            {/each}
        </ul>
    </Await>
</section>

<style>
    ul[role="listbox"] {
        --cols-gap: var(--gap-sm);
        --col-width: 9.5em;
        position: relative;
        padding: 0;
    }
    ul[role="listbox"] li {
        position: relative;
        flex-flow: column nowrap;
        align-items: start;
        justify-content: space-between;
        padding: 0;
        gap: 0;
    }
    [type="checkbox"] {
        flex: 0 0 auto;
    }
    small {
        max-width: calc(var(--col-width) - var(--gap));
        max-width: 13.5ch;
        flex: 0 auto;
    }
</style>
