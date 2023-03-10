<script lang="ts">
    export let role = "list";
    export let summary = "button";
    export let listbox = "listbox";
    export let top = false;
</script>

<details {role} class:top>
    <!-- svelte-ignore a11y-no-redundant-roles -->
    <summary aria-haspopup="listbox" role={summary}>Menu</summary>
    <ul role={listbox}>
        <li><a href="/">Home</a></li>
        <li><a href="/logs">Logs</a></li>
        <li><a href="/settings">Settings</a></li>
    </ul>
</details>
