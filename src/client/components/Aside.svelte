<script lang="ts" context="module">
    import { fly } from "svelte/transition";
    import { clickout, clickOutside } from "$client/utils/actions.js";
</script>

<script lang="ts">
    export let id = "";
    export let open = false;
    export let top = false;
    export let right = false;
    export let bottom = false;
    export let left = false;

    let aside: HTMLElement;

    const X = left ? -1 : right ? 1 : 0;
    const Y = top ? -1 : bottom ? 1 : 0;

    const close = () => history.back();
</script>

{#if open}
    <aside
        {id}
        class:top
        class:right
        class:bottom
        class:left
        class:open
        transition:fly={{
            x: aside.offsetWidth * X,
            y: aside.offsetHeight * Y,
            opacity: 1,
        }}
        use:clickOutside={close}
        bind:this={aside}
    >
        <header>
            <slot name="header" />
            <button id="close" class="action" on:click={close}>
                <i class="icon icon-svg icon-x icon-1x" />
            </button>
        </header>
        <article>
            <slot />
        </article>
    </aside>
{/if}
