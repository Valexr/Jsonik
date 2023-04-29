<script lang="ts" context="module">
    import Icon from "$client/components/Icon.svelte";
</script>

<h1 aria-busy="true">Users</h1>

<section>
    <article>
        <p aria-busy="true">aria-busy="true"</p>
    </article>
</section>

<button id="addUser" class="pos-sticky">
    <Icon icon="user-plus" /> Add user
</button>

<style>
    #addUser {
        bottom: 3.5rem;
    }
</style>
