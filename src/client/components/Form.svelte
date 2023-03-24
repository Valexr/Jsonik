<script lang="ts">
    export let id: string = "";
    export let method = "GET";
    export let action = "";
    export let enctype = "text/plain";
    export let valid = false;

    export function validate(
        form: HTMLFormElement,
        valid: (value: boolean) => void
    ) {
        setTimeout(() => valid(form.checkValidity()));
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
    on:change|preventDefault
    on:input|preventDefault
    use:validate={(value) => (valid = value)}
>
    <slot />
</form>
