<script lang="ts" context="module">
    import { query, submit } from "svelte-pathfinder";
    import Form from "$client/components/Form.svelte";
    import type { InputEvent } from "$types/client.js";
</script>

<script lang="ts">
    function setQuery(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        $query.q = data.get("q") || "";
    }
</script>

<nav>
    <Form on:submit={submit}>
        <fieldset class="cols">
            <label>
                <input type="search" name="q" placeholder="search" />
            </label>
        </fieldset>
    </Form>
</nav>

<style>
    label {
        margin: var(--gap-lg) 0;
    }
</style>
