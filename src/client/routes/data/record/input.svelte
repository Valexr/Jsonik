<script lang="ts" context="module">
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let icon: string;
    export let type: string;
    export let name: string;
    export let required: boolean;
    export let value: any;
    export let opts: any;

    function clean(obj: object | string) {
        const isObj = typeof obj === "object";
        return isObj
            ? JSON.parse(JSON.stringify(obj, (_, v) => v || undefined))
            : value || "";
    }
</script>

<label>
    <small><Icon {icon} /> {name}</small>
    <input {type} {name} {required} {...clean(opts)} value={clean(value)} />
</label>
