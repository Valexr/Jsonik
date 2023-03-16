<script lang="ts">
    export let id: string;
    export let layer = "surface-1";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<article class="{layer} cols col-fit nowrap align-center" {id} on:click>
    <slot />
    <nav class="cols align-center">
        <slot name="action" />
    </nav>
    <slot name="info" />
</article>

<style>
    article {
        background-color: var(--surface);
        padding: var(--gap);
        border-radius: var(--border-radius-sm);
        max-width: 100%;
    }
    article::before {
        content: "#" attr(id) "";
        font-size: small;
        color: var(--gray);
    }
    article > :global(*) {
        white-space: nowrap;
        /* text-overflow: ellipsis; */
        /* overflow: hidden; */
    }
    article nav {
        flex: initial;
        min-width: fit-content;
    }
    article:hover {
        background: var(--hover);
    }
</style>
