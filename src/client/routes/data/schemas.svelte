<script lang="ts" context="module">
    import Icon from "$client/components/Icon.svelte";
    import { SCHEMAS, schemas } from "$client/stores/data.js";
</script>

<script lang="ts">
    function addField(e: MouseEvent) {
        const { id } = e.currentTarget as HTMLButtonElement;
        const schema = SCHEMAS[Number(id)];
        schemas.add([{ id: Date.now(), ...schema }]);
    }
</script>

<ul role="listbox" class="cols">
    {#each SCHEMAS as schema, i}
        <li>
            <button
                id={String(i)}
                type="button"
                class="block link outline"
                on:click={addField}
            >
                <Icon icon={schema.type} color="gray" />
                {schema.type}
            </button>
        </li>
    {/each}
</ul>
