<script lang="ts" context="module">
    import { tick } from "svelte";
    export type Size = "sm" | "md" | "lg" | "fs" | "";
</script>

<script lang="ts">
    export let id: string = "";
    export let size: Size = "";
    export let method = "GET";
    export let action = "";
    export let enctype = "multipart/form-data";
    export let valid = true;
    export let center = false;

    export function validate(
        form: HTMLFormElement,
        valid: (value: boolean) => void
    ) {
        setTimeout(() => valid(form.checkValidity()), 0);
        form.oninput = () => valid(form.checkValidity());
    }
</script>

<form
    {id}
    {method}
    {action}
    {enctype}
    on:submit|preventDefault
    on:reset|preventDefault
    on:change
    on:input
    class={size}
    class:center
    use:validate={(value) => (valid = value)}
>
    <slot />
</form>
