<script lang="ts">
    import { tick } from "svelte";

    export let id: string = "";
    export let method = "GET";
    export let action = "";
    export let enctype = "text/plain";
    export let valid = false;

    export function validate(
        form: HTMLFormElement,
        valid: (value: boolean) => void
    ) {
        setTimeout(() => valid(form.checkValidity()), 100);
        form.oninput = () => valid(form.checkValidity());
    }
</script>

<form
    {id}
    {method}
    {enctype}
    {action}
    on:submit|preventDefault
    on:reset|preventDefault
    on:change
    on:input
    use:validate={(value) => (valid = value)}
>
    <slot />
</form>
