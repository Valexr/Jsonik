<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let value: any;

    function clean(obj: object | string) {
        const isObj = typeof obj === "object";
        return isObj
            ? JSON.parse(JSON.stringify(obj, (_, v) => v || undefined))
            : value || "";
    }
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
