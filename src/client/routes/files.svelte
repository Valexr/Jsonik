<script lang="ts" context="module">
    import { fragment } from "svelte-pathfinder";
    import { get, post } from "$client/api/methods";
    import Form from "$client/components/Form.svelte";
    import Await from "$client/components/Await.svelte";
    import Dialog from "$client/components/Dialog.svelte";
</script>

<script lang="ts">
    let files: FileList;
    let promise: Promise<void> = download();

    async function addFolder() {}

    async function upload(e: SubmitEvent) {
        console.log(e);
        for await (const file of files) {
            post(`/files//${file.name}`, file);
        }
        promise = download();
    }
    async function download() {
        return await get("/files//");
    }
</script>

<!-- <h1>Files</h1> -->

<nav class="text-center cols nowrap col-fit scroll-x">
    <a href="#add-folder" role="button" target="_self" class="action">
        <i class="icon icon-plus" />
    </a>
    <a href="/files/folder1" role="button"> Folder 1 </a>
    <a href="/files/folder2" role="button"> Folder 2 </a>
    <a href="/files/folder3" role="button"> Folder 3 </a>
    <a href="/files/folder4" role="button"> Folder 4 </a>
    <a href="/files/folder5" role="button"> Folder 5 </a>
    <a href="/files/folder6" role="button"> Folder 6 </a>
    <a href="/files/folder7" role="button"> Folder 7 </a>
    <a href="/files/folder8" role="button"> Folder 8 </a>
    <a href="/files/folder9" role="button"> Folder 9 </a>
</nav>

<article>
    <a href="#upload-files" role="button" target="_self" class="block">
        <i class="icon icon-plus" /> Upload
    </a>
    <Await {promise} let:result>
        <ul role="listbox" class="cols col-3">
            <li>
                <h3>Upload files</h3>
            </li>
            {#each result as name}
                <li>
                    {#if /\.jpeg|\.jpg|\.png/.test(name)}
                        <figure>
                            <a href="#file-{name}" target="_self">
                                <img src="/api/v1/files//{name}" alt={name} />
                            </a>
                            <figcaption>{name}</figcaption>
                        </figure>
                        <Dialog
                            open={$fragment === `file-${name}`}
                            from="center"
                            size="md"
                            info
                        >
                            <figure>
                                <img src="/api/v1/files//{name}" alt={name} />
                                <figcaption>{name}</figcaption>
                            </figure>
                        </Dialog>
                    {:else if !name.includes(".")}
                        <a href="/files//{name}">{name}</a>
                    {:else}
                        <a
                            href="/api/v1/files//{name}"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {name}
                        </a>
                    {/if}
                </li>
            {:else}
                <li class="text-cente empty">You haven't files</li>
            {/each}
        </ul>
    </Await>
</article>

<Dialog open={$fragment === `add-folder`} on:submit={addFolder}>
    <h2 slot="header">Add folder</h2>
    <fieldset>
        <label>
            <input placeholder="Folder name" />
        </label>
    </fieldset>
</Dialog>

<Dialog open={$fragment === `upload-files`} on:submit={upload}>
    <h2 slot="header">Upload files</h2>
    <fieldset>
        <label>
            <input type="file" multiple bind:files />
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
    ul {
        --cols-gap: var(--gap);
        padding: 0;
    }
    nav {
        padding-bottom: var(--gap);
    }
    .empty {
        flex: auto;
    }
</style>
