<script lang="ts" context="module">
    import { path, fragment } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import { s } from "$client/utils/index.js";
    import Form from "$client/components/Form.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Table from "$client/components/Table.svelte";
    import Icon from "$client/components/Icon.svelte";
    import type { InputEvent } from "$types/client.js";
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

    async function uploadFiles(e: SubmitEvent) {
        const promises = Array.from(fileList || [])?.map((file) => {
            return files.add(`${$path[1] || ""}`, file);
        });
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
            <Icon icon="file-plus" size="3x" />
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
        {@const tbody = Array.from(fileList).map(({ name, size, type }, i) => ({
            id: i + 1,
            name,
            size,
            type,
        }))}
        {@const thead = ["id", "name", "size", "type"]}
        <Table
            selectable={0}
            timeable={0}
            current={console.log}
            data={{ thead, tbody }}
        />
        <!-- <ol>
            {#each fileList as file}
                <li>
                    {file.name}
                    <b>{(file.size / 1000).toFixed(0)}</b>Kb
                </li>
            {/each}
        </ol> -->
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
