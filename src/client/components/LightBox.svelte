<script lang="ts" context="module">
    import { fragment, paramable } from "svelte-pathfinder";
    import { files } from "$client/stores/files";
    import { records } from "$client/stores/data";
    import Icon from "$client/components/Icon.svelte";
    import Dialog from "$client/components/Dialog.svelte";

    type Image = File & {
        collection: string;
        name: string;
        record: string;
        field: string;
    };
</script>

<script lang="ts">
    export let file: Image;

    const route = paramable("/:folder/:collection");
    const [_, filename] = $fragment.split("#file-");

    $: console.log($route.collection, filename);

    function createURL(file: Image) {
        const { collection, name } = file;
        return `/api/files/${collection}/${name}`;
        // return file instanceof File
        //     ? URL.createObjectURL(file)
        //     : `/api/files/${collection}/${name}`;
    }

    async function deleteFile() {
        const { collection, name } = file;
        await records.deleteFiles(collection, [name]);
        await files.delete(collection, [name]);
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
        <button type="submit" class="box link text-error">
            <Icon icon="trash" />
        </button>
        <button type="reset" class="box link">
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
