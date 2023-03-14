<script lang="ts" context="module">
    import {
        fragment,
        path,
        paramable,
        back,
        goto,
        redirect,
    } from "svelte-pathfinder";
    import { del, get, patch, post } from "$client/api/methods";
    import Form from "$client/components/Form.svelte";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import type { InputEvent } from "$types/client";

    type Repo = { files: string[]; folders: string[]; folder: string };
</script>

<script lang="ts">
    let files: FileList | null;
    // let folders: string[] = [];
    let promise: Promise<void> = download();
    let repo: Repo = { files: [], folders: [], folder: "" };
    let newFolderName: string;

    const accept = ".svg, .jpg, .jpeg, .png, .gif, .doc, .docx, .pdf, .txt";

    $: console.log($path[1]);

    async function addFolder(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const folder = data.get("folder");
        await post(`/files/${folder}/`);
        goto(`/files/${folder}/`);
    }

    async function renameFolder() {
        await patch(`/files/${$path[1] || ""}/${newFolderName}`);
        reload();
    }

    async function deleteFolder(file = "") {
        await del(`/files/${$path[1] || ""}/${file}`);
        if (file) reload();
        else backToRoot();
    }

    function addFiles(e: InputEvent) {
        files = e.currentTarget.files;
        console.log(files);
    }

    async function upload(e: SubmitEvent) {
        const promises = Array.from(files || [])?.map((file) => {
            console.log(typeof file);
            return post(`/files/${$path[1] || ""}/${file.name}`, file);
        });

        await Promise.all(promises);

        clearFiles();
        reload();
    }

    async function download() {
        return await get(`/files/${$path[1] || ""}/`);
    }

    function clearFiles() {
        files = "" as unknown as FileList;
    }

    function backToRoot() {
        redirect("/files");
    }

    const reload = () => (promise = download());
</script>

<!-- <h1>Files</h1> -->

<nav class="text-center cols nowrap col-fit justify-start scroll-x">
    <a href="#add-folder" role="button" target="_self" class="box link">
        <i class="icon icon-svg icon-125x icon-folder-plus" />
    </a>
    <a href="/files" role="button" class:disabled={!$path[1]}>/</a>
    {#each repo?.folders as folder}
        <a
            href="/files/{folder}"
            role="button"
            class:chip={$path[1] === folder}
            class:disabled={$path[1] === folder}
        >
            {folder}
            {#if $path[1] === folder}
                <button
                    class="box link text-error"
                    on:click={() => deleteFolder()}
                >
                    <i class="icon icon-svg icon-trash" />
                </button>
            {/if}
        </a>
    {/each}
</nav>

<article>
    <!-- <header class="cols col-fit">
        {#if !["/", $path[1]].includes(newFolderName)}
            <button class="action link" on:click={renameFolder}>
                <i class="icon icon-svg icon-edit" />
            </button>
        {/if}
        <h3 contenteditable="true" bind:textContent={newFolderName}>
            {repo.folder || "/"}
        </h3>
        {#if $path[1]}
            <button
                class="action link text-error"
                on:click={() => deleteFolder()}
            >
                <i class="icon icon-svg icon-trash" />
            </button>
        {/if}
    </header> -->
    <Await {promise} bind:result={repo} notify on:error={backToRoot}>
        <ul role="listbox" class="grid">
            <li>
                <Form
                    method="post"
                    enctype="multipart/form-data"
                    on:reset={clearFiles}
                    on:submit={upload}
                >
                    <fieldset>
                        {#if files}
                            <h3>Selected</h3>
                            <ul>
                                {#each files as file}
                                    <li>
                                        {file.name}
                                        {(file.size / 1000).toFixed(0)} Kb
                                    </li>
                                {/each}
                            </ul>
                            <label>
                                <button class="link" type="reset">
                                    Cancel
                                </button>
                                <button class="success" type="submit">
                                    Upload
                                </button>
                            </label>
                            <!-- {:else} -->
                        {:else}
                            <label
                                role="button"
                                class:box={repo.files.length}
                                class="block link outline dashed"
                            >
                                <i
                                    class="icon icon-svg icon-file-plus icon-3x"
                                />
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
            </li>
            {#each repo.files.sort((a, b) => a.localeCompare(b)) as file (file)}
                <li>
                    {#if /\.jpeg|\.jpg|\.png|\.dng/.test(file)}
                        <a
                            href="#file-{file}"
                            role="button"
                            class="box text-break"
                            style="background-image: url('/api/v1/files/{repo.folder}/{file}')"
                            target="_self"
                        >
                            <span class="text-break">
                                {file}
                                <button
                                    id="delete"
                                    class="link box text-error"
                                    on:click={() => deleteFolder(file)}
                                >
                                    <i class="icon icon-svg icon-trash" />
                                </button>
                            </span>
                        </a>
                        <Dialog
                            open={$fragment === `file-${file}`}
                            from="center"
                            size="md"
                            info
                        >
                            <h3 slot="header">
                                /api/v1/files/{repo.folder}/{file}
                            </h3>
                            <figure>
                                <img
                                    src="/api/v1/files/{repo.folder}/{file}"
                                    alt={file}
                                />
                            </figure>
                        </Dialog>
                    {:else}
                        <!-- <p> -->
                        <a
                            href="/api/v1/files/{repo.folder}/{file}"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {file}
                            <button
                                id="delete"
                                class="box link text-error inline"
                                on:click={() => deleteFolder(file)}
                            >
                                <i class="icon icon-svg icon-trash" />
                            </button>
                        </a>

                        <!-- </p> -->
                    {/if}
                </li>
            {/each}
        </ul>
    </Await>
</article>

<Dialog open={$fragment === `add-folder`} on:submit={addFolder}>
    <h2 slot="header">Add folder</h2>
    <fieldset>
        <label>
            <input placeholder="Folder name" name="folder" />
        </label>
    </fieldset>
</Dialog>

<Dialog open={$fragment === `upload-files`} on:submit={upload}>
    <h2 slot="header">Upload files</h2>
    <fieldset>
        <label>
            <input type="file" name="files" multiple bind:files {accept} />
        </label>
        {#if files}
            <p>Selected</p>
            <ul>
                {#each files as file}
                    <li>{file.name} {(file.size / 1000).toFixed(0)} Kb</li>
                {/each}
            </ul>
        {/if}
    </fieldset>
</Dialog>

<style>
    header {
        line-height: 1.75;
        padding: var(--gap-sm) 0;
    }
    ul[role="listbox"] {
        --cols-gap: var(--gap);
        --col-width: 12.5em;
        padding: 0;
    }
    ul[role="listbox"] li {
        position: relative;
        aspect-ratio: 1/1;
    }
    ul[role="listbox"] li > a {
        flex-flow: column;
        justify-content: end;
        align-items: end;
        background-size: auto 80%;
        background-position: top center;
        background-repeat: no-repeat;
        height: 100%;
        width: 100%;
    }
    ul[role="listbox"] li > a > span {
        display: flex;
        align-items: center;
        max-width: var(--col-width);
        line-height: 1;
    }
    nav {
        --cols-gap: var(--gap-sm);
        padding-bottom: var(--gap);
    }
    nav .chip {
        padding-right: 0;
    }
    #delete {
        /* position: absolute; */
        right: 0;
    }
</style>
