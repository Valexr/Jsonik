<script lang="ts" context="module">
    import { path, fragment } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import Form from "$client/components/Form.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import type { InputEvent } from "$types/client.js";
</script>

<script lang="ts">
    let fileList: FileList | null;

    const accept =
        ".svg, .jpg, .jpeg, .png, .gif, .doc, .docx, .pdf, .txt, .md";

    function addFiles(e: InputEvent) {
        fileList = e.currentTarget.files;
        $fragment = "upload-files";
    }

    async function uploadFiles(e: SubmitEvent) {
        const promises = Array.from(fileList || [])?.map((file) => {
            return files.add(`${$path[1] || ""}`, file);
        });
        await Promise.all(promises);
        clearFiles();
    }

    function clearFiles() {
        fileList = "" as unknown as FileList;
    }

    function drag(node: HTMLLabelElement) {
        const { classList } = node;
        node.ondragover = (e) => classList.remove("link");
        node.ondragleave = (e) => classList.add("link");
        // node.ondragend = (e) => classList.add("link");
        node.ondrop = (e) => classList.add("link");
    }
</script>

<Form>
    <fieldset>
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <label
            role="button"
            class:box={$files?.length}
            class="block outline link dashed"
            use:drag
        >
            <i class="icon icon-svg icon-file-plus icon-3x" />
            <input
                type="file"
                name="files"
                multiple
                {accept}
                class:box={$files?.length}
                on:change={addFiles}
            />
        </label>
    </fieldset>
</Form>

<Dialog
    open={$fragment === "upload-files" && fileList}
    on:submit={uploadFiles}
    on:reset={clearFiles}
>
    <h3 slot="header" class="scroll-x">
        Upload {fileList?.length} files
    </h3>
    {#if fileList}
        <ol>
            {#each fileList as file}
                <li>
                    {file.name}
                    {(file.size / 1000).toFixed(0)} Kb
                </li>
            {/each}
        </ol>
    {/if}
</Dialog>

<style>
    fieldset {
        min-inline-size: fit-content;
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
