<script lang="ts" context="module">
    import { click, prefs } from "svelte-pathfinder";
    import { page } from "$client/routes";
    import type { Name } from "$types/client";

    Object.assign(prefs);
</script>

<script lang="ts">
    export let name: Name;
</script>

<svelte:window on:click={click} />

<svelte:head>
    <title>{name} - {$page.props.title}</title>
</svelte:head>

{#await $page.component() then { default: Route }}
    <Route />
{/await}
