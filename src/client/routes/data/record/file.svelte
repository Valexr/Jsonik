<script lang="ts" context="module">
    import { toast } from "$client/components/Toaster/toast.js";
    import Icon from "$client/components/Icon.svelte";
    import LightBox from "$client/components/LightBox.svelte";
    import type { InputEvent } from "$types/client.js";
</script>

<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let opts: any;
    export let value: any = [];

    let inputFiles: FileList | null;
    let deletedFile: File & string;

    // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types

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
        const input = e.currentTarget as HTMLInputElement;
        const { maxFiles, maxSize } = opts;

        inputFiles = input.files;

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
            update(file: File) {
                value = value.filter(({ name }: File) =>
                    name.localeCompare(file.name)
                );
                inputFiles = removeFileFromFileList(file.name);
                input.files = inputFiles;
                input.setCustomValidity("");
                input.checkValidity();
            },
        };
    }
</script>

<label data-note={dataNote()} for="">
    <small><Icon icon="file" color="gray" /> {name}</small>
    {#if value.length || inputFiles?.length}
        <ul role="listbox">
            {#each value.concat(...(inputFiles || [])) as file (file)}
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
        use:deleteFile={deletedFile}
    />
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
