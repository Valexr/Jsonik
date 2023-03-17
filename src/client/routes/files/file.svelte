<script lang="ts" context="module">
    import { fragment, path } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import Dialog from "$client/components/Dialog.svelte";
</script>

<script lang="ts">
    export let file: string;
    export let selected: string[] = [];

    async function editFile() {
        // await files.delete(`${$path[1] || ""}`, file);
    }
    async function deleteFile() {
        await files.delete(`${$path[1] || ""}`, file);
    }

    $: console.log(selected);
</script>

<!-- svelte-ignore a11y-missing-content -->
<a
    href="#file-{encodeURI(file)}"
    style="background-image: url('/api/v1/files/{`${$path[1] || ''}`}/{file}')"
/>
<label class="text-ellepsis">
    <slot>
        {file}
    </slot>
</label>
<!-- <span>
    <small class="text-ellepsis text-color">
        {file}&nbsp;
    </small> -->
<!-- <button id="delete" class="link box" on:click={editFile}>
        <i class="icon icon-svg icon-edit" />
    </button>
    <button id="delete" class="link box text-error" on:click={deleteFile}>
        <i class="icon icon-svg icon-trash" />
    </button> -->
<!-- </span> -->

<Dialog open={$fragment === `file-${file}`} from="center" size="lg">
    <h3 slot="header" class="scroll-x">
        /api/v1/files/{`${$path[1] || ""}`}/{file}
    </h3>
    <figure>
        <img src={`/api/v1/files/${$path[1] || ""}/${file}`} alt={file} />
    </figure>
    <nav slot="footer">
        <button id="delete" class="link" on:click={editFile}>
            <i class="icon icon-svg icon-edit" /> Rename
        </button>
        <button id="delete" class="text-error" on:click={deleteFile}>
            <i class="icon icon-svg icon-trash" /> Delete
        </button>
    </nav>
</Dialog>

<style>
    a {
        flex: auto;
        width: 100%;
        background-size: cover;
    }
    label {
        display: flex;
        align-items: center;
        justify-content: start;
        width: 100%;
        margin: 0 var(--gap-sm);
        max-width: calc(var(--col-width) - var(--gap-sm));
    }
</style>
