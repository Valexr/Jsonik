<script lang="ts" context="module">
    import gh from "$client/svg/gh.svg";
    import type { Repository } from "$types/client";
</script>

<script lang="ts">
    export let repository: Repository;
</script>

<a href={repository.url} target="_blank" rel="noreferrer" id="gh">
    {@html gh}
</a>
