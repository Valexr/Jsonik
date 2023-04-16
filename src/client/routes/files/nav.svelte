<script lang="ts" context="module">
    import { fragment, path, goto } from "svelte-pathfinder";
    import { folders, files } from "$client/stores/files.js";
    import Await from "$client/components/Await.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Input from "./input.svelte";
    import Folder from "./folder.svelte";
    import { scrollIntoView } from "$client/utils/actions.js";
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
            const anchors: NodeListOf<HTMLAnchorElement> =
                node.querySelectorAll(selectors);
            const focused = (a: HTMLAnchorElement, val: boolean) =>
                val ? a.focus() : a.blur();

            Array.from(anchors).forEach((a) => {
                a.ondragover = (e: DragEvent) => {
                    const { dataTransfer, currentTarget } = e;
                    e.stopPropagation();
                    e.preventDefault();
                    focused(a, true);
                };
                a.ondragleave = (e: DragEvent) => focused(a, false);
                a.ondrop = async (e: DragEvent) => {
                    const { dataTransfer, currentTarget } = e;
                    const { id: to } = currentTarget as HTMLElement;
                    const fileList =
                        dataTransfer?.getData("files").split(",") || [];
                    const promises = fileList.map((file) => {
                        return files.move(from, file, to);
                    });
                    await Promise.all(promises);
                    focused(a, false);
                };
            });
        };
        update(from);
        return {
            update,
        };
    }
</script>

<Await promise={folders.get()} notify>
    <nav
        class="cols col-fit nowrap justify-start scroll-x"
        use:scrollIntoView={$path[0]}
        use:drop={$path[1]}
    >
        <a
            href="#add-folder"
            role="button"
            class="box outline pos-sticky"
            draggable="false"
        >
            <Icon icon="folder-plus" size="125x" />
        </a>
        <a
            href="/files"
            tabindex="0"
            role="button"
            aria-disabled={!$path[1]}
            draggable="false">/</a
        >
        {#if $fragment === "#add-folder"}
            <Input on:submit={addFolder} required />
        {/if}
        {#each $folders as folder}
            <Folder {folder} />
        {/each}
    </nav>
</Await>

<style>
    [href="#add-folder"] {
        left: 0;
        z-index: 1;
        background-color: var(--back);
    }
</style>
