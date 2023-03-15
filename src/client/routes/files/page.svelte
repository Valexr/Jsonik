<script lang="ts" context="module">
    import { path, redirect } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import Await from "$client/components/Await.svelte";
    import File from "./file.svelte";
    import Upload from "./upload.svelte";
</script>

<section>
    <Await
        promise={files.get(`${$path[1] || ""}`)}
        on:error={() => redirect("/files")}
        notify
    >
        <ul role="listbox" class="grid">
            <li>
                <Upload />
            </li>
            {#each $files.sort((a, b) => a.localeCompare(b)) as file (file)}
                <li role="button" class="box">
                    <File {file} />
                </li>
            {/each}
        </ul>
    </Await>
</section>

<style>
    ul[role="listbox"] {
        --cols-gap: var(--gap-sm);
        --col-width: 9.5em;
        padding: 0;
    }
    ul[role="listbox"] li {
        flex-flow: column nowrap;
        align-items: end;
        justify-content: space-between;
        padding: 0;
    }
</style>
