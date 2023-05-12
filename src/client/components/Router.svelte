<script lang="ts" context="module">
    import { click, prefs, path } from "svelte-pathfinder";
    import { page } from "$client/routes";
    import ico from "$client/assets/favicon.ico";
    import png from "$client/assets/favicon.png";
    import type { Name } from "$types/client";

    // Object.assign(prefs);
</script>

<script lang="ts">
    export let name: Name;
</script>

<svelte:window on:click={click} />

<svelte:head>
    <title>{name} - {$page.props.title}</title>
    <link rel="icon" href={ico} />
    <link rel="icon" type="image/png" href={png} />
</svelte:head>

{#await $page.component() then { default: Route }}
    <Route />
{/await}
