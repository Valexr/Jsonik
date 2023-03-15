<nav class="text-center cols col-fit justify-start nowrap scroll-x">
    <a href="#add-folder" role="button" target="_self" class="box link">
        <i class="icon icon-svg icon-125x icon-plus-square" />
    </a>
    {#each Array.from(Array(10).keys()) as key}
        <a href="/Data{key}" role="button">Data {key}</a>
    {/each}
</nav>

<style>
    nav {
        margin: var(--gap-lg) 0;
    }
</style>
