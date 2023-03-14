<script lang="ts" context="module">
    import Details from "$client/components/Details.svelte";
</script>

<footer>
    <a href="#dialog" target="_self" role="button">Dialog</a>
    <Details top summary="" />
    <p>Footer</p>
    <details role="list" class="top">
        <!-- svelte-ignore a11y-no-redundant-roles -->
        <summary aria-haspopup="listbox" role="button">Menu</summary>
        <ul role="listbox">
            <li><a href="/">Home</a></li>
            <li><a href="/logs">Logs</a></li>
            <li><a href="/settings">Settings</a></li>
        </ul>
    </details>
</footer>
