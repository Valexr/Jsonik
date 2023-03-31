<script lang="ts" context="module">
    import Icon from "$client/components/Icon.svelte";
    import type { Repository } from "$types/client.js";
</script>

<script lang="ts">
    export let repository: Repository;
</script>

<a
    href={repository.url}
    target="_blank"
    rel="noreferrer"
    role="button"
    class="action link"
>
    <Icon icon="gh" size="15x" />
</a>
