<script lang="ts" context="module">
    import { redirect } from "svelte-pathfinder";
    import Form from "$client/components/Form.svelte";
</script>

<script lang="ts">
    let valid = false;
    function login() {
        redirect("/data");
    }
</script>

<section>
    <article class="">
        <Form on:submit={login} bind:valid>
            <!-- <h3>Auth</h3> -->
            <fieldset>
                <label>
                    <input type="email" placeholder="email" required />
                </label>
                <label>
                    <input
                        type="password"
                        placeholder="password"
                        minlength="8"
                        required
                    />
                </label>
            </fieldset>
            <nav class="cols">
                <!-- <button type="reset">Signin</button> -->
                <button type="submit" class="text-success" disabled={!valid}>
                    Login
                </button>
            </nav>
        </Form>
    </article>
</section>

<style>
    .cols {
        --cols-gap: var(--gap-sm);
        padding: var(--gap-sm) 0 var(--gap);
    }
</style>
