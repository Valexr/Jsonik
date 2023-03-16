<script lang="ts" context="module">
    import { path } from "svelte-pathfinder";
    import Logo from "$client/components/Logo.svelte";
    import Menu from "$client/views/Menu.svelte";
    import type { Repository } from "$types/client.js";
</script>

<script lang="ts">
    export let repository: Repository;
</script>

<header
    class="cols col-fit align-center pos-sticky"
    class:back-active={$path[0]}
>
    <!-- <details role="list">
        <summary aria-haspopup="listbox" role="button">Lang</summary>
        <ul role="listbox">
            <li><a href="/">ru</a></li>
            <li><a href="/logs">en</a></li>
        </ul>
    </details> -->
    <Logo {repository} />
    <Menu />
    <a href="/" role="button" class="link action">
        <i class="icon icon-svg icon-125x icon-power" />
    </a>
</header>
