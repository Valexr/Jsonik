<script lang="ts" context="module">
    import { files } from "$client/stores/files.js";
    import { toast } from "$client/components/Toaster/toast.js";
    import Icon from "$client/components/Icon.svelte";
    import Await from "$client/components/Await.svelte";
    import LightBox from "$client/components/LightBox.svelte";
    import type { InputEvent } from "$types/client.js";

    export type FileOpts = {
        maxFiles: number;
        maxSize: number;
        accept: string;
    };
</script>

<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let opts: FileOpts;
    export let value: any = [];
    export let collection: string;
    export let recordID: number;

    function fileSize(size: number) {
        if (size < 1024) {
            return `${size} bytes`;
        } else if (size >= 1024 && size < 1048576) {
            return `${(size / 1024).toFixed(1)} KB`;
        } else if (size >= 1048576) {
            return `${(size / 1048576).toFixed(1)} MB`;
        }
    }

    function checkLimits(e: InputEvent) {
        const input = e.currentTarget;
        const { maxFiles, maxSize } = opts;
        const toastError = (msg: string) =>
            toast.error({ msg, timeout: 3000, pos: "bottom_right" });

        if (value.length > maxFiles) {
            const msg = `Only ${opts.maxFiles} files can be selected`;
            toastError(msg);
            input.value = "";
        } else if (maxSize && input.files) {
            for (const file of input.files) {
                if (file.size > maxSize) {
                    const msg = `${file.name} larger then ${fileSize(maxSize)}`;
                    toastError(msg);
                    input.value = "";
                }
            }
        }
    }

    function dataNote() {
        const accept = opts?.accept ? `Accept: ${opts?.accept}` : "";
        const maxFiles = opts?.maxFiles ? `maxFiles: ${opts?.maxFiles}` : "";
        const maxSize = opts?.maxSize
            ? `maxSize: ${fileSize(opts?.maxSize)}`
            : "";
        return `${accept} ${maxFiles} ${maxSize}`;
    }

    let fileList: Promise<void>[] = [];

    async function uploadFiles(e: InputEvent) {
        const input = e.currentTarget;
        if (input.files) {
            for (const file of input.files) {
                if (file.name) {
                    const { name: fname, type, size } = file;
                    const filename = `${recordID}-${name}-${encodeURI(fname)}`;
                    value.push({ name: filename, type, size, collection });
                    fileList.push(files.add(collection, file, filename));
                }
            }
            await Promise.all(fileList);
            value = value;
        }
    }

    async function deleteFile(e: MouseEvent) {
        const { id: filename } = e.currentTarget as HTMLButtonElement;
        value = value.filter(({ name }: File) => name.localeCompare(filename));
        await files.delete(collection, [filename]);
    }
</script>

<label data-note={dataNote()}>
    <small><Icon icon="file" color="gray" /> {name}</small>
    {#if value.length}
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        <ul role="listbox">
            {#each value as file (file)}
                <li class="cols col-fit align-center">
                    <LightBox {file} />
                    <span class="scroll-x">{file.name}</span>
                    <button
                        id={file.name}
                        class="box link text-error"
                        on:click={deleteFile}
                    >
                        <Icon icon="trash" />
                    </button>
                </li>
            {/each}
        </ul>
    {/if}

    <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
    <label role="button" aria-disabled={value.length >= opts.maxFiles}>
        <Icon icon="file-plus" /> Add files
        <input
            {name}
            {required}
            type="file"
            accept={opts.accept}
            multiple={opts.maxFiles > 1}
            disabled={value.length >= opts.maxFiles}
            on:input={checkLimits}
            on:change={uploadFiles}
        />
    </label>
    <input type="hidden" {name} value={JSON.stringify(value)} />
</label>

<style>
    ul[role="listbox"] li {
        margin: var(--gap-sm) 0;
    }
    .scroll-x {
        text-align: left;
        flex: 60%;
    }
    label[role="button"] {
        margin: var(--gap-sm) 0 0;
        display: flex;
    }
    label[role="button"] input {
        display: none;
    }
</style>
