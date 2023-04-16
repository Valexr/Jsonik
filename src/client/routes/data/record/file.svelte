<script lang="ts" context="module">
    import { files } from "$client/stores/files.js";
    import { toast } from "$client/components/Toaster/toast.js";
    import Icon from "$client/components/Icon.svelte";
    import Await from "$client/components/Await.svelte";
    import LightBox from "$client/components/LightBox.svelte";
    import type { InputEvent } from "$types/client.js";
</script>

<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let opts: any;
    export let value: any = [];
    export let collection: string;
    export let recordID: number;

    let deletedFile: File & string;

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

        if (
            maxFiles &&
            Number(input.files?.length || 0) + value.length > maxFiles
        ) {
            const msg = `Only ${opts.maxFiles} files can be selected`;
            toast.error({ msg, timeout: 3000 });
            input.setCustomValidity(msg);
            input.value = "";
        } else if (maxSize) {
            if (input.files) {
                for (const file of input.files) {
                    if (file.size > maxSize) {
                        const msg = `${file.name} larger then ${fileSize(
                            maxSize
                        )}`;
                        toast.error({ msg, timeout: 3000 });
                        input.setCustomValidity(msg);
                        input.value = "";
                    }
                }
            }
        } else {
            input.setCustomValidity("");
            input.checkValidity();
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

    function deleteFile(input: HTMLInputElement, file: File) {
        function removeFileFromFileList(name: string) {
            const DT = new DataTransfer();
            if (input.files) {
                for (const file of input.files) {
                    if (name !== file.name) DT.items.add(file);
                }
            }
            return DT.files;
        }
        return {
            async update(file: File) {
                value = value.filter(({ name }: File) =>
                    name.localeCompare(file.name)
                );
                input.files = removeFileFromFileList(file.name);
                await files.delete(collection, file.name);
                input.setCustomValidity("");
                input.checkValidity();
            },
        };
    }
    let fileList: Promise<void>[] = [];

    async function uploadFiles(e: InputEvent) {
        const input = e.currentTarget;
        if (input.files) {
            for (const file of input.files) {
                if (file.name) {
                    const { name: fname, type, size } = file;
                    const filename = `${recordID}-${name}-${encodeURI(fname)}`;
                    value.push({
                        name: filename,
                        type,
                        size,
                        collection,
                        recordID,
                        field: name,
                    });
                    fileList.push(files.add(collection, file, filename));
                }
            }
            await Promise.all(fileList);
            value = value;
        }
    }
</script>

<label data-note={dataNote()} for="">
    <small><Icon icon="file" color="gray" /> {name}</small>
    {#if value.length}
        <ul role="listbox">
            {#each value as file (file)}
                <li class="cols col-fit align-center">
                    <LightBox {file} />
                    <span class="scroll-x">{file.name}</span>
                    <button
                        class="box link text-error"
                        on:click|preventDefault={() => (deletedFile = file)}
                    >
                        <Icon icon="trash" />
                    </button>
                </li>
            {/each}
        </ul>
    {/if}

    <input
        {name}
        {required}
        type="file"
        accept={opts.accept}
        multiple={opts.maxFiles > 1}
        on:input={checkLimits}
        on:change={uploadFiles}
        use:deleteFile={deletedFile}
    />
    <input type="hidden" {name} value={JSON.stringify(value)} />
</label>

<style>
    ul[role="listbox"] li {
        padding: var(--gap-sm);
    }
    .scroll-x {
        text-align: left;
        flex: 60%;
    }
</style>
