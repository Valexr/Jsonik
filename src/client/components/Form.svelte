<script lang="ts">
    export let method = "";
    export let enctype = "";
    export let valid = false;

    export function validate(
        form: HTMLFormElement,
        valid: (value: boolean) => void
    ) {
        setTimeout(() => valid(form.checkValidity()));
        form.oninput = () => {
            valid(form.checkValidity());
        };
    }
</script>

<form
    {method}
    {enctype}
    on:submit|preventDefault
    on:reset|preventDefault
    on:change
    on:input
    use:validate={(value) => (valid = value)}
>
    <slot />
</form>
