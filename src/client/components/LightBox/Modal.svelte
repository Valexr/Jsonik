<script lang="ts" context="module">
    import { fragment, paramable } from "svelte-pathfinder";
    import { records } from "$client/stores/data";
    import { files } from "$client/stores/files";
    import Dialog from "$client/components/Dialog.svelte";
    import Icon from "$client/components/Icon.svelte";

    type Route = { folder: string; collection: string };
</script>

<script lang="ts">
    const route = paramable<Route>("/:folder/:collection");

    $: [_, filename] = $fragment.split("#file-");

    function createURL(filename: string) {
        if (filename) {
            return `/api/files/${$route.collection || ""}/${filename}`;
        }
    }

    async function deleteFile() {
        await records.deleteFiles($route.collection, [filename]);
        await files.delete($route.collection, [filename]);
    }

    function close() {
        fragment.set("");
    }
</script>

<Dialog
    on:close={close}
    on:submit={deleteFile}
    open={$fragment === `#file-${filename}`}
    from="center"
    img
>
    <figure>
        <img src={createURL(filename)} alt={filename} />
    </figure>
    <nav class="cols col-fit align-center nowrap" slot="footer">
        <span class="scroll-x">{filename}</span>
        <button type="submit" class="box link text-error">
            <Icon icon="trash" />
        </button>
        <button type="reset" class="box link" on:click|stopPropagation>
            <Icon />
        </button>
    </nav>
</Dialog>

<style>
    nav.cols {
        --cols-gap: 0;
    }
    .cols span {
        flex: auto;
        text-align: left;
        max-width: calc(100% - (var(--gap)));
    }
</style>
