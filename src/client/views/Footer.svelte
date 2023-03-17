<script lang="ts" context="module">
    import Search from "$client/components/Search.svelte";
    import Details from "$client/components/Details.svelte";
</script>

<footer class="pos-sticky container">
    <!-- <Details top summary="" /> -->
    <Search />
    <!-- <p class="text-center">© {new Date().getFullYear()} Jsonik</p> -->
</footer>

<style>
    footer {
        --viewport: 30em;
        bottom: 0;
        padding: var(--gap-sm) 0;
    }
</style>
