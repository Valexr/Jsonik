<script lang="ts" context="module">
    import { fragment, path } from "svelte-pathfinder";
    import Gh from "$lib/components/Gh.svelte";
    import Aside from "$lib/components/Aside.svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import Router from "$lib/components/Router.svelte";
    import type { Name, Repository } from "$types";
</script>

<script lang="ts">
    export let name: Name;
    export let repository: Repository;
</script>

<header class="cols col-fit align-center">
    <!-- <a href="#dialog" target="_self" role="button">Dialog</a> -->
    <details role="list">
        <!-- svelte-ignore a11y-no-redundant-roles -->
        <summary aria-haspopup="listbox" role="button">Menu</summary>
        <ul role="listbox">
            <li><a href="/">Home</a></li>
            <li><a href="/logs">Logs</a></li>
            <li><a href="/settings">Settings</a></li>
        </ul>
    </details>
    <h1 id="name">
        <Gh {repository} />
        {name}
    </h1>
    <a href="#aside" target="_self" role="button">Aside</a>
</header>
