<script lang="ts" context="module">
    import { redirect } from "svelte-pathfinder";
    import Form from "$client/components/Form.svelte";
</script>

<script lang="ts">
    function login() {
        redirect("/data");
    }
</script>

<section>
    <article class="back-active">
        <Form on:submit={login}>
            <fieldset>
                <label>
                    <input placeholder="email" />
                </label>
                <label>
                    <input type="password" placeholder="password" />
                </label>
            </fieldset>
            <fieldset class="cols">
                <button type="reset">Cancel</button>
                <button type="submit" class="success">Login</button>
            </fieldset>
        </Form>
    </article>
</section>

<style>
    /* :global(main) {
        --viewport: 20em;
    } */
    .cols {
        --cols-gap: var(--gap-sm);
    }
</style>
