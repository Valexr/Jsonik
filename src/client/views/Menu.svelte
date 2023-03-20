<script lang="ts" context="module">
    // import { media } from "@slidy/media";
    import { pattern, path } from "svelte-pathfinder";
    import { routes, page } from "$client/routes/index.js";
</script>

<script lang="ts">
    // console.log($path);
</script>

<menu>
    <details role="list">
        <!-- svelte-ignore a11y-no-redundant-roles -->
        <summary aria-haspopup="listbox" role="button" class="link">
            <i class="icon icon-svg icon-{$page.props.icon}" />
            {$page.props.title}
        </summary>
        <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
        {#if $path[0]}
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
        {/if}
    </details>
</menu>
