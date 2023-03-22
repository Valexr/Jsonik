<script lang="ts" context="module">
    import { submit } from "svelte-pathfinder";
</script>

<script lang="ts">
    export let collapsed = false;
    let value: string;
</script>

<form on:submit={submit}>
    <fieldset>
        <label>
            <input
                name="q"
                bind:value
                type="search"
                placeholder="search"
                class:collapsed={collapsed && !value}
            />
        </label>
    </fieldset>
</form>

<style>
    [type="search"].collapsed {
        padding-right: 0;
        width: 2.5em;
    }
    [type="search"].collapsed::placeholder {
        color: transparent;
    }
    [type="search"].collapsed:is(:focus, :focus-visible) {
        padding-right: var(--gap);
        width: 100%;
    }
    [type="search"].collapsed:is(:focus, :focus-visible)::placeholder {
        color: var(--gray);
    }
    form label {
        margin-bottom: 0;
    }
</style>
