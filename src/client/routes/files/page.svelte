<script lang="ts" context="module">
    import { path, redirect, query, fragment } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import { selection } from "$client/utils/selection.js";
    import { s } from "$client/utils/index.js";
    import Await from "$client/components/Await.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Toast from "$client/components/Toaster/Toast.svelte";
    import File from "./file.svelte";
    import Upload from "./upload.svelte";
    import { collections, records } from "$client/stores/data.js";
</script>

<script lang="ts">
    let selected: string[] = [];

    async function deleteFiles() {
        if ($collections.includes($path[1])) {
            await records.deleteFiles(`${$path[1] || ""}`, selected);
        }
        const promises = selected.map((file) => {
            return files.delete(`${$path[1] || ""}`, file);
        });
        await Promise.all(promises);
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
        promise={files.get(String($path[1] || ""))}
        on:error={() => redirect("/files")}
        notify
    >
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
    :global(.toast.pos-sticky) {
        top: calc(var(--gap-lg) * 2.75);
        padding: 0 var(--gap);
        margin: auto;
        z-index: 1;
    }
    small {
        max-width: calc(var(--col-width) - var(--gap));
        max-width: 13.5ch;
        /* max-width: 8.25vw; */
        flex: 0 auto;
    }
</style>
