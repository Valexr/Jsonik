<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let value: boolean;
</script>

<label>
    <input
        type="checkbox"
        role="switch"
        {name}
        {required}
        bind:checked={value}
    />&nbsp;
    <small>{name}</small>
    <input type="hidden" {name} value={value || ""} />
</label>
