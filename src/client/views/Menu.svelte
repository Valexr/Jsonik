<script lang="ts" context="module">
    import { pattern, path } from "svelte-pathfinder";
    import { routes, page } from "$client/routes/index";
    import Icon from "$client/components/Icon.svelte";
    import Details from "$client/components/Details.svelte";
</script>

<script lang="ts">
    let open = false;
</script>

<menu>
    <Details
        bind:open
        role="list"
        button
        class="link {!$path[0] ? 'clear' : ''}"
    >
        <svelte:fragment slot="summary">
            <Icon icon={$page.props.icon} />
            {$page.props.title}
        </svelte:fragment>

        {#if $path[0]}
            <ul role="listbox">
                {#each routes.filter((r) => r.props.menu) as { match, props: { title, menu, icon } }}
                    <li class:active={$pattern(match)}>
                        <a href={menu} on:click={() => (open = false)}>
                            <Icon {icon} />
                            {title}
                        </a>
                    </li>
                {/each}
            </ul>
        {/if}
    </Details>
</menu>
