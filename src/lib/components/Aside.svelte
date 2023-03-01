<script lang="ts" context="module">
    import { fly } from "svelte/transition";
    import { clickout } from "$lib/utils/actions";
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
        transition:fly={{
            x: aside.offsetWidth * X,
            y: aside.offsetHeight * Y,
            opacity: 1,
        }}
        use:clickout={close}
        bind:this={aside}
    >
        <header>
            <slot name="header" />
            <button id="close" on:click={close} class="action">
                <i class="icon icon-close" />
            </button>
        </header>
        <article>
            <slot />
        </article>
    </aside>
{/if}
