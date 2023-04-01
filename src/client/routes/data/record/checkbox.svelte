<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let value: any;
</script>

<label>
    <input type="hidden" {name} value={value || ""} />
    <input
        type="checkbox"
        role="switch"
        {name}
        {required}
        bind:checked={value}
    />&nbsp;
    <small>{name}</small>
</label>
