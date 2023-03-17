<script lang="ts" context="module">
    import { path, redirect } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import Await from "$client/components/Await.svelte";
    import File from "./file.svelte";
    import Upload from "./upload.svelte";
    import Toast from "$client/components/Toaster/Toast.svelte";
</script>

<script lang="ts">
    let selected: string[] = [];
    $: console.log(selected);
</script>

<section>
    <Await
        promise={files.get($path[1])}
        on:error={() => redirect("/files")}
        success="loaded loaded loadedloaded loaded loadeds"
        notify
    >
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <ul role="listbox" class="grid">
            <li>
                <Upload />
            </li>
            {#each $files.sort((a, b) => a.localeCompare(b)) as file (file)}
                <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
                <li role="button" class="box">
                    <input type="checkbox" value={file} bind:group={selected} />
                    <File {file} />
                </li>
            {/each}
        </ul>
    </Await>
</section>

{#if selected.length}
    <Toast type="pos-sticky" on:close={() => (selected.length = 0)}>
        <span><b>{selected.length}</b> files selected</span>
        <button class="box link text-error">
            <i class="icon icon-svg icon-trash" />
        </button>
    </Toast>
{/if}

<style>
    ul[role="listbox"] {
        --cols-gap: var(--gap-sm);
        --col-width: 9.5em;
        padding: 0;
    }
    ul[role="listbox"] li {
        position: relative;
        flex-flow: column nowrap;
        align-items: end;
        justify-content: space-between;
        padding: 0;
    }
    [type="checkbox"] {
        position: absolute;
        top: var(--gap-sm);
        left: var(--gap-sm);
    }
    :global(.toast.pos-sticky) {
        bottom: var(--gap);
        z-index: 1;
    }
</style>
