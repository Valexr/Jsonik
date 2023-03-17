<script lang="ts" context="module">
    import { click, prefs, path } from "svelte-pathfinder";
    import { page } from "$client/routes/index.js";
    import type { Name } from "$types/client.js";

    Object.assign(prefs);
</script>

<script lang="ts">
    export let name: Name;
</script>

<svelte:window on:click={click} />

<svelte:head>
    <title>{name} - {$page.props.title}</title>
</svelte:head>

<!-- hack for global $path -->
{#key $path}
    {#await $page.component() then { default: Route }}
        <Route />
    {/await}
{/key}
