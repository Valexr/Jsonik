<script lang="ts" context="module">
    import { fragment } from "svelte-pathfinder";
    import Aside from "$client/components/Aside.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Form from "$client/components/Form.svelte";
    import Header from "$client/views/Header.svelte";
    import Footer from "$client/views/Footer.svelte";
    import Router from "$client/components/Router.svelte";
    import Toaster from "$client/components/Toaster/Toaster.svelte";
    import type { Name, Repository } from "$types/client.js";
    import { expand } from "./utils/actions.js";
</script>

<script lang="ts">
    export let name: Name;
    export let repository: Repository;
</script>

<Header {repository} />

<main class="container">
    <Router {name} />

    <Aside open={$fragment === "aside"} right>
        <h2 slot="header">Aside</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <details>
            <summary>details</summary>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </details>
    </Aside>

    <Dialog open={$fragment === "dialog"}>
        <h2 slot="header">Dialog</h2>
        <Form>
            <h2>Form</h2>
            <fieldset>
                <legend>Select</legend>
                <label>
                    <select>
                        <option value="" disabled selected>Select</option>
                        <option>Action</option>
                        <option>Another action</option>
                        <option>Something else here</option>
                    </select>
                </label>
            </fieldset>
            <fieldset>
                <legend>Input</legend>
                <label><input type="search" placeholder="Search" /></label>
                <label><input placeholder="input" /></label>
                <label><textarea use:expand placeholder="textarea" /></label>
                <label><input type="number" placeholder="number" /></label>
                <label><input type="time" placeholder="time" /></label>
                <label><input type="date" placeholder="date" /></label>
            </fieldset>
            <fieldset>
                <legend>Checkbox</legend>
                <label><input type="checkbox" /> Checkbox</label>
                <label><input type="checkbox" role="switch" /> Switch</label>
            </fieldset>
            <fieldset>
                <legend>Radio</legend>
                <label>
                    <input type="radio" name="size" value="small" checked /> Small
                </label>
                <label>
                    <input type="radio" name="size" value="medium" /> Medium
                </label>
                <label>
                    <input type="radio" name="size" value="large" /> Large
                </label>
                <label>
                    <input
                        type="radio"
                        name="size"
                        value="extralarge"
                        disabled
                    /> Extra Large
                </label>
            </fieldset>
        </Form>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
        </p>
    </Dialog>
</main>

<Footer />

<Toaster />

<style>
    @import "app.css";
</style>
