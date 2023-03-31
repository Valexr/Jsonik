<script lang="ts" context="module">
    import { expand } from "$client/utils/actions.js";
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let type: string;
    export let name: string;
    export let required: boolean;
    export let opts: any;
    export let value: any;

    function clean(obj: object | string) {
        const isObj = typeof obj === "object";
        return isObj
            ? JSON.parse(JSON.stringify(obj, (_, v) => v || undefined))
            : value || "";
    }
</script>

<label>
    <small><Icon icon={type} color="gray" /> {name}</small>
    <textarea {value} {name} {required} {...clean(opts)} use:expand />
</label>
