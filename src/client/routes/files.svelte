<script lang="ts" context="module">
    import { fragment, path, paramable, back, goto } from "svelte-pathfinder";
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
        console.log(e.target, data);
        await post(`/files/${folder}/`);
        promise = download();
        goto(`/files/${folder}/`);
    }

    async function renameFolder() {
        await patch(`/files/${$path[1] || ""}/${newFolderName}`);
        promise = download();
    }

    async function deleteFolder(file = "") {
        await del(`/files/${$path[1] || ""}/${file}`);
        promise = download();
    }

    function addFiles(e: InputEvent) {
        files = e.currentTarget.files;
    }

    async function upload(e: SubmitEvent) {
        console.log(e);
        for await (const file of files) {
            post(`/files/${$path[1] || ""}/${file.name}`, file);
        }
        files = "" as unknown as FileList;
        promise = download();
    }
    async function download() {
        return await get(`/files/${$path[1] || ""}/`);
    }

    function clearFiles() {
        files = "" as unknown as FileList;
        console.log(files);
    }

    function backToRoot() {
        back("/files");
    }
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
            class:disabled={$path[1] === folder}
        >
            {folder}
        </a>
    {/each}
</nav>

<article>
    <header class="cols col-fit">
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
    </header>
    <Await {promise} bind:result={repo} notify on:error={backToRoot}>
        <ul
            role="listbox"
            class={repo.files.length ? "cols col-3" : "cols justify-center"}
        >
            <li>
                <Form on:reset={clearFiles} on:submit={upload}>
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
                        {:else}
                            <label
                                role="button"
                                class:box={repo.files.length}
                                class="block link"
                            >
                                <i
                                    class="icon icon-svg icon-file-plus icon-3x"
                                />
                                <input
                                    type="file"
                                    class="hidden"
                                    multiple
                                    {accept}
                                    on:change={addFiles}
                                />
                            </label>
                        {/if}
                    </fieldset>
                </Form>
                <!-- <h3>Upload files</h3> -->
                <!-- <i class="icon icon-svg icon-file-plus icon-2x" /> -->
                <!-- <a
                    href="#upload-files"
                    role="button"
                    target="_self"
                    class="box block link"
                >
                    <i class="icon icon-svg icon-file-plus icon-3x" />
                </a> -->
            </li>
            {#each repo.files as name}
                <li>
                    {#if /\.jpeg|\.jpg|\.png|\.dng/.test(name)}
                        <figure>
                            <a href="#file-{name}" target="_self">
                                <img
                                    src="/api/v1/files/{repo.folder}/{name}"
                                    alt={name}
                                />
                            </a>
                            <figcaption>{name}</figcaption>
                        </figure>
                        <Dialog
                            open={$fragment === `file-${name}`}
                            from="center"
                            size=""
                            info
                        >
                            <figure>
                                <img
                                    src="/api/v1/files/{repo.folder}/{name}"
                                    alt={name}
                                />
                                <figcaption>{name}</figcaption>
                            </figure>
                        </Dialog>
                    {:else if !name.includes(".")}
                        <a href="/files/{repo.folder}/{name}">{name}</a>
                    {:else}
                        <a
                            href="/api/v1/files/{repo.folder}/{name}"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {name}
                        </a>
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
    ul[role="listbox"] {
        --cols-gap: var(--gap);
        padding: 0;
    }
    nav {
        --cols-gap: var(--gap-sm);
        padding-bottom: var(--gap);
    }
    .empty {
        flex: auto;
    }
</style>
