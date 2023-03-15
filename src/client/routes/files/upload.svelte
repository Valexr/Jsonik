<script lang="ts" context="module">
    import { path } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import Form from "$client/components/Form.svelte";
    import type { InputEvent } from "$types/client.js";
</script>

<script lang="ts">
    let fileList: FileList | null;

    const accept =
        ".svg, .jpg, .jpeg, .png, .gif, .doc, .docx, .pdf, .txt, .md";

    function addFiles(e: InputEvent) {
        fileList = e.currentTarget.files;
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
</script>

<Form
    method="POST"
    enctype="multipart/form-data"
    on:reset={clearFiles}
    on:submit={uploadFiles}
>
    <fieldset>
        {#if fileList}
            <h3>Selected</h3>
            <ol>
                {#each fileList as file}
                    <li>
                        {file.name}
                        {(file.size / 1000).toFixed(0)} Kb
                    </li>
                {/each}
            </ol>
            <label>
                <button class="link" type="reset"> Cancel </button>
                <button class="success" type="submit"> Upload </button>
            </label>
        {:else}
            <label
                role="button"
                class:box={$files?.length}
                class="block link outline dashed"
            >
                <i class="icon icon-svg icon-file-plus icon-3x" />
                <input
                    type="file"
                    class="hidden"
                    name="files"
                    multiple
                    {accept}
                    on:change={addFiles}
                />
            </label>
        {/if}
    </fieldset>
</Form>
