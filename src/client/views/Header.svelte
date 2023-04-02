<script lang="ts" context="module">
    import { path } from "svelte-pathfinder";
    import Logo from "$client/components/Logo.svelte";
    import Icon from "$client/components/Icon.svelte";
    import Menu from "$client/views/Menu.svelte";
    import type { Repository } from "$types/client.js";
</script>

<script lang="ts">
    export let repository: Repository;
</script>

<header class="cols col-fit align-center pos-sticky" class:bg-active={$path[0]}>
    <Logo {repository} />
    <Menu />
    <a href="/" role="button" class="link action">
        <Icon icon="power" size="125x" />
    </a>
</header>
