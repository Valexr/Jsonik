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

<nav class="text-center">
    <a href="#upload-files" role="button" target="_self">
        <i class="icon icon-upload" /> Upload
    </a>
</nav>

<article>
    <Await {promise} let:result>
        <ul role="listbox" class="cols col-2">
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

<Dialog open={$fragment === `upload-files`} on:submit={upload}>
    <h2 slot="header">Upload files</h2>
    <fieldset>
        <label>
            <input type="file" multiple class="contrast" bind:files />
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
    }
    nav {
        margin-bottom: var(--gap);
    }
    .empty {
        flex: auto;
    }
</style>
