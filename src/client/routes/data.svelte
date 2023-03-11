<script lang="ts" context="module">
    import Code from "$client/components/Code.svelte";
    import * as db from "$client/api/methods";
    import { expand } from "$client/utils/actions";
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
    <!-- <article>
        {#await db.get("/data/logs/") then code}
            <Code code={JSON.stringify(code, null, 2)} />
        {/await}
    </article> -->
    <article>
        <h2>Buttons</h2>
        <p>
            <a aria-busy="true" href="#_" role="button">role="button"</a>
            <a href="#_" role="button" class="disabled">role="button"</a>
        </p>
        <p>
            <button>button</button>
            <button disabled>disabled</button>
        </p>
        <p class="cols">
            <button class="primary">primary</button>
            <button class="success">success</button>
            <button class="warning">warning</button>
            <button class="error">error</button>
        </p>
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
        <h2>Forms</h2>
        <label>
            <select>
                <option value="" disabled selected>Select</option>
                <option>Action</option>
                <option>Another action</option>
                <option>Something else here</option>
            </select>
        </label>
        <label><input type="search" placeholder="Search" /></label>
        <label><input placeholder="input" /></label>
        <label><textarea use:expand placeholder="textarea" /></label>
        <label><input type="number" placeholder="number" /></label>
        <label><input type="checkbox" /> Checkbox</label>
        <label><input type="checkbox" role="switch" /> Switch</label>
        <fieldset>
            <legend>Size</legend>
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
                <input type="radio" name="size" value="extralarge" disabled /> Extra
                Large
            </label>
        </fieldset>
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
