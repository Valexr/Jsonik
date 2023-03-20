<script lang="ts" context="module">
    import { fragment, path, goto } from "svelte-pathfinder";
    import { folders, files } from "$client/stores/files.js";
    import Await from "$client/components/Await.svelte";
    import Input from "./input.svelte";
    import Folder from "./folder.svelte";
</script>

<script lang="ts">
    async function addFolder(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        const folder = data.get("value");
        await folders.add(String(folder));
        goto(`/files/${folder}`);
    }

    function drop(node: HTMLElement, from: string) {
        const update = (from: string) => {
            const selectors = 'a[href^="/files"]:not([aria-disabled="true"])';
            const anchors: NodeListOf<HTMLElement> =
                node.querySelectorAll(selectors);

            Array.from(anchors).forEach((a) => {
                const disabled = (val: boolean) =>
                    a.setAttribute("aria-disabled", String(val));
                a.ondragover = (e: DragEvent) => {
                    e.preventDefault();
                    disabled(true);
                };
                a.ondragleave = (e: DragEvent) => disabled(false);
                a.ondrop = async (e: DragEvent) => {
                    const { dataTransfer, currentTarget } = e;
                    const { id: to } = currentTarget as HTMLElement;
                    const fileList =
                        dataTransfer?.getData("files").split(",") || [];
                    const promises = fileList.map((file) => {
                        return files.move(from, file, to);
                    });
                    await Promise.all(promises);
                    disabled(false);
                };
            });
        };
        update(from);
        return {
            update,
        };
    }

    function scroll(node: HTMLElement, path: string) {
        const update = (path: string) => {
            const selectors = 'a[href^="/files"][aria-disabled="true"]';
            const anchor = node.querySelector(selectors);
            anchor?.scrollIntoView({ behavior: "auto", inline: "end" });
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
        use:scroll={String($path[1] || "")}
        use:drop={String($path[1] || "")}
    >
        <a
            href="#add-folder"
            role="button"
            class="box outline pos-sticky"
            draggable="false"
        >
            <i class="icon icon-svg icon-125x icon-folder-plus" />
        </a>
        <a
            href="/files"
            tabindex="0"
            role="button"
            aria-disabled={!$path[1]}
            draggable="false">/</a
        >
        {#if $fragment === "add-folder"}
            <Input on:submit={addFolder} required />
        {/if}
        {#each $folders as folder}
            <Folder {folder} />
        {/each}
    </nav>
</Await>

<style>
    nav {
        margin: var(--gap-lg) 0;
    }
    [role="button"][href="#add-folder"] {
        left: 0;
        z-index: 1;
    }
</style>
