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
    <input type="hidden" {name} value={value || ""} />
    <small><Icon icon={type} color="gray" /> {name}</small>
    <select {name} multiple={opts.max > 1} size={opts.max} {required} {value}>
        {#each opts?.options?.split(",") as option}
            <option>{option}</option>
        {/each}
    </select>
</label>
