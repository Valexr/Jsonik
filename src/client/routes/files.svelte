<script lang="ts" context="module">
    import {
        fragment,
        path,
        paramable,
        back,
        goto,
        redirect,
    } from "svelte-pathfinder";
    import { del, get, patch, post } from "$client/api/methods.js";
    import Form from "$client/components/Form.svelte";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import type { InputEvent } from "$types/client.js";

    type Repo = { files: string[]; folders: string[]; folder: string };
</script>

<script lang="ts">
    let files: FileList | null;
    let promise: Promise<void> = download();
    let repo: Repo = { files: [], folders: [], folder: "" };
    let newFolderName: string;

    const accept =
        ".svg, .jpg, .jpeg, .png, .gif, .doc, .docx, .pdf, .txt, .md";

    async function addFolder(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const folder = data.get("folder");
        await post(`/files/${folder}/`);
        goto(`/files/${folder}`);
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

<nav class="text-center cols nowrap col-fit justify-start scroll-x">
    <a href="#add-folder" role="button" class="box link">
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
                <li class:aspect-ration-1-1={repo.files?.length}>
                    <a
                        href="#file-{file}"
                        role="button"
                        class="box"
                        style="--background-image: url('/api/v1/files/{repo.folder}/{file}')"
                    >
                        <span>
                            <small class="text-ellepsis text-color">
                                {file}
                            </small>
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
                        <h3 slot="header" class="scroll-x">
                            /api/v1/files/{repo.folder}/{file}
                        </h3>
                        <figure>
                            <img
                                src="/api/v1/files/{repo.folder}/{file}"
                                alt={file}
                            />
                        </figure>
                    </Dialog>
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

<style>
    ul[role="listbox"] {
        --cols-gap: var(--gap);
        --col-width: 12.5em;
        padding: 0;
    }
    ul[role="listbox"] li {
        position: relative;
    }
    ul[role="listbox"] li > a {
        flex-flow: column;
        justify-content: end;
        align-items: end;
        height: 100%;
        width: 100%;
    }
    ul[role="listbox"] li > a::before {
        content: "";
        height: inherit;
        width: inherit;
        border-radius: inherit;
        background-size: cover;
        background-image: var(--background-image);
    }
    ul[role="listbox"] li > a > span {
        display: flex;
        align-items: center;
        justify-content: end;
        width: inherit;
        max-width: calc(var(--col-width) - var(--gap));
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
