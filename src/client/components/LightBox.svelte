<script lang="ts" context="module">
    import { fragment } from "svelte-pathfinder";
    import Dialog from "$client/components/Dialog.svelte";
    import Icon from "$client/components/Icon.svelte";
    import { records } from "$client/stores/data.js";
    import { files } from "$client/stores/files.js";

    type Image = File & {
        collection: string;
        name: string;
        record: string;
        field: string;
    };
</script>

<script lang="ts">
    export let file: Image;

    function createURL(file: Image) {
        const { collection, name } = file;
        return `/api/v1/files/${collection}/${name}`;
        // return file instanceof File
        //     ? URL.createObjectURL(file)
        //     : `/api/v1/files/${collection}/${name}`;
    }

    async function deleteFile() {
        const { collection, name } = file;
        await records.deleteFiles(collection, [name]);
        await files.delete(collection, name);
    }
</script>

<a
    role="button"
    class="outline box"
    href="#file-{encodeURI(file.name)}"
    style="background-image: url({createURL(file)})"
    draggable="false"
    title={file.name}
>
    {file.name}
</a>

<Dialog
    on:close={() => fragment.set("")}
    on:submit={deleteFile}
    open={$fragment === `#file-${file.name}`}
    from="center"
    img
>
    <figure>
        <img src={createURL(file)} alt={file.name} />
    </figure>
    <nav class="cols col-fit align-center nowrap" slot="footer">
        <span class="scroll-x">{file.name}</span>
        <button type="submit" class="box text-error">
            <Icon icon="trash" />
        </button>
        <button type="reset" class="box">
            <Icon />
        </button>
    </nav>
</Dialog>

<style>
    a {
        color: transparent;
        background-size: cover;
        text-indent: -999px;
        height: 2.5em;
    }
    nav.cols {
        --cols-gap: 0;
    }
    .cols span {
        flex: auto;
        text-align: left;
        max-width: calc(100% - (var(--gap)));
    }
</style>
