<script lang="ts" context="module">
    import { fragment, path, pattern } from "svelte-pathfinder";
    import { routes, page } from "$client/routes";
    import Gh from "$client/components/Gh.svelte";
    import Aside from "$client/components/Aside.svelte";
    import Dialog from "$client/components/Dialog.svelte";
    import Router from "$client/components/Router.svelte";
    import type { Name, Repository } from "$types/client";
</script>

<script lang="ts">
    export let repository: Repository;
</script>

<header class="cols col-fit align-center pos-sticky">
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
            <i class="icon icon-svg icon-{$page.props.icon}" />
            {$page.props.title}
        </summary>
        <ul role="listbox">
            {#each routes.filter((r) => r.props.menu) as { match, props: { title, menu, icon } }}
                <li class:active={$pattern(match)}>
                    <a href={menu}>
                        <i class="icon icon-svg icon-{icon}" />
                        {title}
                    </a>
                </li>
            {/each}
        </ul>
    </details>
    <a href="#aside" role="button" class="link action">
        <i class="icon icon-svg icon-125x icon-power" />
    </a>
</header>
