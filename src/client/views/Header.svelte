<script lang="ts" context="module">
    import { fragment, path, pattern } from "svelte-pathfinder";
    import { routes, page } from "$client/routes/routes";
    import Gh from "$client/components/Gh.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Router from "$client/components/Router.svelte";
    import type { Name, Repository } from "$types/client";
</script>

<script lang="ts">
    export let repository: Repository;
</script>

<header class="cols col-fit align-center">
    <!-- <details role="list">
        <summary aria-haspopup="listbox" role="button">Lang</summary>
        <ul role="listbox">
            <li><a href="/">ru</a></li>
            <li><a href="/logs">en</a></li>
        </ul>
    </details> -->
    <Gh {repository} />
    <details role="list">
        <!-- svelte-ignore a11y-no-redundant-roles -->
        <summary aria-haspopup="listbox" role="button" class="link">
            <!-- <i class="icon icon-apps" /> -->
            {$page.props.title}
        </summary>
        <ul role="listbox">
            {#each routes.filter((r) => r.props.menu) as { match, props: { title, menu } }}
                <li class:active={$pattern(match)}>
                    <a href={menu}>{title}</a>
                </li>
            {/each}
        </ul>
    </details>
    <a href="#aside" role="button" class="link box">
        <i class="icon icon-shutdown" />
    </a>
</header>
