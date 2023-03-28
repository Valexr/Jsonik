<script lang="ts" context="module">
    import { fragment, path, redirect } from "svelte-pathfinder";
    import { files } from "$client/stores/files.js";
    import Dialog from "$client/components/Dialog.svelte";
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
        await files.delete(`${$path[1] || ""}`, file);
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

<Dialog open={$fragment === `#file-${file}`} from="center" size="lg" img>
    {#if [".svg", ".jpg", ".jpeg", ".png", ".gif"].some( (ext) => file.includes(ext) )}
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
            <i class="icon icon-svg icon-edit" />
        </button>
        {#if editable}
            <Input
                on:submit={renameFile}
                value={file}
                pattern="^[\\w,\\-,.,%]+"
                {onclose}
            />
        {:else}
            <span class="scroll-x">{file}</span>
        {/if}
        <button id="delete" class="box text-error" on:click={deleteFile}>
            <i class="icon icon-svg icon-trash" />
        </button>
        <button id="delete" class="box" on:click={close}>
            <i class="icon icon-svg icon-x" />
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
        max-width: calc(100% - (var(--gap) * 8));
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
