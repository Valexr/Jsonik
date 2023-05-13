<script lang="ts" context="module">
    import Icon from "$client/components/Icon.svelte";
    import { schemas } from "$client/stores/data";
    import { SCHEMAS } from "$client/stores/schemas";
    import type { Schema } from "$types/server";
</script>

<script lang="ts">
    export let open = false;

    function addField(e: MouseEvent) {
        const { id } = e.currentTarget as HTMLButtonElement;
        const schema = SCHEMAS[Number(id)];
        schemas.add([{ id: Date.now(), ...schema } as Schema]);
        open = false;
    }
</script>

<ul role="listbox" class="cols">
    {#each SCHEMAS as { type, icon }, i}
        <li>
            <button
                id={String(i)}
                type="button"
                class="block link outline"
                on:click={addField}
            >
                <Icon {icon} color="gray" />
                {type}
            </button>
        </li>
    {/each}
</ul>

<style>
    ul[role="listbox"] {
        padding: var(--gap);
    }
</style>
