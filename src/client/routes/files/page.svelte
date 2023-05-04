<script lang="ts" context="module">
    import { redirect, fragment, paramable } from "svelte-pathfinder";
    import { files } from "$client/stores/files";
    import { collections, records } from "$client/stores/data";
    import { selection } from "$client/utils/selection";
    import { s } from "$client/utils/index";
    import Await from "$client/components/Await.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Toast from "$client/components/Toaster/Toast.svelte";
    // import File from "./file.svelte";
    import Upload from "./upload.svelte";
</script>

<script lang="ts">
    let selected: string[] = [];

    const route = paramable<{ folder: string }>("/files/:folder?");
    const promise = files.get($route.folder);

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

    function createURL(filename: string) {
        return `url('/api/files/${$route.folder || ""}/${filename}')`;
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
    <Await {promise} on:error={() => redirect("/files")} notify>
        <ul role="listbox" class="grid">
            <li><Upload /></li>
            {#each $files?.sort( (a, b) => a.localeCompare(b) ) as filename (filename)}
                <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
                <li role="button" class="box" id={filename}>
                    <a
                        draggable="false"
                        href="#file-{encodeURI(filename)}"
                        style="background-image: {createURL(filename)}"
                    >
                        {filename}
                    </a>
                    <label>
                        <input
                            type="checkbox"
                            value={filename}
                            bind:group={selected}
                        />&nbsp
                        <small class="text-ellepsis">
                            {filename}
                        </small>
                    </label>
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
    ul[role="listbox"] li a {
        flex: auto;
        width: 100%;
        color: transparent;
        background-size: cover;
    }
    ul[role="listbox"] li label {
        display: flex;
        align-items: center;
        justify-content: start;
        flex-wrap: nowrap;
        width: 100%;
        margin: 0;
        padding: 0 var(--gap-sm);
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
