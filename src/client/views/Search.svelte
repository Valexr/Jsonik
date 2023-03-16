<script lang="ts" context="module">
    import { submit } from "svelte-pathfinder";
</script>

<form on:submit={submit}>
    <fieldset>
        <label>
            <input type="search" name="q" placeholder="search" />
        </label>
    </fieldset>
</form>
