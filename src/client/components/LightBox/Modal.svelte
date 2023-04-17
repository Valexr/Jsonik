<script lang="ts" context="module">
    import { fragment } from "svelte-pathfinder";
    import { records } from "$client/stores/data.js";
    import { files } from "$client/stores/files.js";
    import Dialog from "$client/components/Dialog.svelte";
    import Icon from "$client/components/Icon.svelte";

    type Image = File & {
        collection: string;
        name: string;
        record: string;
        field: string;
    };
</script>

<script lang="ts">
    // export let collection: string;
    // export let filename: Image;

    $: [collection, ...filename] = $fragment.replace("#", "").split("-");
    $: console.log(collection, filename);
    async function deleteFile() {
        await records.deleteFiles(collection, [filename.join("-")]);
        await files.delete(collection, [filename.join("-")]);
    }

    function close() {
        fragment.set("");
    }
</script>

<Dialog
    on:close={close}
    on:submit={deleteFile}
    open={$fragment === `#${collection}-${filename.join("-")}`}
    from="center"
    img
>
    <figure>
        <img
            src="/api/v1/files/{collection}/{filename.join('-')}"
            alt={filename.join("-")}
        />
    </figure>
    <nav class="cols col-fit align-center nowrap" slot="footer">
        <span class="scroll-x">{filename.join("-")}</span>
        <button type="submit" class="box text-error">
            <Icon icon="trash" />
        </button>
        <button type="reset" class="box">
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
