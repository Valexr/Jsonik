<script lang="ts" context="module">
    import { path, fragment } from "svelte-pathfinder";
    import { files } from "$client/stores/files";
    import { s } from "$client/utils/index";
    import Form from "$client/components/Form.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Table from "$client/components/Table.svelte";
    import Icon from "$client/components/Icon.svelte";
    import type { InputEvent } from "$types/client";
</script>

<script lang="ts">
    let fileList: FileList | null;

    const accept =
        ".svg, .jpg, .jpeg, .png, .gif, .doc, .docx, .pdf, .txt, .md";

    function addFiles(e: InputEvent) {
        fileList = e.currentTarget.files;
        $fragment = "#upload-files";
        // setTimeout(() => (e.currentTarget.value = ""));
    }

    // const es = new EventSource("/stream");
    // es.addEventListener("progress", (e) => {
    //     console.log(e.data);
    //     es.close();
    // });

    async function uploadFiles(e: SubmitEvent) {
        const promises = Array.from(fileList || [], (file) =>
            files.add(`${$path[1] || ""}`, file)
        );
        await Promise.all(promises);
        clearFiles();
    }

    function clearFiles() {
        fileList = null;
    }

    function drop(node: HTMLLabelElement) {
        const { classList } = node;
        node.ondragover = (e) => classList.remove("link");
        node.ondragleave = (e) => classList.add("link");
        node.ondragend = (e) => classList.add("link");
        node.ondrop = (e) => classList.add("link");
    }
</script>

<Form method="POST" center>
    <fieldset>
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <label
            role="button"
            class:box={$files?.length}
            class="block outline link dashed"
            use:drop
        >
            <Icon icon="file-plus" size={54} />
            <input
                type="file"
                name="files"
                multiple
                {accept}
                on:change={addFiles}
                class:box={$files?.length}
            />
        </label>
    </fieldset>
</Form>

<Dialog
    open={$fragment === "#upload-files" && Number(fileList?.length) > 0}
    on:submit={uploadFiles}
    on:reset={clearFiles}
>
    <h3 slot="header" class="scroll-x">
        Upload {fileList?.length} file{s(fileList?.length)}
    </h3>
    {#if fileList}
        {@const tbody = Array.from(fileList, ({ name, size, type }, i) => ({
            id: i + 1,
            name: encodeURI(name),
            size,
            type,
        }))}
        {@const thead = [
            { name: "id" },
            { name: "name" },
            { name: "size" },
            { name: "type" },
        ]}
        <Table
            selectable={false}
            timeable={false}
            current={console.log}
            data={{ thead, tbody }}
        />
    {/if}
</Dialog>

<style>
    fieldset {
        min-inline-size: fit-content;
    }
    fieldset label {
        margin: 0;
    }
    [role="button"] {
        mask-size: 50%;
    }
    [type="file"] {
        position: absolute;
        opacity: 0;
        inset: 0;
    }
</style>
