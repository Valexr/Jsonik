<script lang="ts" context="module">
    // import { media } from "@slidy/media";
    import Icon from "$client/components/Icon.svelte";
    import Details from "$client/components/Details.svelte";
    import { pattern, path } from "svelte-pathfinder";
    import { routes, page } from "$client/routes/index.js";
</script>

<script lang="ts">
    // console.log($path);
</script>

<menu>
    <Details role="list" button class="link">
        <svelte:fragment slot="summary">
            <Icon icon={$page.props.icon} />
            {$page.props.title}
        </svelte:fragment>

        {#if $path[0]}
            <ul role="listbox">
                {#each routes.filter((r) => r.props.menu) as { match, props: { title, menu, icon } }}
                    <li class:active={$pattern(match)}>
                        <a href={menu}>
                            <Icon {icon} />
                            {title}
                        </a>
                    </li>
                {/each}
            </ul>
        {/if}
    </Details>
</menu>
