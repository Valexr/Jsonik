<script lang="ts" context="module">
    import Code from "$client/components/Code.svelte";
    import Form from "$client/components/Form.svelte";
    import * as db from "$client/api/methods.js";
    import { expand } from "$client/utils/actions.js";
    import { current } from "$client/utils/time.js";
</script>

<script lang="ts">
    let code = `// JSON

"scripts": {
	"build": "node esbuild",
	"dev": "node esbuild --dev",
	"start": "npx derver --production --port=5050 public"
}
`;
</script>

<section class="cols">
    <nav class="text-center cols col-fit justify-start nowrap scroll-x">
        <a href="#add-folder" role="button" target="_self" class="box link">
            <i class="icon icon-svg icon-125x icon-plus-square" />
        </a>
        {#each Array.from(Array(10).keys()) as key}
            <a href="/Data{key}" role="button">Data {key}</a>
        {/each}
    </nav>
    <article class="back-active">
        <h2>Buttons</h2>
        <p class="cols">
            <a href="#_" role="button">a role="button"</a>
            <a aria-busy="true" href="#_" role="button">aria-busy="true""</a>
            <a href="#_" role="button" class="disabled">disabled</a>
        </p>
        <p class="cols">
            <button>button</button>
            <button disabled>disabled</button>
        </p>
        <nav class="cols">
            <button class="primary">primary</button>
            <button class="success">success</button>
            <button class="warning">warning</button>
            <button class="error">error</button>
        </nav>
        <p class="cols column">
            <details role="list">
                <summary aria-haspopup="listbox">Dropdown</summary>
                <ul role="listbox">
                    <li><a href="/">Home</a></li>
                    <li><a href="/logs">Logs</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
            </details>
            <details>
                <summary>details</summary>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </p>
            </details>
            <details open>
                <!-- svelte-ignore a11y-no-redundant-roles -->
                <summary role="button" class="block">
                    details summary[role="button"]
                </summary>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. <code
                        >Excepteur sint occaecat</code
                    > cupidatat non proident, sunt in culpa qui officia deserunt
                    mollit anim id est laborum.
                </p>
            </details>
        </p>
        <Code {code} />
    </article>

    <article>
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
                <label>
                    <input type="time" value={current.time()} />
                </label>
                <label>
                    <input type="date" value={current.date()} />
                </label>
                <label><input type="file" /></label>
                <label><input type="hidden" /></label>
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
    </article>

    <article>
        <details open>
            <summary><h2>Details</h2></summary>
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
    </article>
</section>
