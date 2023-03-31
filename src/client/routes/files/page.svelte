<script lang="ts" context="module">
    import { path, redirect, query, fragment } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import { selectable } from "$client/utils/actions.js";
    import { s } from "$client/utils/index.js";
    import { selection } from "$client/utils/selection.js";
    import Await from "$client/components/Await.svelte";
    import File from "./file.svelte";
    import Upload from "./upload.svelte";
    import Toast from "$client/components/Toaster/Toast.svelte";
</script>

<script lang="ts">
    let selected: string[] = [];

    async function deleteFiles() {
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
        <i class="icon icon-svg icon-move" />
        <span><b>{selected.length}</b> file{s(selected.length)} selected</span>
        <button class="box link text-error" on:click={deleteFiles}>
            <i class="icon icon-svg icon-trash" />
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
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <ul role="listbox" class="grid">
            <li>
                <Upload />
            </li>
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
        max-width: 14.5ch;
        /* max-width: 8.25vw; */
        flex: 0 auto;
    }
</style>
