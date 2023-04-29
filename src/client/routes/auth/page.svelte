<script lang="ts" context="module">
    import { redirect } from "svelte-pathfinder";
    import { auth, type Creds } from "$client/stores/auth";
    import Form from "$client/components/Form.svelte";
</script>

<script lang="ts">
    let valid = false;
    function login(e: SubmitEvent) {
        const data = new FormData(e.currentTarget as HTMLFormElement);
        const creds = Object.fromEntries(data) as unknown as Creds;
        // auth.login(creds);
        redirect("/data");
    }
</script>

<section>
    <article>
        <Form on:submit={login} bind:valid>
            <!-- <h3>Auth</h3> -->
            <fieldset>
                <label>
                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        required
                    />
                </label>
                <label>
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        minlength="8"
                        required
                    />
                </label>
                <label>
                    <input type="checkbox" name="remember" /> Remeber me
                </label>
            </fieldset>
            <nav class="cols">
                <button type="submit" class="text-success" disabled={!valid}>
                    Login
                </button>
            </nav>
        </Form>
    </article>
</section>
