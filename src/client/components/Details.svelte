<script lang="ts" context="module">
    type Aria =
        | boolean
        | "listbox"
        | "dialog"
        | "menu"
        | "true"
        | "false"
        | "grid"
        | "tree"
        | null
        | undefined;
</script>

<script lang="ts">
    export let id: string = "";
    export let role = "";
    export let top = false;
    export let open = false;
    export let button = false;
    export let disabled = false;
    export let draggable = false;
    export let invalid = false;
    export let back = false;
    export let action = (node: HTMLDetailsElement) => {};
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<details
    {id}
    {role}
    tabindex="0"
    class:top
    class:bg-back={back}
    bind:open
    {draggable}
    on:input
    use:action
>
    <summary
        tabindex="0"
        aria-haspopup={role === "list" ? "listbox" : null}
        role={button ? "button" : null}
        aria-disabled={disabled}
        class:invalid
        {...$$restProps}
    >
        <slot name="summary" />
    </summary>
    <slot />
</details>
