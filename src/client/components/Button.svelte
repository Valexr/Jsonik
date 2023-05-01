<script lang="ts" context="module">
    import Icon from "./Icon.svelte";
</script>

<script lang="ts">
    export let type: "reset" | "submit" | "button" | null | undefined =
        undefined;
    export let href = "";
    export let icon = "";
    export let tabindex = 0;
    export let draggable = false;
</script>

{#if href}
    <a role="button" {type} {href} {tabindex} {draggable} {...$$restProps}>
        <slot />
    </a>
{:else}
    <button {type} {tabindex} {draggable} on:click {...$$restProps}>
        {#if icon}<Icon {icon} />{/if}
        <slot />
    </button>
{/if}
