<script lang="ts" context="module">
    import { marked } from "marked";
    import Code from "$client/components/Code.svelte";
    import Icon from "$client/components/Icon.svelte";
</script>

<script lang="ts">
    export let name: string;
    export let required: boolean;
    export let value: any;
    // export let opts: any;

    let output = value;
</script>

<label>
    <textarea class="hidden" {name} {required} value={output} />
    <small><Icon icon="markdown" color="gray" /> {name}</small>
    <Code invalid={required && !output} input={value} bind:output />
    {#if output}
        {@html marked.parse(output)}
    {/if}
</label>
