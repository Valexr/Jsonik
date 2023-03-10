<script lang="ts" context="module">
    import { click, prefs, redirect, goto } from "svelte-pathfinder";
    import { page } from "$client/routes/routes";
    import type { Name, Repository } from "$types/client";

    Object.assign(prefs, { scroll: true });
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
