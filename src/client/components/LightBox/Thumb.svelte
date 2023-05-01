<script lang="ts" context="module">
    import { paramable } from "svelte-pathfinder";
</script>

<script lang="ts">
    export let filename: string;
    const route = paramable("/:folder/:collection");
</script>

<a
    role="button"
    class="outline box"
    href="#file-{encodeURI(filename)}"
    style="background-image: url(/api/files/{$route.collection}/{filename})"
    draggable="false"
    title={filename}
>
    {filename}
</a>

<style>
    a {
        color: transparent;
        background-size: cover;
        text-indent: -999px;
        height: 2.5em;
    }
</style>
