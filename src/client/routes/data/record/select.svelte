<script lang="ts" context="module">
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let icon: string;
    export let name: string;
    export let required: boolean;
    export let opts: any;
    export let value: any = "";
</script>

<label>
    <small><Icon {icon} /> {name}</small>
    {#if opts.size > 1}
        <select {name} multiple size={opts.size} {required} bind:value>
            {#each opts?.options?.split(",") as option}
                <option>{option}</option>
            {/each}
        </select>
    {:else}
        <select {name} size={opts.size} {required} bind:value>
            {#each opts?.options?.split(",") as option}
                <option>{option}</option>
            {/each}
        </select>
    {/if}
    <input type="hidden" {name} value={value || ""} />
</label>
