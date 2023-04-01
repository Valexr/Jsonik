<script lang="ts" context="module">
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let opts: any;
    export let value: any;
</script>

<label>
    <input type="hidden" {name} value={value || ""} />
    <small><Icon icon="select" color="gray" /> {name}</small>
    <select {name} multiple={opts.max > 1} size={opts.max} {required} {value}>
        {#each opts?.options?.split(",") as option}
            <option>{option}</option>
        {/each}
    </select>
</label>
