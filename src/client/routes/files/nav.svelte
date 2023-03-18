<script lang="ts" context="module">
    import { fragment, path, goto, redirect } from "svelte-pathfinder";
    import { folders, files } from "$client/stores/files.js";
    import Await from "$client/components/Await.svelte";
    import Form from "$client/components/Form.svelte";
    import Dialog from "$client/components/Dialog.svelte";
</script>

<script lang="ts">
    async function addFolder(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const folder = data.get("folder");
        await folders.add(String(folder));
        goto(`/files/${folder}`);
    }

    async function deleteFolder(folder: string) {
        await folders.delete(folder);
        redirect("/files");
    }

    function drop(node: HTMLElement) {
        node.ondragover = (e: DragEvent) => {
            e.preventDefault();
            node.setAttribute("aria-disabled", "true");
        };
        node.ondragleave = (e: DragEvent) =>
            node.removeAttribute("aria-disabled");
        node.ondrop = async (e: DragEvent) => {
            const { dataTransfer, currentTarget } = e;
            const { id: to } = currentTarget as HTMLElement;
            const fileList = dataTransfer?.getData("files").split(",") || [];
            const from = `${$path[1] || ""}`;
            const promises = fileList.map((file) => {
                return files.move(from, file, to);
            });
            await Promise.all(promises);
            node.removeAttribute("aria-disabled");
        };
    }
    function close(node: HTMLInputElement) {
        node.onblur = () => fragment.set("");
        node.onkeydown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                fragment.set("");
            }
        };
    }

    function scroll(node: HTMLElement, path: string) {
        const update = (path: string) => {
            const anchors = node.querySelectorAll('a[href^="/files"]');
            const active = Array.from(anchors).find((a) => a.id.includes(path));
            console.log(document.querySelectorAll(":host"));
            active?.scrollIntoView({ behavior: "auto", inline: "end" });
        };
        update(path);
        return {
            update,
        };
    }
</script>

<Await promise={folders.get()} notify>
    <nav
        class="text-center cols nowrap col-fit justify-start scroll-x"
        use:scroll={$path[1]}
    >
        <a href="#add-folder" role="button" class="box outline pos-sticky">
            <i class="icon icon-svg icon-125x icon-folder-plus" />
        </a>
        <a
            href="/files"
            tabindex="0"
            role="button"
            aria-disabled={!$path[1]}
            use:drop>/</a
        >
        {#if $fragment === "add-folder"}
            <Form on:submit={addFolder}>
                <fieldset>
                    <label>
                        <!-- svelte-ignore a11y-autofocus -->
                        <input
                            name="folder"
                            autofocus={true}
                            placeholder="foldername"
                            pattern="^[\w,-]+"
                            use:close
                        />
                    </label>
                </fieldset>
            </Form>
        {/if}
        {#each $folders as folder}
            <a
                id={folder}
                tabindex="0"
                href="/files/{folder}"
                role="button"
                class:chip={$path[1] === folder}
                aria-disabled={$path[1] === folder}
                use:drop
            >
                <span contenteditable={$path[1] === folder}>{folder}</span>
                {#if $path[1] === folder}
                    <button
                        class="box link text-error"
                        on:click={() => deleteFolder(folder)}
                    >
                        <i class="icon icon-svg icon-trash" />
                    </button>
                {/if}
            </a>
        {/each}
    </nav>
</Await>

<!-- <Dialog open={$fragment === `add-folder`} on:submit={addFolder}>
    <h2 slot="header">Add folder</h2>
    <fieldset>
        <label>
            <input placeholder="Folder name" name="folder" />
        </label>
    </fieldset>
</Dialog> -->
<style>
    nav {
        margin: var(--gap-lg) 0;
    }
    nav .chip {
        padding-right: 0;
    }
    label {
        margin: 0;
    }
    [role="button"][href="#add-folder"] {
        left: 0;
    }
</style>
