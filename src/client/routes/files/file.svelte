<script lang="ts" context="module">
    import { fragment, path, redirect } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import { collections, records } from "$client/stores/data.js";
    import Dialog from "$client/components/Dialog.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Input from "./input.svelte";
</script>

<script lang="ts">
    export let file: string;

    let editable = false;

    async function renameFile(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const name = data.get("value");
        await files.rename(`${$path[1] || ""}`, file, String(name));
        redirect(`/files/${$path[1] || ""}`);
    }

    async function deleteFile() {
        if ($collections.includes($path[1])) {
            await records.deleteFiles(`${$path[1] || ""}`, [file]);
        }
        await files.delete(`${$path[1] || ""}`, [file]);
    }

    function onclose() {
        editable = false;
    }

    function close() {
        fragment.set("");
    }
</script>

<!-- svelte-ignore a11y-missing-content -->
<a
    draggable="false"
    href="#file-{encodeURI(file)}"
    style="background-image: url('/api/v1/files/{`${$path[1] || ''}`}/{file}')"
/>
<label>
    <slot>
        {file}
    </slot>
</label>

<Dialog
    on:close={close}
    open={$fragment === `#file-${file}`}
    from="center"
    size="lg"
    img
>
    {#if [".svg", ".jpg", ".jpeg", ".png", ".gif", ".dng"].some( (ext) => file.includes(ext) )}
        <figure>
            <img src={`/api/v1/files/${$path[1] || ""}/${file}`} alt={file} />
        </figure>
    {/if}
    <nav slot="footer" class="cols col-fit nowrap">
        <button
            id="rename"
            class="box"
            on:click|preventDefault={() => (editable = true)}
        >
            <Icon icon="edit" />
        </button>
        {#if editable}
            <Input
                value={file}
                on:submit={renameFile}
                pattern="^[\w|\-|.|%]+"
                placeholder="File name"
                {onclose}
            />
        {:else}
            <span class="scroll-x">{file}</span>
        {/if}
        <button class="box text-error" on:click={deleteFile}>
            <Icon icon="trash" />
        </button>
        <button class="box" type="reset">
            <Icon />
        </button>
    </nav>
</Dialog>

<style>
    a {
        flex: auto;
        width: 100%;
        background-size: cover;
    }
    nav.cols {
        --cols-gap: 0;
    }
    .cols span {
        flex: auto;
        text-align: left;
        max-width: calc(100% - var(--gap));
    }
    label {
        display: flex;
        align-items: center;
        justify-content: start;
        flex-wrap: nowrap;
        width: 100%;
        margin: 0;
        padding: 0 var(--gap-sm);
    }
</style>
