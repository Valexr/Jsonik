<script lang="ts" context="module">
    import { fragment, path } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import Dialog from "$client/components/Dialog.svelte";
</script>

<script lang="ts">
    export let file: string;

    async function deleteFile() {
        await files.delete(`${$path[1] || ""}`, file);
    }
</script>

<!-- svelte-ignore a11y-missing-content -->
<a
    href="#file-{file}"
    style="background-image: url('/api/v1/files/{`${$path[1] || ''}`}/{file}')"
/>
<span>
    <small class="text-ellepsis text-color">
        {file}&nbsp;
    </small>

    <button id="delete" class="link box text-error" on:click={deleteFile}>
        <i class="icon icon-svg icon-trash" />
    </button>
</span>

<Dialog open={$fragment === `file-${file}`} from="center" size="md" info>
    <h3 slot="header" class="scroll-x">
        /api/v1/files/{`${$path[1] || ""}`}/{file}
    </h3>
    <figure>
        <img src="/api/v1/files/{`${$path[1] || ''}`}/{file}" alt={file} />
    </figure>
</Dialog>

<style>
    a {
        flex: auto;
        width: 100%;
        background-size: cover;
    }
    span {
        display: flex;
        align-items: center;
        justify-content: end;
        width: 100%;
        max-width: calc(var(--col-width) + var(--gap-lg));
    }
</style>
